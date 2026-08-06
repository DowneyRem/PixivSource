<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { lang } = useData()

const isRedirecting = ref(false)
const inputUrl = ref('')
const selectedType = ref('importonline')
const containerRef = ref<HTMLElement | null>(null)

// 🌟 核心优化：动态读取 Vite 环境变量（本地开发通过 .env.local，线上通过 CF 后台注入）
const CF_WORKER_URL = import.meta.env.VITE_CF_WORKER_URL || ''
const SECURE_TOKEN = import.meta.env.VITE_SECURE_TOKEN || ''

// 状态控制
const isUploading = ref(false)
const generatedLegadoUrl = ref('')

// ---------- 多语言本地词典 ----------
const i18n = {
  'zh': {
    title: '🚀 一键导入 阅读资源',
    selectType: '请选择导入类型',
    clear: '清空内容',
    placeholder: '粘贴 http(s) 链接、legado:// 协议，或者直接粘贴书源 JSON 源码...',
    jsonError: 'JSON 格式错误，请检查后再导入',
    btnUpload: '⏳ 正在通过 Cloudflare 分流打包...',
    btnSubmit: '确认导入至阅读',
    redirectTitle: '正在拉起阅读 App',
    redirectDesc: '如果已安装开源阅读，应用将立即拉起...',
    manualRedirect: '没有反应？点击手动跳转',
    footer: '适配 开源阅读 3.0 及其兼容版本',
    gatewayError: '云端数据流转通道建立失败，请检查网络或确认暗号凭证是否对齐。',
    noGateway: '未配置云端网关，暂时无法完成 JSON 解析托管。请直连引入 URL。',
    types: {
      importonline: '自动',
      bookSource: '书源',
      rssSource: '订阅源',
      replaceRule: '替换规则',
      textTocRule: '目录规则',
      httpTTS: '朗读引擎',
      theme: '主题样式',
      readConfig: '阅读排版',
      book: '添加书架'
    }
  },
  'zh-TW': {
    title: '🚀 一鍵匯入 閱讀資源',
    selectType: '請選擇匯入類型',
    clear: '清空內容',
    placeholder: '粘貼 http(s) 鏈接、legado:// 協議，或者直接粘貼書源 JSON 源碼...',
    jsonError: 'JSON 格式錯誤，請檢查後再匯入',
    btnUpload: '⏳ 正在通過 Cloudflare 分流打包...',
    btnSubmit: '確認匯入至閱讀',
    redirectTitle: '正在拉起閱讀 App',
    redirectDesc: '如果已安裝開源閱讀，應用將立即拉起...',
    manualRedirect: '沒有反應？點擊手動跳轉',
    footer: '適配 開源閱讀 3.0 及其兼容版本',
    gatewayError: '雲端數據流轉通道建立失敗，請檢查網絡或確認暗號憑證是否對齊。',
    noGateway: '未配置雲端網關，暫時無法完成 JSON 解析託管。請直連引入 URL。',
    types: {
      importonline: '自動',
      bookSource: '書源',
      rssSource: '訂閱源',
      replaceRule: '替換規則',
      textTocRule: '目錄規則',
      httpTTS: '朗讀引擎',
      theme: '主題樣式',
      readConfig: '閱讀排版',
      book: '添加書架'
    }
  },
  'en': {
    title: '🚀 One-Click Import',
    selectType: 'Select Import Type',
    clear: 'Clear',
    placeholder: 'Paste http(s) link, legado:// protocol, or copy-paste book source JSON code directly...',
    jsonError: 'Invalid JSON format, please verify before importing',
    btnUpload: '⏳ Bundling via Cloudflare Workers...',
    btnSubmit: 'Confirm Import to Legado',
    redirectTitle: 'Launching Legado App',
    redirectDesc: 'If you have Legado installed, it should launch automatically...',
    manualRedirect: 'No response? Click here to redirect manually',
    footer: 'Compatible with Legado 3.0 and its forks',
    gatewayError: 'Cloudflare data tunnel failed. Please check your connection or token.',
    noGateway: 'Cloud cloud gateway unconfigured. JSON code hosting is unavailable. Please use direct URL.',
    types: {
      importonline: 'Auto',
      bookSource: 'Book',
      rssSource: 'RSS',
      replaceRule: 'Replace',
      textTocRule: 'TOC',
      httpTTS: 'TTS',
      theme: 'Theme',
      readConfig: 'Layout',
      book: 'Bookshelf'
    }
  }
}

