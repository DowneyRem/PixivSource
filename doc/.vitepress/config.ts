import { defineConfig, type HeadConfig } from "vitepress"
import { withPwa } from '@vite-pwa/vitepress'

// 导入拆分出的各个子配置文件
import { getPwaConfig } from './pwaConfig'
import { getHeadConfig, getTransformHead } from './headConfig'
import { localesConfig } from './localesConfig'
import { enThemeConfig } from "./themeConfig.js"
import { markdownConfig } from './markdownConfig'
import { transformPageData, getBuildEndHook } from './hooksConfig'


// ─── 环境与路径计算 ───
const isCF = process.env.CF_PAGES === '1' || process.env.PLATFORM === 'cloudflare'
const isGitHub = process.env.GITHUB_ACTIONS === 'true'

const BASE = isGitHub ? "/PixivSource/" : "/"
const CANONICAL_BASE = "https://pixivsource.pages.dev/"


export default withPwa(defineConfig({
    lang: "zh-CN",
    base: BASE,
    cleanUrls: true,
    srcExclude: ['**/*Common*.md'],
    ignoreDeadLinks: true,
    appearance: true,
    lastUpdated: true,

    head: getHeadConfig(BASE),
    rewrites: {
        'zh-CN/:path*': ':path*'
    },
    locales: localesConfig,
    markdown: markdownConfig,
    transformPageData,
    buildEnd: getBuildEndHook(isCF, isGitHub),
    transformHead: getTransformHead(isCF, isGitHub, CANONICAL_BASE),

    // 顶层全局通用主题配置
    themeConfig: {
        logo: `${BASE}favicon.png`,
        // siteTitle: false,   // 隐藏站点标题
        outline: {
            level: [2, 3],     // H2 H3 标题
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/DowneyRem/PixivSource" },
            { icon: "codeberg", link: "https://codeberg.org/DowneyRem/PixivSource" },
            { icon: "telegram", link: "https://t.me/PixivSource" },
        ],
        editLink: {
            pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
        },
        // footer: {
        //     copyright: `Copyright © 2025-${new Date().getFullYear()} <a href="https://github.com/DowneyRem/PixivSource">PixivSource</a> All rights reserved.`
        // },
        ...enThemeConfig,
    },

    sitemap: {
        hostname: CANONICAL_BASE,
        lastmodDateOnly: true,
        xmlns: { news: false, xhtml: true, image: false }
    },

    pwa: getPwaConfig(BASE)
}))