<template>
    <!-- data 直接就是过滤后的分组数组，我们判断是否有数据即可 -->
    <div v-if="showFooter && friendGroups.length > 0" class="fixed-friend-footer">
        <div class="footer-inner">
            <div class="footer-container">
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
                            <img
                                :src="resolveIcon(friend.icon)"
                                class="friend-icon"
                                v-if="friend.icon"
                                loading="lazy"
                            />
                            <span class="friend-name">{{ friend.name }}</span>
                        </a>
                    </template>
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

// 因为 transform 已经做好了过滤，这里直接使用即可
// 如果你依然想在组件内维护一个扁平化列表，可以保留此 computed，但无需再 filter
const allFriendsExist = computed(() => friendGroups.some(g => g.items?.length > 0))

const resolveIcon = (icon) => icon?.startsWith('http') ? icon : withBase(icon || '')

const showFooter = computed(() => {
    return frontmatter.value.layout !== 'home' &&
        frontmatter.value.friendLink !== false &&
        // 确保不在友链主页显示，支持路径结尾包含或不包含 .html
        !route.path.replace(/\.html$/, '').endsWith('FriendLink')
})
</script>

<style scoped>
.fixed-friend-footer {
    width: 100%;
    padding-bottom: 0px;
}

.footer-inner {
    /* 基础容器居中 */
    margin: 0 auto;
    max-width: var(--vp-layout-max-width);
    box-sizing: border-box;
    padding: 20px;
}

@media (min-width: 0px) {
    .footer-inner {
        padding-left: 25px;
        padding-right: 25px;
    }
}

@media (min-width: 740px) {
    .footer-inner {
        /* 从 25px 开始，每增加 1px 屏幕宽度，padding 增加 0.5px */
        padding-left: calc(25px + (100vw - 740px) * 0.5);
        padding-right: calc(25px + (100vw - 740px) * 0.5);
    }
}

/* 阶段 A：中等屏幕拟合 (960px - 1279px) */
/* 数据点：960(330,60) -> 1160(350,80) -> 1210(400,120) -> 1270(430,150) */
@media (min-width: 960px){
    .footer-inner {
        /* 左侧：960到1270增长100px，斜率约 0.32 */
        padding-left: calc(330px + (100vw - 960px) * 0.322);
        /* 右侧：960到1270增长90px，斜率约 0.29 */
        padding-right: calc(60px + (100vw - 960px) * 0.29);
    }
}

/* 阶段 B：大屏布局重排点 (1280px - 1549px) */
/* 此处遵循你要求的 1280 突变：左跳至 340, 右跳至 300 */
/* 数据点：1280(340,300) -> 1360(350,330) -> 1440(380,360) -> 1550(380,360) */
@media (min-width: 1280px) {
    .footer-inner {
        /* 左侧：1280到1440增长40px，斜率 0.25 */
        padding-left: calc(340px + (100vw - 1280px) * 0.25);
        /* 右侧：1280到1440增长60px，斜率 0.375 */
        padding-right: calc(300px + (100vw - 1280px) * 0.375);
    }
}

/* 阶段 C：超大屏/生产力屏平滑期 (1550px - 1919px) */
/* 数据点：1550(380,360) -> 1600(370,370) -> 1920(380,360) */
@media (min-width: 1550px) {
    .footer-inner {
        /* 左侧：1550到1600缩减10px，1600到1920增加10px */
        /* 取 1550-1920 的微调斜率，使其在 1920 达到 380 */
        padding-left: calc(380px + (100vw - 1550px) * 0); /* 趋于稳定，或微量调整 */

        /* 右侧：1550到1600增加10px，1600到1920缩减10px，1920回归360 */
        padding-right: calc(360px + (100vw - 1550px) * 0);
    }
}

/* 阶段 D：极限宽度对齐 (1920px+) */
/* 锁定 380/360 并开启居中补偿 */
@media (min-width: 1920px) {
    .footer-inner {
        /* (100vw - 1920) / 2 是窗口继续拉宽时保持正文对齐的偏移量 */
        padding-left: calc(380px + (100vw - 1920px) / 2);
        padding-right: calc(360px + (100vw - 1920px) / 2);
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

</style>