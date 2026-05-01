<template>
    <footer v-if="frontmatter.footer !== false" class="custom-footer" :class="{ 'has-sidebar': hasSidebar }">
        <div class="footer-inner">
            <div class="container">
                <p class="copyright">
                    <span class="footer-group">Copyright © 2025-{{ currentYear }}
                         <a href="https://github.com/DowneyRem/PixivSource" target="_blank" rel="noopener">PixivSource</a>
                    </span>
                    <span class="footer-group rights">All rights reserved.</span>
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useData } from 'vitepress'
const { frontmatter, hasSidebar } = useData()

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.custom-footer {
    width: 100%;
    /* 1. 移除上外边距，让它直接贴着上面的友链组件 */
    margin-top: 0;
    /* 2. 缩小上下内边距 (原本是 32px 24px) */
    padding: 16px 24px;
    background-color: var(--vp-c-bg);
    border-top: none;
}

.footer-inner {
    margin: 0 auto;
    max-width: var(--vp-layout-max-width);
}

/* --- 核心：复用你之前调试完美的平滑拟合逻辑 --- */
/* 仅在有侧边栏的页面（正文页）应用不对称偏移，确保与正文/友链对齐 */
@media (min-width: 960px) {
    .has-sidebar .footer-inner {
        padding-left: calc(330px + (100vw - 960px) * 0.322);
        padding-right: calc(60px + (100vw - 960px) * 0.29);
    }
}

@media (min-width: 1280px) {
    .has-sidebar .footer-inner {
        padding-left: calc(340px + (100vw - 1280px) * 0.25);
        padding-right: calc(300px + (100vw - 1280px) * 0.375);
    }
}

.container {
    text-align: center;
}

.copyright {
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    /* 使用 VitePress 官方次级文本颜色 (标准黑白) */
    color: var(--vp-c-text-2);
}

/* 链接样式：平时跟随文字颜色，悬浮显示品牌色 */
.copyright a {
    color: inherit;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: color 0.25s;
}

.copyright a:hover {
    color: var(--vp-c-brand-1);
    text-decoration-style: solid;
}

/* 如果在首页，容器保持居中且无偏移 */
:not(.has-sidebar) .footer-inner {
    padding: 0;
    text-align: center;
}

.copyright {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
}

.copyright a {
    color: inherit;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: color 0.25s;
}
.copyright a:hover {
    color: var(--vp-c-brand-1);
}

/* 手机端适配：分两行显示 */
@media (max-width: 640px) {
    .copyright {
        flex-direction: column; /* 垂直排列 */
        gap: 0px; /* 紧凑排列 */
    }

    .footer-group {
        display: block; /* 强制占满一行 */
    }

    .rights {
        font-size: 13px; /* 第二行稍微缩小，视觉更好看 */
        opacity: 0.8;
    }
}

/* 手机端适配 (小于 640px) */
@media (max-width: 640px) {
    .copyright {
        /* 变成垂直排列 */
        flex-direction: column;
        gap: 0px;
    }

    .rights-text {
        /* 或者通过强制换行 */
        display: block;
        font-size: 12px; /* 手机端版权声明可以稍微小一点，更有层次感 */
        opacity: 0.8;
    }
}
</style>