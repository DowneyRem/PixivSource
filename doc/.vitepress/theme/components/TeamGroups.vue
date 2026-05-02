<template>
  <div class="friends-wrapper">
    <!-- 分组循环 -->
    <div v-for="group in friendGroups" :key="group.title" class="friend-group">
      <h3 :id="group.title" class="group-title">{{ group.title }}</h3>

      <div class="friends-container">
        <div v-for="item in group.items" :key="item.link" class="friend-card">
          <!-- 主要信息区域 -->
          <a :href="item.link" target="_blank" rel="noopener" class="card-main">
            <img :src="resolvePath(item.icon)" :alt="item.name" class="icon" />
            <div class="info">
              <div class="name-row">
                <span class="name">{{ item.name }}</span>
                <span v-if="item.title" class="badge">{{ item.title }}</span>
              </div>
              <p class="desc">{{ item.desc || "这个伙伴很神秘，什么都没写" }}</p>
            </div>
          </a>

          <!-- 多站点链接区域 -->
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
									<!-- 1. 处理自定义内联 SVG -->
									<span v-if="isSvg(site.icon)" v-html="site.icon" class="svg-inner"></span>

                  <!-- 2. 处理 Iconify / Simple Icons (如 si:github) -->
									<img
                      v-else-if="isIconify(site.icon)"
                      :src="getIconifyUrl(site.icon)"
                      class="img-inner iconify-icon"
                  />

                  <!-- 3. 处理普通图片路径 -->
									<img v-else :src="resolvePath(site.icon)" :alt="site.name" class="img-inner" />
								</span>
                <span v-if="site.name" class="site-name">{{ site.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useData, withBase } from "vitepress"

const { frontmatter } = useData()
const friendGroups = computed(() => frontmatter.value.friendGroups || [])

/**
 * 判断是否为内联 SVG
 */
const isSvg = (icon) => icon && icon.trim().startsWith("<svg")

/**
 * 判断是否为 Iconify 格式 (例如 si:pixiv, mdi:home)
 */
const isIconify = (icon) => icon && icon.includes(":") && !icon.startsWith("http")

/**
 * 获取 Iconify SVG 接口地址
 * 加上 color=currentColor 可以让单色图标跟随文字颜色
 */
const getIconifyUrl = (icon) => {
  const iconPath = icon.replace(":", "/")
  return `https://api.iconify.design/${iconPath}.svg?color=currentColor`
}

/**
 * 解析路径，支持网络路径和 VitePress 资源路径
 */
const resolvePath = (path) => {
  if (!path) return "https://www.github.com/github.png"
  return path.startsWith("http") || path.startsWith("data:") ? path : withBase(path)
}
</script>

<style scoped>
.friend-group {
  margin-bottom: 40px;
}

.group-title {
  margin: 48px 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 1.5rem;
  font-weight: 600;
}

.friends-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.friend-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.friend-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  background-color: var(--vp-c-bg-mute);
}

.card-main {
  display: flex;
  align-items: center;
  padding: 20px;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
}

.icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
  background-color: var(--vp-c-neutral-soft);
  border: 2px solid var(--vp-c-divider);
}

.info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}

.desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 6px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding: 12px 20px;
  background-color: var(--vp-c-bg-mute);
  border-top: 1px solid var(--vp-c-divider);
}

.sites-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.site-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none !important;
  transition: color 0.2s;
}

.site-link:hover {
  color: var(--vp-c-brand-1);
}

.site-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.site-icon :deep(svg),
.img-inner {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* 让简单的 Iconify 图标颜色自适应文字颜色 */
.iconify-icon {
  filter: grayscale(1) brightness(var(--vp-icon-copy-color-filter, 0.8));
}

.site-link:hover .iconify-icon {
  filter: none;
}

@media (max-width: 640px) {
  .friends-container {
    grid-template-columns: 1fr;
  }
}
</style>