// 智能渐进式多语言匹配
const t = computed(() => {
  const currentLang = (lang.value || '')
  const shortLang = currentLang.slice(0, 2)

  if (i18n[currentLang]) return i18n[currentLang]
  if (i18n[shortLang]) return i18n[shortLang]
  if (i18n['en']) return i18n['en']
  return i18n['zh']
})

const typeMap = computed(() => [
  { label: t.value.types.importonline, value: 'importonline', icon: '⚡️' },
  { label: t.value.types.bookSource, value: 'bookSource', icon: '📚' },
  { label: t.value.types.rssSource, value: 'rssSource', icon: '📡' },
  { label: t.value.types.replaceRule, value: 'replaceRule', icon: '✂️' },
  { label: t.value.types.textTocRule, value: 'textTocRule', icon: '📖' },
  { label: t.value.types.httpTTS, value: 'httpTTS', icon: '🗣️' },
  { label: t.value.types.theme, value: 'theme', icon: '🎨' },
  { label: t.value.types.readConfig, value: 'readConfig', icon: '📝' },
  { label: t.value.types.book, value: 'book', icon: '➕' }
])

// ── 深度清洗判定 ──
const cleanedInput = computed(() => {
  return inputUrl.value.replace(/^\s+/, '').replace(/\s+$/, '')
})

// ── 智能判断输入内容是否疑似为纯 JSON 源码 ──
const looksLikeJsonInput = computed(() => {
  const val = cleanedInput.value
  return val.startsWith('{') || val.startsWith('[')
})

// ── 防御加固：使用独立变量承载错误 ──
const jsonError = ref('')
let debounceTimer: any = null

watch(inputUrl, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (!looksLikeJsonInput.value) {
      jsonError.value = ''
      return
    }
    try {
      let raw = cleanedInput.value
      if (raw.startsWith('{') && raw.endsWith('}')) {
        raw = `[${raw}]`
      }
      JSON.parse(raw)
      jsonError.value = ''
    } catch {
      jsonError.value = t.value.jsonError
    }
  }, 300)
})

// ── 一键清空输入框 ──
function clearInput() {
  inputUrl.value = ''
  jsonError.value = ''
}

// ── 顶级极速跳转 ──
const hasRedirected = ref(false)
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')?.trim() || ''

  if (src && !hasRedirected.value) {
    isRedirecting.value = true
    hasRedirected.value = true
    const finalUrl = src.startsWith('legado://')
        ? src
        : `legado://import/importonline?src=${encodeURIComponent(src)}`
    window.location.href = finalUrl
    setTimeout(() => { isRedirecting.value = false }, 2800)
  }
}

// ── 根据 URL 内容自动推断类型 ──
function parseUrlLogic(url: string) {
  const u = url.trim()
  if (!u) return
  if (u.startsWith('{') || u.startsWith('[')) return

  if (u.startsWith('legado://')) {
    const match = u.match(/legado:\/\/import\/([a-zA-Z]+)/)
    if (match?.[1]) {
      const found = typeMap.value.find(item => item.value === match[1])
      selectedType.value = found ? found.value : 'importonline'
    }
    return
  }
  const lower = u.toLowerCase()
  const found = typeMap.value.find(item => item.value !== 'importonline' && lower.includes(item.value.toLowerCase()))
  selectedType.value = found ? found.value : 'importonline'
}

