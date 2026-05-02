<template>
  <div class="friends-wrapper">
    <div v-for="group in friendGroups" :key="group.title" class="friend-group">
      <h3 :id="group.title" class="group-title">{{ group.title }}</h3>

      <div class="friends-container">
        <div v-for="item in group.items" :key="item.link" class="friend-card">
          <!-- 主卡片：通常指向 GitHub 或主要个人页 -->
          <a :href="item.link" target="_blank" rel="noopener" class="card-main">
            <img :src="resolvePath(item.icon)" :alt="item.name" class="icon" />
            <div class="info">
              <div class="name-row">
                <span class="name">{{ item.name }}</span>
                <span v-if="item.title" class="badge">{{ item.title }}</span>
              </div>
              <p class="desc">{{ item.desc || '这个伙伴很神秘，什么都没写' }}</p>
            </div>
          </a>

          <!-- 多站点展示区域 -->
          <div v-if="item.sites && item.sites.length > 0" class="card-footer">
            <div class="sites-list">
              <a
                  v-for="(site, sIdx) in item.sites"
                  :key="sIdx"
                  :href="site.link"
                  target="_blank"
                  class="site-link"
                  :title="site.name"
              >
                <span class="site-icon">
                  <span v-if="isSVG(site.icon)" v-html="site.icon"></span>
                  <img v-else :src="resolvePath(site.icon)" :alt="site.name" />
                </span>
                <span class="site-name">{{ site.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()
const friendGroups = computed(() => frontmatter.value.friendGroups || [])

const isSVG = (icon) => icon && icon.trim().startsWith('<svg')

const resolvePath = (path) => {
  if (!path) return 'https://www.github.com/github.png'
  return path.startsWith('http') || path.startsWith('data:') ? path : withBase(path)
}
</script>

<style scoped>
.friend-group { margin-bottom: 32px; }
.group-title {
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 1.25rem;
  font-weight: 600;
}

.friends-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.friend-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  overflow: hidden;
}

.friend-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.card-main {
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
}

.icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  margin-right: 14px;
  object-fit: cover;
  background-color: var(--vp-c-neutral-soft);
}

.info { display: flex; flex-direction: column; overflow: hidden; }
.name-row { display: flex; align-items: center; gap: 6px; }
.name { font-weight: 600; font-size: 16px; }
.badge {
  font-size: 10px;
  padding: 0 6px;
  border-radius: 8px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.desc { font-size: 12px; color: var(--vp-c-text-2); margin-top: 4px; line-height: 1.4; }

/* 多站点列表样式 */
.card-footer {
  padding: 10px 16px;
  background-color: var(--vp-c-bg-mute);
  border-top: 1px solid var(--vp-c-divider);
}

.sites-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* 多个站点之间的间距 */
}

.site-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  text-decoration: none !important;
  transition: opacity 0.2s;
}

.site-link:hover {
  opacity: 0.8;
}

.site-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.site-icon :deep(svg), .site-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 640px) {
  .friends-container { grid-template-columns: 1fr; }
}
</style>