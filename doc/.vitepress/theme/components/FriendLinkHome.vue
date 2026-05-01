<template>
    <div class="home-friends">
        <div class="container">
            <hr class="divider" />
            <div class="header">
                <span class="emoji">🤝</span>
                <span class="title">友情链接</span>
            </div>
            <div class="grid">
                <a v-for="f in allFriends" :key="f.link" :href="f.link" target="_blank" class="card">
                    <img :src="f.icon" class="icon" v-if="f.icon" />
                    <span class="name">{{ f.name }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { data as friendGroups } from './FriendLink.data.ts'
// 首页展示所有未被 hide 的友链
const allFriends = computed(() => friendGroups.flatMap(g => g.items || []))
</script>

<style scoped>
.home-friends {
    /* 顶部保持 40px 保持呼吸感，底部缩减至 0-10px */
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
    margin-bottom: 24px; /* 减小分割线到标题的距离 */
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 16px; /* 减小标题到卡片的距离 */
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.emoji { margin-right: 10px; }

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
}

.card:hover {
    border-color: var(--vp-c-brand-1);
    background-color: var(--vp-c-bg-mute);
}

.icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 10px;
    object-fit: cover;
}

.name {
    font-size: 14px;
    color: var(--vp-c-text-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>