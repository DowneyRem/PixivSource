<script setup>
/**
 * DownloadCard.vue
 * 单张下载卡片组件。
 *
 * 既支持父组件通过 props 注入 item/release/loading/getDownloadUrl，也支持直接通过
 * frontmatterSource + frontmatterIndex 从当前 VitePress 页面的 frontmatter 中读取数据。
 *
 * repos:
 *   - name: 阅读 Sigma
 *     desc: 极致阅读体验，免费开源电子书阅读器
 *     icon: /img/LegadoSigma.png
 *     link: https://gitee.com/lyc486/legado
 *     recommend: releaseS.apk
 *     show_assets: 1
 *     prerelease: false
 *     hide: false
 *
 * manual:
 *   - name: 轻悦时光
 *     icon: /img/QYSG.png
 *     desc: 纯本地的多端兼容阅读器
 *     version: v2.5.0
 *     date: 2026/07/14
 *     changelog: "<ul><li>修复已知问题</li><li>性能优化</li><li>新增鸿蒙原生支持</li></ul>"
 *     downloads:
 *       - label: 鸿蒙版下载
 *         url: https://appgallery.huawei.com/app/detail?id=com.q9uo11.nread
 *         size: 25.5 MB
 *         recommend: true
 *       - label: Android (APK)
 *         url: https://example.com/qysg-android.apk
 *         size: 18.2 MB
 *       - label: 网页版/iOS
 *         url: https://qysg.example.com
 *         size: -
 * ---
 * <DownloadCard frontmatterSource="repos" :frontmatterIndex="0" />
 * <DownloadCard frontmatterSource="manual" :frontmatterIndex="0" />
 *
 *
 * 缓存说明：
 * - 缓存逻辑统一由 releases.ts 管理（readCache / readStaleCache / writeCache / CACHE_TTL）
 * - 请求失败时降级到过期缓存，保证页面有内容可显示
 */

import { computed, nextTick, onMounted, ref, useSSRContext, watch } from 'vue'
import { useData } from 'vitepress'
import {
  resolveRepoMeta,
  transformReleases,
  fetchAllReleases,
  getTargetRelease,
  readCache,
  readStaleCache,
  writeCache,
  CACHE_TTL,
} from '../utils/releases'

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

const { frontmatter, lang } = useData()
const i18n = {
  'zh': {
    changelog: '更新内容',
    prerelease: '(预发布版)',
    goWeb: '前往网页端下载',
    collapse: '收起部分版本 🔼',
    expand: '展开更多版本 ({count}+) 🔽',
    manual: '手动维护',
    downloadNow: '立即下载'
  },
  'zh-TW': {
    changelog: '更新內容',
    prerelease: '(预發布版)',
    goWeb: '前往網頁端下載',
    collapse: '收起部分版本 🔼',
    expand: '展開更多版本 ({count}+) 🔽',
    manual: '手動維護',
    downloadNow: '立即下載'
  },
  'en': {
    changelog: 'Changelog',
    prerelease: '(Pre-release)',
    goWeb: 'View on Web to Download',
    collapse: 'Collapse Versions 🔼',
    expand: 'Expand More Versions ({count}+) 🔽',
    manual: 'Manual Registry',
    downloadNow: 'Download Now'
  }
}

const t = computed(() => {
  const currentLang = (lang.value || '')
  const shortLang = currentLang.slice(0, 2)
  if (i18n[currentLang]) return i18n[currentLang]
  if (i18n[shortLang]) return i18n[shortLang]
  if (i18n['en']) return i18n['en']
  return i18n['zh']
})

const logExpanded = ref(false)
const assetsExpanded = ref(false)
const manualExpanded = ref(false)
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

const fetchFrontmatterRelease = async () => {
  if (props.item || hasInjectedRelease.value || props.frontmatterSource !== 'repos') return

  const item = cardItem.value
  const meta = resolveRepoMeta(item.link || item.github)
  if (!meta) {
    localRelease.value = null
    return
  }

  const cacheKey = meta.apiUrl
  const ttl = CACHE_TTL[meta.platform] || CACHE_TTL.github

  const cached = readCache(cacheKey)
  if (cached) {
    localRelease.value = getTargetRelease(cached, item)
    return
  }

  localLoading.value = true
  try {
    const rawData = await fetchAllReleases(meta.apiUrl)
    const releases = transformReleases(rawData, meta.platform, meta.webUrl)
    writeCache(cacheKey, releases, ttl)
    localRelease.value = getTargetRelease(releases, item)
  } catch (e) {
    console.error(e)
    const stale = readStaleCache(cacheKey)
    if (stale) localRelease.value = getTargetRelease(stale, item)
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
  const assets = cardItem.value.prerelease
      ? displayRelease.value.assets
      : displayRelease.value.assets.filter(asset => !isPrereleaseAsset(asset.name))

  return [...assets].sort((a, b) => {
    if (!keyword) return 0
    const kw = keyword.split(" ")
    const aIndex = kw.findIndex(k => a.name.toLowerCase().includes(k.toLowerCase()))
    const bIndex = kw.findIndex(k => b.name.toLowerCase().includes(k.toLowerCase()))
    const aMatch = aIndex !== -1
    const bMatch = bIndex !== -1
    if (aMatch && bMatch) return aIndex - bIndex
    if (aMatch) return -1
    if (bMatch) return 1
    return 0
  })
})

