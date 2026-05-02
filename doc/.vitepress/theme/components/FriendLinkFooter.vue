<template>
  <div v-if="showFooter && friendGroups.length > 0" class="fixed-friend-footer">
    <div class="footer-container" ref="containerRef">
      <hr class="divider" />
      <div class="footer-header">
        <a href="/FriendLink" class="footer-title">
          <span class="title-emoji">🤝</span>
          <span class="title-text">友情链接</span>
        </a>
      </div>

      <div class="friends-grid">
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
            <img
                :src="resolveIcon(friend.icon)"
                class="friend-icon"
                loading="lazy"
            />
          </template>
          <span class="friend-name">{{ friend.name }}</span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as friendGroups } from './FriendLink.data.ts'

const { frontmatter } = useData()
const route = useRoute()
const containerRef = ref(null)

const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')

const showFooter = computed(() => {
  return frontmatter.value.layout !== 'home' &&
      frontmatter.value.friendLink !== false &&
      !route.path.replace(/\.html$/, '').endsWith('FriendLink')
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
.fixed-friend-footer {
  width: 100%;
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
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-item:hover .friend-name {
  color: var(--vp-c-brand-1);
}
</style>