// ── ResizeObserver 对齐 ──
function alignToContent() {
  const container = containerRef.value
  if (!container) return
  const parent = container.parentElement!
  const parentRect = parent.getBoundingClientRect()

  const isDesktop = window.innerWidth >= 960
  const hasAside  = window.innerWidth >= 1280

  const sidebar = isDesktop
      ? (document.querySelector('.VPSidebar') as HTMLElement | null)
      : null
  const aside = hasAside
      ? (document.querySelector('.VPDocAside') as HTMLElement | null)
      : null

  const contentLeft  = sidebar ? sidebar.getBoundingClientRect().right : parentRect.left
  const contentRight = aside   ? aside.getBoundingClientRect().left    : parentRect.right

  container.style.paddingLeft  = `${Math.max(contentLeft  - parentRect.left,  0)}px`
  container.style.paddingRight = `${Math.max(parentRect.right - contentRight, 0)}px`
}

let ro: ResizeObserver | null = null

function observeLayout() {
  if (!ro) return
  ro.observe(document.documentElement)
  const aside = document.querySelector('.VPDocAside')
  if (aside) ro.observe(aside)
}

onMounted(() => {
  const src = new URLSearchParams(window.location.search).get('src')?.trim() || ''
  if (src) { inputUrl.value = src; parseUrlLogic(src) }

  ro = new ResizeObserver(alignToContent)
  nextTick(() => { observeLayout(); alignToContent() })
})

onUnmounted(() => ro?.disconnect())

watch(() => route.path, () => {
  nextTick(() => { observeLayout(); alignToContent() })
  setTimeout(alignToContent, 300)
})
watch(inputUrl, parseUrlLogic)

// ── 核心执行逻辑 ──
async function doImport() {
  let val = cleanedInput.value
  if (!val) return

  if (looksLikeJsonInput.value && jsonError.value) {
    alert(jsonError.value)
    return
  }

  if (looksLikeJsonInput.value) {
    if (!CF_WORKER_URL) {
      alert(t.value.noGateway)
      return
    }

    isUploading.value = true
    try {
      let parsedJson = JSON.parse(val)
      if (!Array.isArray(parsedJson)) {
        parsedJson = [parsedJson]
      }

      const targetApi = CF_WORKER_URL.endsWith('/') ? CF_WORKER_URL.slice(0, -1) : CF_WORKER_URL;

      const response = await fetch(targetApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TNT-Secure': SECURE_TOKEN
        },
        body: JSON.stringify(parsedJson)
      })

      if (!response.ok) throw new Error()

      const resData = await response.json()
      const shortUrl = resData.url
      const finalUrl = `legado://import/${selectedType.value}?src=${encodeURIComponent(shortUrl)}`

      generatedLegadoUrl.value = finalUrl
      isRedirecting.value = true
      window.location.href = finalUrl
      setTimeout(() => { isRedirecting.value = false }, 2800)
    } catch (e) {
      alert(t.value.gatewayError)
    } finally {
      isUploading.value = false
    }
    return
  }

  isRedirecting.value = true
  const finalUrl = val.startsWith('legado://')
      ? val
      : `legado://import/${selectedType.value}?src=${encodeURIComponent(val)}`
  generatedLegadoUrl.value = finalUrl
  window.location.href = finalUrl
  setTimeout(() => { isRedirecting.value = false }, 2800)
}

const ready = computed(() => cleanedInput.value.length > 0 && !isUploading.value)
</script>

