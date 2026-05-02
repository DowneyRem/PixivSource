<template>
  <!-- 外层全宽，确保分割线能延伸 -->
  <div class="home-friends" v-if="allFriends.length > 0">
    <div class="container" ref="containerRef">
      <hr class="divider" />
      <div class="header">
        <a href="/FriendLink" class="footer-title">
          <span class="title-emoji">🤝</span>
          <span class="title-text">友情链接</span>
        </a>
      </div>
      <div class="grid">
        <a v-for="f in allFriends" :key="f.link" :href="f.link" target="_blank" rel="noopener" class="card">
          <img :src="resolveIcon(f.icon)" class="icon" v-if="f.icon" loading="lazy" />
          <span class="name">{{ f.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { data as friendGroups } from './FriendLink.data.ts'

const allFriends = computed(() => friendGroups.flatMap(g => g.items || []))
const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')

const containerRef = ref(null)

/**
 * 首页对齐逻辑：
 * 首页的正文通常包裹在 .VPHomeContent 中，其最大宽度一般为 1152px。
 * 在 730-960px 期间，它会有动态的 padding。
 */
function alignToHomeContent() {
  const container = containerRef.value
  if (!container) return

  // 尝试匹配首页的内容区域
  const homeContent = document.querySelector('.VPHomeContent')
      || document.querySelector('.VPContent')

  if (!homeContent) return

  const rect = homeContent.getBoundingClientRect()
  const parentRect = container.parentElement.getBoundingClientRect()

  // 动态同步左右内边距，使其与首页 Feature/Hero 区域对齐
  const paddingLeft = Math.max(rect.left - parentRect.left, 0)
  const paddingRight = Math.max(parentRect.right - rect.right, 0)

  container.style.paddingLeft = `${paddingLeft}px`
  container.style.paddingRight = `${paddingRight}px`
}

let ro
onMounted(() => {
  nextTick(alignToHomeContent)
  // 监听窗口尺寸变化，实时调整对齐
  ro = new ResizeObserver(alignToContentAnimationFrame)
  ro.observe(document.documentElement)
})

function alignToContentAnimationFrame() {
  window.requestAnimationFrame(alignToHomeContent)
}

onUnmounted(() => ro?.disconnect())
</script>

<style scoped>
.home-friends {
  width: 100%;
  padding-top: 64px;
  padding-bottom: 0px;
  margin-bottom: -90px;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  box-sizing: border-box;
  /* 默认最大宽度与 VitePress 首页保持一致 */
  max-width: 1152px;
  margin: 0 auto;
}

.divider {
  border: 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 24px;
  opacity: 0.5;
}

.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.footer-title {
    display: flex;
    align-items: center;
    font-size: 16px; /* 首页标题也可以保持 16px-18px */
    font-weight: 700;
    color: var(--vp-c-text-1);
    text-decoration: none;
    transition: color 0.2s;
}

.footer-title:hover {
    color: var(--vp-c-brand-1);
}

.title-emoji {
    width: 40px;
    margin-left: 7px;
    margin-right: 4px;
    display: flex;
    justify-content: center;
    font-size: 18px;
}

.grid {
  display: grid;
  /* 首页卡片较宽，我们稍微调小最小宽度以适应更多屏幕 */
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.card {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
  object-fit: cover;
}

.name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card:hover .name {
  color: var(--vp-c-brand-1);
}

/* 适配 768px 以下的移动端 */
@media (max-width: 768px) {
  .home-friends {
    padding-top: 40px;
  }
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

/* 适配超小屏幕 */
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>