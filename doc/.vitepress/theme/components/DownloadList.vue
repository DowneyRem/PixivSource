<script setup>
/**
 * DownloadList.vue
 * 软件下载页面组件，负责：
 *   - 从 frontmatter.repos 读取下载卡片配置
 *   - 并发拉取 GitHub / Gitee API Release 数据
 *   - 提供「显示全部」全局开关
 *   - GitHub / CF 下载加速逻辑暂时注释保留，待可用域名稳定后再开启
 *   - 将格式化后的数据 + getDownloadUrl 函数传递给 DownloadCard 子组件
 *
 * 与 DownloadCard.vue 配合使用，放置在同一目录下即可。
 *
 * frontmatter 格式：
 *   repos:
 *     - name: 阅读 Sigma
 *       desc: 极致阅读体验
 *       icon: /img/LegadoSigma.png
 *       link: https://github.com/Luoyacheng/legado
 *       recommend: plus_releaseS    # 推荐关键词（匹配 asset 文件名）
 *       show_assets: 2              # 默认折叠后显示几个
 *       prerelease: false           # 取最新正式版还是最新预发布版
 *       hide: true                  # 不展开「显示所有」时隐藏
 *
 *     # 如需直链卡片，也放在 repos 中，无需再维护 manual 列表：
 *     - name: 某 APK
 *       desc: 说明
 *       icon: /img/xxx.png
 *       url: https://example.com/xxx.apk
 *       label: 立即下载
 *       version: "3.26"
 *       date: "2025/01/01"
 *       size: "12.3 MB"
 *       recommend: true
 *       changelog: "- 修复了 xxx\n- 新增了 yyy"
 */

import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import DownloadCard from './DownloadCard.vue'
import { renderMarkdown } from '../utils/renderMarkdown'

const { frontmatter } = useData()

// ---------- 配置读取 ----------
const repoList = computed(() => frontmatter.value.repos || [])

// ---------- 全局开关 ----------
const showAllRepos = ref(false)
// GitHub / CF 下载加速暂时关闭：CF dev 域名无法稳定加速，先保留代码便于后续恢复。
// const useGithubProxy = ref(true)

// ---------- Cloudflare Worker 代理域名（可在 .env 中配置 VITE_CF_WORKER_URL）----------
// const CF_PROXY_DOMAIN = computed(() => {
//   const raw = import.meta.env.VITE_CF_WORKER_URL || ''
//   return raw.endsWith('/') ? raw.slice(0, -1) : raw
// })

// ---------- 按需过滤卡片列表 ----------
const visibleRepoList = computed(() =>
    showAllRepos.value ? repoList.value : repoList.value.filter(item => !item.hide)
)

// ---------- API 数据存储 ----------
const releaseMap = ref({}) // { repoKey: Release[] }
const loadingMap = ref({}) // { repoKey: boolean }

const getRepoKey = (item) => item?.link || item?.github || ''

// ---------- 格式化 API 数据 ----------
const transformReleases = (rawData, platform) => {
  if (!Array.isArray(rawData)) return []

  const releases = platform === 'gitee' ? [...rawData].reverse() : rawData

  return releases.map(item => {
    const assets = (item.assets || [])
        .filter(asset => {
          const assetName = (asset.name || '').toLowerCase()
          return !assetName.endsWith('.zip') && !assetName.endsWith('.tar.gz')
        })
        .map(asset => ({
          id: platform === 'gitee' ? asset.browser_download_url : asset.id,
          name: asset.name,
          browser_download_url: asset.browser_download_url,
          size: platform === 'gitee' ? null : asset.size,
        }))

    const isPrerelease = platform === 'gitee'
        ? item.prerelease || ['beta', 'alpha', 'pre'].some(keyword => String(item.tag_name).toLowerCase().includes(keyword))
        : item.prerelease

    const tagName = String(item.tag_name).toLowerCase() === 'beta' && item.name
        ? item.name.replace(/^legado_app_/, '')
        : item.tag_name

    return {
      tag_name: tagName,
      prerelease: isPrerelease,
      published_at: platform === 'gitee' ? item.created_at : item.published_at,
      body: renderMarkdown(item.body || ''),
      html_url: platform === 'gitee'
          ? `https://gitee.com/${item.author?.login}/${item.name?.replace('legado_app_', '')}/releases`
          : item.html_url,
      assets,
    }
  })
}

// ---------- 解析仓库元信息 ----------
const resolveRepoMeta = (url) => {
  if (!url) return null

  const trimmedUrl = url.trim()

  if (trimmedUrl.includes('gitee.com/')) {
    const path = trimmedUrl.split('gitee.com/')[1].replace(/\/releases\/?$/, '').replace(/\/$/, '')
    return { platform: 'gitee', apiUrl: `https://gitee.com/api/v5/repos/${path}/releases` }
  }

  if (trimmedUrl.includes('github.com/')) {
    const path = trimmedUrl.split('github.com/')[1].replace(/\/releases\/?$/, '').replace(/\/$/, '')
    return { platform: 'github', apiUrl: `https://api.github.com/repos/${path}/releases` }
  }

  return null
}