const isPrereleaseAsset = (assetName) => {
  return /(^|[._\-\s])(beta|alpha|pre|preview|rc|canary|nightly)(?=([._\-\s]|\d|$))/i.test(assetName || '')
}

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
  const kw = cardItem.value.recommend?.split(" ") || []
  return kw.some(item => item && assetName.includes(item))
}

const defaultDownloadUrl = (assetUrl, item) => assetUrl || item.url || ''

const resolveDownloadUrl = (assetUrl, item) => {
  const resolver = props.getDownloadUrl || ((u) => u || '')
  let finalUrl = resolver(assetUrl, item)
  if (finalUrl?.endsWith('.json')) {
    const regex = /github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/
    const match = finalUrl.match(regex)
    if (match) {
      const [_, owner, repo, tag, filename] = match
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

    <div class="card-footer-flow" style="margin-top: 1rem;" v-if="displayLoading">
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
              <span v-if="displayRelease.prerelease" class="pre-badge">{{ t.prerelease }}</span>
            </a>
            <span class="date">{{ formatDate(displayRelease.published_at) }}</span>
          </div>
        </div>

        <div v-if="displayRelease.body" class="nested-changelog-box">
          <div class="changelog-bar" @click="toggleLog">
            <span class="bar-title">
              {{ t.changelog }}
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

          <a v-if="visibleAssets.length === 0" :href="displayRelease.html_url" target="_blank" class="btn primary" @click.stop>
            <div class="btn-left-content"><span class="file-name">{{ t.goWeb }}</span></div>
          </a>

          <div v-if="hiddenCount >= 1 || assetsExpanded" class="toggle-more-assets-btn" @click="toggleAssets">
            {{ assetsExpanded ? t.collapse : t.expand.replace('{count}', hiddenCount) }}
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer-flow" v-else-if="cardItem.downloads || cardItem.url || cardItem.label">
      <div class="card-content">
        <div class="release-info">
          <div class="meta">
            <span class="tag">{{ cardItem.version || t.manual }}</span>
            <span class="date">{{ cardItem.date || '' }}</span>
          </div>
        </div>

        <div v-if="cardItem.changelog" class="nested-changelog-box">
          <div class="changelog-bar" @click="toggleLog">
            <span class="bar-title">
              {{ t.changelog }}
              <span class="indicator-emoji">{{ logExpanded ? '🔼' : '🔽' }}</span>
            </span>
          </div>
          <div class="changelog-body" :class="{ 'is-open': logExpanded }">
            <div class="markdown-render" v-html="cardItem.changelog"></div>
          </div>
        </div>

        <div class="card-actions">
          <template v-for="(dl, index) in (cardItem.downloads || [{label: cardItem.label || t.downloadNow, url: cardItem.url, size: cardItem.size, recommend: cardItem.recommend}])" :key="index">
            <a
                v-if="dl.recommend || manualExpanded || !cardItem.downloads?.some(d => d.recommend)"
                :href="resolveDownloadUrl(dl.url, cardItem)"
                target="_blank"
                :class="['btn', (cardItem.recommend || dl.recommend) ? 'is-recommend' : 'primary']"
                @click.stop
            >
              <div class="btn-left-content">
                <div class="star-icon-slot">
                  <span v-if="cardItem.recommend || dl.recommend">🌟</span>
                </div>
                <span class="file-name">{{ dl.label }}</span>
              </div>
              <span v-if="dl.size" class="size-text">{{ dl.size }}</span>
            </a>
          </template>

          <div
              v-if="cardItem.downloads?.some(d => d.recommend) && cardItem.downloads?.some(d => !d.recommend)"
              class="toggle-more-assets-btn"
              @click="manualExpanded = !manualExpanded"
          >
            {{ manualExpanded ? t.collapse : `展开其他版本 (${cardItem.downloads.filter(d => !d.recommend).length}) 🔽` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-card {
  margin-top: 16px;
  margin-bottom: 16px;
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
.markdown-render {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.3; }


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
