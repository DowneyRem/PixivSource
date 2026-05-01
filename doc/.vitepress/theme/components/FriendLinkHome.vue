<template>
    <div class="home-friends">
        <div class="container">
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
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as friendGroups } from './FriendLink.data.ts'
const allFriends = computed(() => friendGroups.flatMap(g => g.items || []))
const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')
</script>

<style scoped>
.home-friends {
    padding-top: 70px;
    padding-bottom: 0px;
    margin-bottom: -120px;
    display: flex;
    justify-content: center;
}

.container {
    width: 100%;
    max-width: 1152px;
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
    width: 30px;
    margin-left: 9px;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    font-size: 18px;
}

/* --- 网格与卡片样式 --- */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
}

.card {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
    transition: all 0.2s;
    border: 1px solid var(--vp-c-bg-soft);
    text-decoration: none;
}

.card:hover {
    border-color: var(--vp-c-brand-1);
    background-color: var(--vp-c-bg-mute);
    transform: translateY(-2px);
}

.icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 10px;
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
    transition: color 0.2s;
}

.card:hover .name {
    color: var(--vp-c-brand-1);
}
</style>