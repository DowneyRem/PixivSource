// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import "vitepress-markdown-timeline/dist/theme/index.css"; // 引入时间线样式
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';


import { h, watch } from "vue";
import BackToTop from "./components/BackToTop.vue";
import CustomFooter from "./components/CustomFooter.vue";
import DownToDiscuss from "./components/DownToDiscuss.vue";
import DragonChat from './components/DragonChat.vue'
import FriendLink from "./components/FriendLink.vue"
import FriendLinkFooter from './components/FriendLinkFooter.vue'
import FriendLinkHome from './components/FriendLinkHome.vue'
import HomeUnderline from "./components/HomeUnderline.vue"
import NotFound from "./components/404.vue";
import Sponsor from "./components/Sponsor.vue";
import UpdateTime from "./components/UpdateTime.vue"
import './style/index.css'

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            "not-found": () => h(NotFound),
            "doc-before": () => h(UpdateTime),
            "layout-bottom": () => h('div', null, [
                h(FriendLinkFooter),
                h(CustomFooter),
            ]),

            // 将“回到顶部”和“直达评论”都挂载在文档页面的合适位置
            "doc-footer-before": () => h(
                h('div', null, [
                    h(BackToTop),
                    h(DownToDiscuss)
                ]
            )),
        }),

    setup() {
        // Get frontmatter and route
        const { frontmatter } = useData();
        const route = useRoute();

        // giscus配置
        giscusTalk({
                repo: 'DowneyRem/PixivSource', //仓库
                repoId: 'MDEwOlJlcG9zaXRvcnkzNTQyNDk4OTc=', //仓库ID
                category: 'General', // 讨论分类
                categoryId: 'DIC_kwDOFR1sqc4C0ryo', //讨论分类ID
                mapping: 'pathname',
                inputPosition: 'bottom',
                lang: 'zh-CN',
            },
            {
                frontmatter, route
            },
            true
        );
    },
    enhanceApp({app , router }) {
        app.component('DragonChat', DragonChat)
        app.component('FriendLink', FriendLink)
        app.component('HomeUnderline', HomeUnderline)
        app.component('FriendLinkHome', FriendLinkHome)
        // app.component('UpdateTime', UpdateTime)
        app.component('Sponsor', Sponsor)

        // 彩虹背景动画样式
        if (typeof window !== 'undefined') {
            watch(
                () => router.route.data.relativePath,
                () => updateHomePageStyle(location.pathname === "/"),
                { immediate: true },
            )
        }
    }
};

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return

        homePageStyle.remove()
        homePageStyle = undefined
    }
}