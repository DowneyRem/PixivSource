<script setup>
/**
 * DownloadCard.vue
 * 单张下载卡片组件。
 *
 * 既支持父组件通过 props 注入 item/release/loading/getDownloadUrl，也支持直接通过
 * frontmatterSource + frontmatterIndex 从当前 VitePress 页面的 frontmatter 中读取数据。
 */

import { computed, nextTick, onMounted, ref, useSSRContext, watch } from 'vue'
import { useData } from 'vitepress'
import { renderMarkdown } from '../utils/renderMarkdown'
import { resolveRepoMeta, transformReleases } from '../utils/releases'

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  release: {
    type: Object,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  getDownloadUrl: {
    type: Function,
    default: null,
  },
  frontmatterSource: {
    type: String,
    default: 'repos',
    validator: value => ['repos', 'manual'].includes(value),
  },
  frontmatterIndex: {
    type: Number,
    default: 0,
  },
})

const { frontmatter } = useData()

const logExpanded = ref(false)
const assetsExpanded = ref(false)
const platformIconEl = ref(null)
const localRelease = ref(null)
const localLoading = ref(false)

const frontmatterList = computed(() => frontmatter.value?.[props.frontmatterSource] || [])
const cardItem = computed(() => props.item || frontmatterList.value[props.frontmatterIndex] || {})

const hasInjectedRelease = computed(() => props.release !== undefined)
const displayRelease = computed(() => hasInjectedRelease.value ? props.release : localRelease.value)
const displayLoading = computed(() => props.loading || localLoading.value)

const repoMeta = computed(() => resolveRepoMeta(cardItem.value.link || cardItem.value.github || cardItem.value.url))
const repoPlatform = computed(() => {
  if (!repoMeta.value) return null
  return {
    icon: repoMeta.value.platform,
    label: repoMeta.value.platform === 'gitee' ? 'Gitee' : 'GitHub',
    url: cardItem.value.link || cardItem.value.github || repoMeta.value.webUrl,
  }
})

if (import.meta.env.SSR) {
  const ssrContext = useSSRContext()
  if (repoPlatform.value?.icon) ssrContext?.vpSocialIcons?.add(repoPlatform.value.icon)
}

const toggleLog = () => { logExpanded.value = !logExpanded.value }
const toggleAssets = () => { assetsExpanded.value = !assetsExpanded.value }

const normalizeBody = (body) => {
  if (!body) return ''
  return String(body).includes('<') ? body : renderMarkdown(body)
}

const getTargetRelease = (releases, item) => {
  if (!releases || !releases.length) return null
  return item.prerelease ? releases[0] : (releases.find(r => !r.prerelease) || releases[0])
}

const fetchFrontmatterRelease = async () => {
  if (props.item || hasInjectedRelease.value || props.frontmatterSource !== 'repos') return

  const item = cardItem.value
  const meta = resolveRepoMeta(item.link || item.github)
  if (!meta) {
    localRelease.value = null
    return
  }

  localLoading.value = true
  try {
    const res = await fetch(meta.apiUrl)
    if (res.ok) {
      localRelease.value = getTargetRelease(transformReleases(await res.json(), meta.platform, meta.webUrl), item)
    }
  } catch (e) {
    console.error(e)
  } finally {
    localLoading.value = false
  }
}

watch(cardItem, () => {
  localRelease.value = null
  fetchFrontmatterRelease()
})

onMounted(async () => {
  fetchFrontmatterRelease()

  await nextTick()
  if (
    platformIconEl.value instanceof HTMLElement &&
    (getComputedStyle(platformIconEl.value).maskImage ||
      getComputedStyle(platformIconEl.value).webkitMaskImage) === 'none' &&
    repoPlatform.value?.icon
  ) {
    platformIconEl.value.style.setProperty(
      '--icon',
      `url('https://api.iconify.design/simple-icons/${repoPlatform.value.icon}.svg')`
    )
  }
})

const sortedAssets = computed(() => {
  if (!displayRelease.value?.assets) return []
  const keyword = cardItem.value.recommend
  return [...displayRelease.value.assets].sort((a, b) => {
    const aRec = keyword && a.name.toLowerCase().includes(keyword.toLowerCase())
    const bRec = keyword && b.name.toLowerCase().includes(keyword.toLowerCase())
    return bRec - aRec
  })
})

const visibleAssets = computed(() => {
  if (assetsExpanded.value || !cardItem.value.show_assets) return sortedAssets.value
  return sortedAssets.value.slice(0, Number(cardItem.value.show_assets))
})

