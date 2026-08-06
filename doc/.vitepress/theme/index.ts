// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme"
import "vitepress-markdown-timeline/dist/theme/index.css" // 引入时间线样式
import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import { useData, useRoute } from 'vitepress'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import { h, watch } from "vue"
import BackToTop from "./components/BackToTop.vue"
import CustomFooter from "./components/CustomFooter.vue"
import DownloadCard from "./components/DownloadCard.vue"
import DownloadList from "./components/DownloadList.vue"
import DownToDiscuss from "./components/DownToDiscuss.vue"
import DragonChat from './components/DragonChat.vue'
import FriendLink from "./components/FriendLink.vue"
import FriendLinkFooter from './components/FriendLinkFooter.vue'
import FriendLinkFooterHome from './components/FriendLinkFooterHome.vue'
import HomeUnderline from "./components/HomeUnderline.vue"
import ImportAction from "./components/ImportAction.vue"
import ImportRedirect from "./components/ImportRedirect.vue"
import NotFound from "./components/NotFound.vue"
import Sponsor from "./components/Sponsor.vue"
import TeamGroups from "./components/TeamGroups.vue"
import UpdateTime from "./components/UpdateTime.vue"
import './style/index.css'

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
    extends: DefaultTheme,
    Layout: () => {
        const route = useRoute()
        const isNotFound = route.component === null

        return h(DefaultTheme.Layout, null, {
            "not-found": () => h(NotFound),
            "doc-before": () => h(UpdateTime),

            // 只有当不是 404 页面时，才渲染底部内容
            "layout-bottom": !isNotFound ? () => h('div', null, [
                h(FriendLinkFooter),
                h(CustomFooter),
            ]) : undefined,

            "doc-footer-before": () => h('div', null, [
                h(BackToTop),
                h(DownToDiscuss)
            ]),
        })
    },

    setup() {
        // Get frontmatter and route
        const { needRefresh, updateServiceWorker } = useRegisterSW()
        const { frontmatter } = useData()
        const route = useRoute()

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
        )
    },
    enhanceApp({app , router }) {
        app.component('DownloadCard', DownloadCard)
        app.component('DownloadList', DownloadList)
        app.component('DragonChat', DragonChat)
        app.component('FriendLink', FriendLink)
        app.component('FriendLinkFooterHome', FriendLinkFooterHome)
        app.component('HomeUnderline', HomeUnderline)
        app.component('ImportAction', ImportAction)
        app.component('ImportRedirect', ImportRedirect)
        // app.component('UpdateTime', UpdateTime)
        app.component('TeamGroups', TeamGroups)
        app.component('Sponsor', Sponsor)

        // 彩虹背景动画样式
        const isHomePage = (path: string) =>
            /^(index\.md|.*\/index\.md)$/.test(path)
        if (typeof window !== 'undefined') {
            watch(
                () => router.route.data.relativePath,
                (path) => updateHomePageStyle(isHomePage(path)),
                { immediate: true }
            )
        }
    }
}

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite
    }`
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return

        homePageStyle.remove()
        homePageStyle = undefined
    }
}