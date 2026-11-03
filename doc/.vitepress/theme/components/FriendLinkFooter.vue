<template>
  <div v-if="showFooter && friendGroups.length > 0" class="fixed-friend-footer">
    <div class="footer-container" ref="containerRef">
      <hr class="divider" />
      <div class="footer-header">
        <a :href="withBase(t.url)" class="footer-title">
          <span class="title-emoji">🤝</span>
          <span class="title-text">{{ t.title }}</span>
        </a>
      </div>

      <div class="friends-grid" :style="{ '--min-width': gridMinWidth }">
        <template v-for="group in friendGroups" :key="group.title">
          <a
              v-for="friend in group.items"
              :key="friend.link"
              :href="friend.link"
              target="_blank"
              rel="noopener"
              class="friend-item"
          >
            <template v-if="friend.icon">
              <img :src="resolveIcon(friend.icon)" class="friend-icon" loading="lazy" />
            </template>

            <span class="friend-name"> {{ friend.name }}
               <span v-if="friend.lang === 'zh'" class="lang-tag">ZH</span>
            </span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as allLangData } from './FriendLink.data.ts'
import { friendLinkI18n as translations} from './FriendLinkLocales.ts'

const { frontmatter, localeIndex } = useData()
const t = computed(() => translations[localeIndex.value] || translations['root'])

// 根据语言动态计算宽度：英文环境下设为 160px，其余保持 140px
const gridMinWidth = computed(() => localeIndex.value === 'en' ? '160px' : '140px')

const friendGroups = computed(() => {
  const lang = localeIndex.value || 'root'
  return allLangData[lang] || allLangData['root'] || []
})

const route = useRoute()
const containerRef = ref(null)

const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')

const showFooter = computed(() => {
  return frontmatter.value.layout !== 'home' &&
      frontmatter.value.friendLink !== false
})

function alignToContent() {
  const container = containerRef.value
  if (!container) return

  const content = document.querySelector('.VPDoc .vp-doc')
      ?? document.querySelector('.VPContent .VPDoc')
  if (!content) return

  const rect = content.getBoundingClientRect()
  const containerRect = container.parentElement.getBoundingClientRect()

  container.style.paddingLeft = `${Math.max(rect.left - containerRect.left, 0)}px`
  container.style.paddingRight = `${Math.max(containerRect.right - rect.right, 0)}px`
}

let ro
onMounted(() => {
  nextTick(alignToContent)
  ro = new ResizeObserver(alignToContent)
  ro.observe(document.documentElement)
})
onUnmounted(() => ro?.disconnect())
watch(() => route.path, () => nextTick(alignToContent))
</script>

<style scoped>
/* ≥960px：有侧边栏，无大纲 */
@media (min-width: 960px) {
  .VPContent.has-sidebar ~ div .fixed-friend-footer .footer-container {
    padding-left: calc(var(--vp-sidebar-width) + 32px);
    padding-right: 32px;
  }
}

/* ≥1280px：有侧边栏 + 大纲（aside 固定 256px） */
@media (min-width: 1280px) {
  .VPContent.has-sidebar ~ div .fixed-friend-footer .footer-container {
    padding-right: calc(256px + 32px); /* 288px */
  }
}

/* ≥1440px：整体布局居中，多余空间在最外层两侧 */
@media (min-width: 1440px) {
  .VPContent.has-sidebar ~ div .fixed-friend-footer .footer-container {
    /* 左侧 = 居中左边空白 + 侧边栏 + 内容左边距 */
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 32px);
    /* 右侧 = 居中右边空白 + aside(256px) + 内容右边距 */
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 256px + 32px);
  }
}

.fixed-friend-footer {
  width: 100%;
  padding-bottom: 20px;
}

.footer-container {
  width: 100%;
  box-sizing: border-box;
  padding: 0 25px;
}

.divider {
  border: 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 24px;
  opacity: 0.5;
}

.footer-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.footer-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-title:hover {
  color: var(--vp-c-brand-1);
}

.title-emoji {
  width: 20px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  font-size: 18px;
}

.friends-grid {
  display: grid;
  /* 使用 CSS 变量 --min-width，默认值为 140px */
  grid-template-columns: repeat(auto-fill, minmax(var(--min-width, 140px), 1fr));
  gap: 16px 20px;
  width: 100%;
}

.friend-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  min-width: 0;
}

.friend-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 10px;
  flex-shrink: 0;
  object-fit: cover;
}

.friend-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  min-width: 0;
}

.friend-name span:first-child {
  white-space: nowrap;
  overflow: hidden;
}

/* 针对所有页面的 FriendLink 组件中的名称后的标签 */
.friend-name .lang-tag {
  font-size: 0.7em;
  font-weight: bold;
  color: var(--vp-c-brand-1);
  margin-left: 6px;
  /*background: var(--vp-c-brand-soft);*/
  padding: 1px 4px;
  border-radius: 4px;
  vertical-align: middle;
}

.friend-item:hover .friend-name {
  color: var(--vp-c-brand-1);
}
</style>