<template>
    <div v-if="showFooter && allFriends.length > 0" class="fixed-friend-footer">
        <div class="footer-inner">
            <div class="footer-container">
                <hr class="divider" />
                <div class="footer-header">
                    <!-- 这里的 🤝 会和下方的 icon 垂直对齐 -->
                    <a href="/FriendLink" class="footer-title">
                        <span class="title-emoji">🤝</span>
                        <span class="title-text">友情链接</span>
                    </a>
                </div>

                <div class="friends-grid">
                    <a
                        v-for="friend in allFriends"
                        :key="friend.link"
                        :href="friend.link"
                        target="_blank"
                        rel="noopener"
                        class="friend-item"
                    >
                        <img
                            :src="resolveIcon(friend.icon)"
                            class="friend-icon"
                            v-if="friend.icon"
                        />
                        <span class="friend-name">{{ friend.name }}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { data as friendGroups } from './FriendLink.data.ts'

const { frontmatter } = useData()
const route = useRoute()

const allFriends = computed(() => friendGroups.flatMap(group => group.items || []))
const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')

const showFooter = computed(() => {
    return frontmatter.value.layout !== 'home' &&
        frontmatter.value.friendLink !== false &&
        !route.path.includes('FriendLink')
})
</script>

<style scoped>
.fixed-friend-footer {
    width: 100%;
    padding-bottom: 80px;
}

.footer-inner {
    /* 基础容器居中 */
    margin: 0 auto;
    max-width: var(--vp-layout-max-width);
    box-sizing: border-box;
    padding: 0 24px;
}

@media (min-width: 960px) {
    .footer-inner {
        /* 左侧偏移 */
        padding-left: 280px;
        /* 右侧偏移 */
        padding-right: 320px;
    }
}

/* 超大屏下保持手动设置的对齐感 */
@media (min-width: 1440px) {
    .footer-inner {
        padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + 240px);
        padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 240px);
    }
}

.footer-container {
    width: 100%;
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

/* 对齐逻辑核心 */
.title-emoji {
    /* 宽度设为 20px，与下方 friend-icon 宽度一致 */
    width: 20px;
    /* 间距设为 10px，与下方 friend-icon 的 margin-right 一致 */
    margin-right: 10px;
    display: flex;
    justify-content: center;
    font-size: 18px; /* Emoji 视觉稍大，保持居中 */
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

/* 移动端逻辑 */
@media (max-width: 959px) {
    .footer-inner {
        padding: 0 24px !important;
    }
}
</style>