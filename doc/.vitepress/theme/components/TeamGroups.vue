<template>
  <div class="team-groups-wrapper">
    <div v-for="group in teamGroups" :key="group.title" class="team-group">
      <h3 :id="group.title" class="group-title">{{ group.title }}</h3>
      <div class="team-container">
        <div v-for="item in group.items" :key="item.link ?? item.name" class="team-card">
          <a
              :href="item.link ?? undefined"
              target="_blank"
              rel="noopener"
              class="card-main"
              :class="{ 'no-link': !item.link }"
          >
            <img :src="resolvePath(item.icon)" :alt="item.name" class="avatar" />
            <div class="info">
              <div class="name-row">
                <span class="name">{{ item.name }}</span>
                <span v-if="item.title" class="badge">{{ item.title }}</span>
              </div>
              <p v-if="item.desc" class="desc">{{ item.desc }}</p>
            </div>
          </a>

          <div v-if="item.sponsor || item.sites?.length" class="card-footer">
            <div v-if="item.sites?.length" class="sites-list">
              <a
                  v-for="(site, i) in item.sites"
                  :key="i"
                  :href="site.link"
                  target="_blank"
                  rel="noopener"
                  class="site-link"
                  :title="site.name"
              >
                <span class="site-icon">
                  <span v-if="isSvg(site.icon)" v-html="site.icon" class="svg-inner" />
                  <img
                      v-else-if="isIconify(site.icon)"
                      :src="`https://api.iconify.design/${site.icon.replace(':', '/')}.svg?color=currentColor`"
                      class="img-inner"
                      :alt="site.name"
                  />
                  <img
                      v-else
                      :src="resolvePath(site.icon)"
                      :alt="site.name"
                      class="img-inner"
                  />
                </span>
                <span v-if="site.name" class="site-name">{{ site.name }}</span>
              </a>
            </div>

            <a
                v-if="item.sponsor"
                :href="item.sponsor"
                target="_blank"
                rel="noopener"
                class="sponsor-btn"
            >
              {{ item.sponsorText ?? '打赏' }}
            </a>
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
const teamGroups = computed(() => frontmatter.value.teamGroups || [])

const isSvg      = (icon) => icon?.trim().startsWith('<svg')
const isIconify  = (icon) => icon?.includes(':') && !icon.startsWith('http')
const resolvePath = (path) =>
    !path ? 'https://www.github.com/github.png'
        : (path.startsWith('http') || path.startsWith('data:')) ? path
            : withBase(path)
</script>

<style scoped>
.team-group {
  margin-bottom: 2.5rem;
}

.group-title {
  margin: 2rem 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 1.5rem;
  font-weight: 600;
}

.team-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* 卡片 */
.team-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--vp-c-bg-soft);
  background-color: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, background-color 0.25s;
}

.team-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  background-color: var(--vp-c-bg-mute);
}

/* 主区域 */
.card-main {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  flex: 1;
}

.card-main.no-link {
  cursor: default;
  pointer-events: none;
}

/* 头像 */
.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-mute);
}

/* 信息区 */
.info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

.name {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 99px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部操作栏 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 18px;
  background-color: var(--vp-c-bg-mute);
  border-top: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

/* 站点链接列表 */
.sites-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.site-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-decoration: none !important;
  transition: color 0.2s;
}

.site-link:hover {
  color: var(--vp-c-brand-1);
}

.site-icon {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.site-icon :deep(svg),
.img-inner {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.svg-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 打赏按钮 */
.sponsor-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--vp-c-sponsor);
  color: var(--vp-c-sponsor);
  text-decoration: none !important;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.2s, color 0.2s;
}

.sponsor-btn::before {
  content: '♥';
  font-size: 11px;
}

.sponsor-btn:hover {
  background-color: var(--vp-c-sponsor);
  color: var(--vp-c-white);
}

@media (max-width: 640px) {
  .team-container {
    grid-template-columns: 1fr;
  }
}
</style>