// ---------- 下载链接转换（传递给 DownloadCard）----------
const getDownloadUrl = (assetUrl, repoItem) => {
  if (!assetUrl) return ''
  
  // GitHub / CF 下载加速暂时关闭：CF dev 域名无法稳定加速，先直接返回原始下载链接。
  // const repoLink = getRepoKey(repoItem)
  // if (repoLink.includes('gitee.com')) return assetUrl
  //
  // if (useGithubProxy.value && CF_PROXY_DOMAIN.value && assetUrl.includes('github.com')) {
  //   return `${CF_PROXY_DOMAIN.value}/${assetUrl}`
  // }

  return assetUrl
}

// ---------- 取目标 Release ----------
const getTargetRelease = (repoItem) => {
  const releases = releaseMap.value[getRepoKey(repoItem)]
  if (!releases?.length) return null

  return repoItem.prerelease
      ? releases[0]
      : releases.find(release => !release.prerelease) || releases[0]
}

const fetchRepoRelease = async (repoItem) => {
  const repoKey = getRepoKey(repoItem)
  const meta = resolveRepoMeta(repoKey)
  if (!repoKey || !meta) return

  loadingMap.value[repoKey] = true

  try {
    const res = await fetch(meta.apiUrl)
    if (res.ok) {
      releaseMap.value[repoKey] = transformReleases(await res.json(), meta.platform)
    }
  } catch (error) {
    console.error(`[DownloadList] 拉取失败: ${repoKey}`, error)
  } finally {
    loadingMap.value[repoKey] = false
  }
}

// ---------- 挂载时并发拉取所有仓库数据 ----------
onMounted(() => {
  Promise.all(repoList.value.map(fetchRepoRelease))
})
</script>

<template>
  <div class="vp-download-container">
    <h1 class="vp-h1">⬇️ 开源阅读 软件下载</h1>

    <!-- 全局控制条 -->
    <div class="global-filter-bar">
      <label class="filter-checkbox-label">
        <input v-model="showAllRepos" type="checkbox" class="filter-checkbox" />
        <span class="checkbox-custom-text">显示所有阅读分支版本</span>
      </label>
      
      <!--
      GitHub / CF 下载加速暂时关闭：CF dev 域名无法稳定加速，先隐藏复选框。
      <label class="filter-checkbox-label">
        <input v-model="useGithubProxy" type="checkbox" class="filter-checkbox proxy-checkbox" />
        <span class="checkbox-custom-text">
          启用 GitHub 下载加速
          <span v-if="useGithubProxy && CF_PROXY_DOMAIN" class="speed-badge">
            (由 Cloudflare 支持)
          </span>
        </span>
      </label>
      -->
    </div>

    <!-- 卡片网格 -->
    <div class="download-grid">
      <DownloadCard
          v-for="(item, index) in visibleRepoList"
          :key="getRepoKey(item) || item.url || `repo-${index}`"
          :item="item"
          :release="getTargetRelease(item)"
          :loading="!!loadingMap[getRepoKey(item)]"
          :get-download-url="getDownloadUrl"
      />
    </div>
  </div>

  <!-- 底部引导 -->
  <div class="bottom-info-banner">
    <p class="more-link-text">
      更多平台更多软件，详见：
      <a href="Download.md" class="banner-link"><span>📚 软件合集</span></a>
    </p>
    <p class="copyright-text">本页面仅为软件聚合下载，应用版权归原作者所有</p>
  </div>
</template>

<style scoped>
.vp-download-container { margin-top: 2rem; width: 100%; }

.vp-h1 {
  font-size: 30px;
  font-weight: 800;
  text-align: center;
  display: block;
  margin: 0 auto 32px;
  padding-top: 40px;
}

/* ===== 全局控制条 ===== */
.global-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 12px 16px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.filter-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.filter-checkbox { width: 16px; height: 16px; accent-color: var(--vp-c-brand-1); cursor: pointer; }
/* GitHub / CF 下载加速暂时关闭：CF dev 域名无法稳定加速，先保留样式便于后续恢复。 */
/* .proxy-checkbox  { accent-color: #f38020; } */
.checkbox-custom-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}
/*
.speed-badge {
  font-size: 11px;
  background-color: rgba(243, 128, 32, 0.15);
  color: #f38020;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: bold;
}
*/

/* ===== 卡片网格 ===== */
.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* ===== 底部引导 ===== */
.bottom-info-banner {
  margin-top: 3.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.more-link-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0 !important;
}
.banner-link {
  color: var(--vp-c-brand-1) !important;
  text-decoration: none !important;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: inline-block;
}
.banner-link:hover {
  color: var(--vp-c-brand-2) !important;
  background-color: var(--vp-c-brand-dimm);
  transform: translateY(-1px);
}
.copyright-text {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0 !important;
  letter-spacing: 0.5px;
}

/* ===== 响应式 ===== */
@media (max-width: 580px) {
  .global-filter-bar { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
}
</style>