const hiddenCount = computed(() => {
  if (!cardItem.value.show_assets) return 0
  return Math.max(0, sortedAssets.value.length - Number(cardItem.value.show_assets))
})

const formatSize = (bytes) => {
  if (!bytes) return ''
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

const isRecommend = (assetName) => {
  const kw = cardItem.value.recommend
  return kw && assetName.toLowerCase().includes(kw.toLowerCase())
}

const defaultDownloadUrl = (assetUrl, item) => assetUrl || item.url || ''

const resolveDownloadUrl = (assetUrl, item) => {
  const resolver = props.getDownloadUrl || defaultDownloadUrl
  let finalUrl = resolver(assetUrl, item)

  if (finalUrl.endsWith('.json')) {
    const regex = /github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/
    const match = finalUrl.match(regex)
    if (match) {
      const [_, owner, repo, tag, filename] = match;
      finalUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${tag}/${filename}`
      finalUrl = `legado://import/importonline?src=${finalUrl}`
    }
  }
  return finalUrl
}

const navToRepo = () => {
  const url = cardItem.value.link || cardItem.value.github || cardItem.value.url
  if (url) window.open(url.trim(), '_blank')
}
</script>

<template>
  <div v-if="cardItem.name" class="download-card" :class="{ 'is-expanded': logExpanded }">
    <a
        v-if="repoPlatform"
        :href="repoPlatform.url"
        target="_blank"
        rel="noopener"
        class="platform-icon-link"
        :aria-label="`前往 ${repoPlatform.label}`"
        :title="repoPlatform.label"
        @click.stop
    >
      <span ref="platformIconEl" class="vpi-social platform-icon" :class="`vpi-social-${repoPlatform.icon}`"></span>
    </a>

    <div class="main-link-area" @click="navToRepo">
      <img :src="cardItem.icon" class="card-icon" :alt="cardItem.name" />
      <div class="header-main">
        <h4>{{ cardItem.name }}</h4>
        <p class="desc">{{ cardItem.desc }}</p>
      </div>
    </div>

    <div class="card-footer-flow" v-if="displayLoading">
      <div class="card-content">
        <div class="skeleton-text" style="width:100%; height:12px; margin-bottom:1.2rem;"></div>
        <div class="skeleton-btn" style="height:38px;"></div>
      </div>
    </div>

    <div class="card-footer-flow" v-else-if="displayRelease">
      <div class="card-content">
        <div class="release-info">
          <div class="meta">
            <a :href="displayRelease.html_url" target="_blank" class="tag clickable-tag" @click.stop>
              {{ displayRelease.tag_name }}
              <span v-if="displayRelease.prerelease" class="pre-badge">(Pre-release)</span>
            </a>
            <span class="date">{{ formatDate(displayRelease.published_at) }}</span>
          </div>
        </div>

        <div v-if="displayRelease.body" class="nested-changelog-box">
          <div class="changelog-bar" @click="toggleLog">
            <span class="bar-title">
              更新内容
              <span class="indicator-emoji">{{ logExpanded ? '🔼' : '🔽' }}</span>
            </span>
          </div>
          <div class="changelog-body" :class="{ 'is-open': logExpanded }">
            <div class="markdown-render" v-html="displayRelease.body"></div>
          </div>
        </div>

        <div class="card-actions">
          <a
              v-for="asset in visibleAssets"
              :key="asset.id"
              :href="resolveDownloadUrl(asset.browser_download_url, cardItem)"
              :class="['btn', isRecommend(asset.name) ? 'is-recommend' : 'secondary']"
              target="_blank"
              @click.stop
          >
            <div class="btn-left-content">
              <div class="star-icon-slot"><span v-if="isRecommend(asset.name)">🌟</span></div>
              <span class="file-name">{{ asset.name }}</span>
            </div>
            <span v-if="asset.size" class="size-text">{{ formatSize(asset.size) }}</span>
          </a>

          <a
              v-if="visibleAssets.length === 0"
              :href="displayRelease.html_url"
              target="_blank"
              class="btn primary"
              @click.stop
          >
            <div class="btn-left-content">
              <div class="star-icon-slot"></div>
              <span class="file-name">前往网页端下载</span>
            </div>
          </a>

          <div
              v-if="hiddenCount > 0 || assetsExpanded"
              class="toggle-more-assets-btn"
              @click="toggleAssets"
          >
            {{ assetsExpanded ? '收起部分版本 🔼' : `展开更多版本 (${hiddenCount}+) 🔽` }}
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer-flow" v-else-if="cardItem.url || cardItem.label">
      <div class="card-content">
        <div class="release-info">
          <div class="meta">
            <span class="tag">{{ cardItem.version || '手动维护' }}</span>
            <span class="date">{{ cardItem.date || '' }}</span>
          </div>
        </div>

        <div v-if="cardItem.changelog" class="nested-changelog-box">
          <div class="changelog-bar" @click="toggleLog">
            <span class="bar-title">
              更新内容
              <span class="indicator-emoji">{{ logExpanded ? '🔼' : '🔽' }}</span>
            </span>
          </div>
          <div class="changelog-body" :class="{ 'is-open': logExpanded }">
            <div class="markdown-render" v-html="normalizeBody(cardItem.changelog)"></div>
          </div>
        </div>

        <div class="card-actions">
          <a
              :href="resolveDownloadUrl(cardItem.url, cardItem)"
              target="_blank"
              :class="['btn', cardItem.recommend ? 'is-recommend' : 'primary']"
              @click.stop
          >
            <div class="btn-left-content">
              <div class="star-icon-slot"><span v-if="cardItem.recommend">🌟</span></div>
              <span class="file-name">{{ cardItem.label || '立即下载' }}</span>
            </div>
            <span v-if="cardItem.size" class="size-text">{{ cardItem.size }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-card {
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  position: relative;
}
.platform-icon-link {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}
.platform-icon-link:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}
.platform-icon {
  width: 17px;
  height: 17px;
  background-color: currentColor;
}
.download-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.main-link-area {
  display: flex;
  gap: 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;
}
.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.header-main { flex: 1; min-width: 0; padding-right: 1.8rem; }
.header-main h4 {
  margin: 0 0 0.4rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  min-height: 42px;
}

.card-footer-flow { display: flex; flex-direction: column; flex: 1; }
.card-content { display: flex; flex-direction: column; flex: 1; }
.release-info { margin-bottom: 1.2rem; font-size: 0.85rem; }
.meta { display: flex; justify-content: space-between; align-items: center; }
.tag {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  gap: 6px;
}
.clickable-tag:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline !important;
}
.pre-badge { font-size: 11px; color: var(--vp-c-danger-1); font-weight: 500; }
.date { color: var(--vp-c-text-3); }