<template>
  <div class="legado-outer">
    <div class="legado-container" ref="containerRef">

      <div v-if="isRedirecting" class="legado-card redirect-mode">
        <div class="loader-wrapper">
          <div class="loader-ring"></div>
          <div class="loader-ring-inner"></div>
          <span class="loader-icon">🚀</span>
        </div>
        <h2 class="redirect-title">{{ t.redirectTitle }}</h2>
        <p class="redirect-desc">{{ t.redirectDesc }}</p>
        <a
            :href="generatedLegadoUrl || (inputUrl.startsWith('legado://') ? inputUrl : `legado://import/importonline?src=${encodeURIComponent(inputUrl)}`)"
            class="retry-btn-styled"
        >
          {{ t.manualRedirect }}
        </a>
      </div>

      <template v-else>
        <h1 class="vp-h1">{{ t.title }}</h1>

        <div class="legado-card main-mode">
          <div class="legado-header">
            <span class="header-title">{{ t.selectType }}</span>
            <button v-if="inputUrl" class="clear-action-btn" @click="clearInput">{{ t.clear }}</button>
          </div>

          <div class="type-grid">
            <button
                v-for="item in typeMap"
                :key="item.value"
                @click="selectedType = item.value"
                :class="['type-item', { active: selectedType === item.value, 'only-mobile': item.value === 'book' }]"
            >
              <span class="type-icon">{{ item.icon }}</span>
              <span class="type-label">{{ item.label }}</span>
            </button>
          </div>

          <div class="input-area">
            <textarea
                v-model="inputUrl"
                :placeholder="t.placeholder"
                spellcheck="false"
                :disabled="isUploading"
            ></textarea>
            <div v-if="jsonError" class="json-error-banner">⚠️ {{ jsonError }}</div>
          </div>

          <button class="submit-btn" :disabled="!ready" @click="doImport">
            {{ isUploading ? t.btnUpload : t.btnSubmit }}
          </button>
        </div>

        <p class="footer-note">{{ t.footer }}</p>
      </template>

    </div>
  </div>
</template>

<style scoped>
/* 保持原有样式不变 */
.legado-outer {
  width: 100%;
}

.legado-container {
  box-sizing: border-box;
  width: 100%;
  text-align: center;
}

.legado-card,
.vp-h1,
.footer-note {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.vp-h1 {
  font-size: 30px;
  font-weight: 800;
  margin-bottom: 28px;
  color: var(--vp-c-text-1);
  padding-top: 40px;
}

.legado-card {
  background: var(--vp-c-bg-elevated);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.redirect-mode {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-mode {
  padding: 20px;
  text-align: left;
}

.legado-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.clear-action-btn {
  font-size: 13px;
  color: var(--vp-c-brand-1);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.clear-action-btn:hover { text-decoration: underline; }

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 2px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vp-c-text-1);
}

.type-item.only-mobile { display: none; }

.type-item.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}
.type-icon { font-size: 24px; margin-bottom: 4px; }
.type-label { font-size: 14px; font-weight: 700; white-space: nowrap; }

.input-area textarea {
  width: 100%;
  height: 130px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-1);
  resize: none;
  box-sizing: border-box;
}

.json-error-banner {
  color: var(--vp-c-danger-1);
  font-size: 12px;
  text-align: left;
  margin-top: -12px;
  margin-bottom: 12px;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.submit-btn:not(:disabled):hover { opacity: 0.85; }

.loader-wrapper { position: relative; width: 70px; height: 70px; margin-bottom: 20px; }
.loader-ring {
  position: absolute; width: 100%; height: 100%;
  border: 4px solid var(--vp-c-brand-soft);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loader-ring-inner {
  position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px;
  border: 3px solid transparent;
  border-bottom-color: var(--vp-c-brand-2);
  border-radius: 50%;
  animation: spin 1.5s linear reverse infinite;
  opacity: 0.6;
}
.loader-icon {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
}

.redirect-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; color: var(--vp-c-text-1); }
.redirect-desc  { color: var(--vp-c-text-3); font-size: 13px; margin-bottom: 24px; }

.retry-btn-styled {
  background: var(--vp-c-brand-1);
  color: white !important;
  padding: 10px 30px;
  border-radius: 40px;
  font-weight: 700;
  font-size: 13px;
  text-decoration: none !important;
}

.footer-note {
  margin-top: 20px;
  font-size: 14px;
  color: var(--vp-c-text-3);
  padding-bottom: 40px;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

@media (max-width: 400px) {
  .vp-h1 { font-size: 26px; margin-bottom: 16px; }
  .type-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .type-item.only-mobile { display: flex; }
  .type-icon { font-size: 20px; }
  .type-label { font-size: 14px; }
}
</style>