.nested-changelog-box {
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
  margin-bottom: 1rem;
  overflow: hidden;
}
.changelog-bar {
  padding: 6px 12px;
  cursor: pointer;
  user-select: none;
}
.bar-title { font-size: 11.5px; font-weight: bold; color: var(--vp-c-text-2); }
.indicator-emoji { margin-left: 4px; }
.changelog-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.changelog-body.is-open {
  max-height: 300px;
  padding: 8px 12px;
  overflow-y: auto;
  border-top: 1px dashed var(--vp-c-divider);
}
.markdown-render { font-size: 12.5px; color: var(--vp-c-text-2); line-height: 1.6; }

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: auto;
  width: 100%;
}
.btn {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  width: 100%;
  transition: all 0.2s;
  box-sizing: border-box;
}
.btn.is-recommend {
  background-color: var(--vp-c-brand-1);
  color: white !important;
  box-shadow: 0 4px 12px var(--vp-c-brand-3);
}
.btn.secondary {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}
.btn.primary {
  background-color: var(--vp-c-brand-1);
  color: white !important;
}
.btn-left-content { display: flex; align-items: center; flex: 1; min-width: 0; }
.star-icon-slot { width: 18px; flex-shrink: 0; font-size: 13px; }
.file-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
.size-text { font-size: 11px; opacity: 0.85; font-family: var(--vp-font-family-mono); flex-shrink: 0; }

.toggle-more-assets-btn {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  padding: 6px 0;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: color 0.2s;
  margin-top: 2px;
}
.toggle-more-assets-btn:hover { color: var(--vp-c-brand-2); text-decoration: underline; }

.skeleton-text,
.skeleton-btn {
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-divider) 37%, var(--vp-c-bg-alt) 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s infinite;
  border-radius: 4px;
}
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 420px) {
  .btn { flex-wrap: wrap; }
  .file-name { min-width: 100%; margin-bottom: 2px; }
  .size-text { width: 100%; text-align: left; opacity: 0.6; }
}
</style>