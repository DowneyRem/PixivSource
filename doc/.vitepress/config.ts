import { defineConfig, type HeadConfig } from "vitepress"
import timeline from "vitepress-markdown-timeline";
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// 动态判断环境
// Cloudflare Pages 默认提供 CF_PAGES 环境变量
// GitHub Actions 默认提供 GITHUB_ACTIONS 环境变量
const isCF = process.env.CF_PAGES === '1' || process.env.PLATFORM === 'cloudflare'
const isGitHub = process.env.GITHUB_ACTIONS === 'true'

let HOSTNAME = "https://pixivsource.pages.dev/"
let BASE = "/"
if (isGitHub) {
    HOSTNAME = "https://downeyrem.github.io/PixivSource/"
    BASE = "/PixivSource/"
}

const CANONICAL_BASE = "https://pixivsource.pages.dev/"
const BLOG = "https://downeyrem.pages.dev/"


// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: "zh-CN",
    title: "Pixiv 书源",
    description: "适配 开源阅读 Legado 3.0 的 Pixiv 书源",
    base: BASE,  // 项目名称
    cleanUrls: true,        // 简洁URL
    ignoreDeadLinks: true,  // 忽略死链
    appearance: true,       // 默认主题由用户配色方案决定
    lastUpdated: true,      // 获取页面最后更新的时间戳
    head: [
        ['meta', { name: 'keywords', content: 'Pixiv 小说, Pixiv 阅读, Pixiv 书源, 阅读书源, Legado 书源, 开源阅读 Pixiv 书源, Pixiv 小说阅读器, 阅读3书源, Pixiv Source, Pixiv BookSource' }],
        // og:title / og:description 已移至 transformHead，由各页面 frontmatter 动态生成

        // 使用相对路径或动态 Base 确保图标加载正确
        ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: `${BASE}favicon.png` }],
        ["link", { rel: "apple-touch-icon", sizes: '180x180', href: `${BASE}favicon-180x180.png` }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${BASE}favicon-192x192.png` }],

        ["link", { rel: "preconnect", href: "https://www.googletagmanager.com" }],
        ["link", { rel: "preconnect", href: "https://www.google-analytics.com" }],

        // ["link", { rel: "manifest", href: "/manifest.json" }]
        ["script", {
            async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-MJW9QDKTDH" }],
        ["script", {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-MJW9QDKTDH");`
        ],
    ],

    // 每页动态注入 canonical 和 og 标签，GitHub Pages 构建时额外注入跳转
    transformHead({ pageData }) {
        const path = pageData.relativePath
            .replace(/index\.md$/, '')
            .replace(/\.md$/, '')

        const canonicalUrl = `${CANONICAL_BASE}/${path}`

        // 优先使用页面 frontmatter，回退到全局默认值
        const ogTitle = pageData.frontmatter.title ?? 'Pixiv 书源 - PixivSource'
        const ogDesc  = pageData.frontmatter.description ?? '用 Legado 开源阅读 App，像看网文一样阅读 Pixiv 上的小说'

        const heads: HeadConfig[] = [
            ['link',  { rel: 'canonical',         href: canonicalUrl }],
            ['meta',  { property: 'og:title',       content: ogTitle   }],
            ['meta',  { property: 'og:description', content: ogDesc    }],
        ]

        // 只有 GitHub Pages 构建时才注入跳转，本地开发不跳转
        if (isGitHub && !isCF) {
            heads.push(
                ['meta', { 'http-equiv': 'refresh', content: `0; url=${canonicalUrl}` }],
                ['script', {}, `window.location.replace("${canonicalUrl}")`]
            )
        }

        return heads
    },

    // 构建结束后自动生成 robots.txt
    buildEnd(siteConfig) {
        const robots = isCF
            // CF Pages（主站）：允许爬虫，声明 sitemap
            ? `User-agent: *\nAllow: /\n\nSitemap: https://pixivsource.pages.dev/sitemap.xml\n`
            // GitHub Pages（跳转站）：屏蔽爬虫，避免收录跳转页
            : `User-agent: *\nDisallow: /\n`

        writeFileSync(resolve(siteConfig.outDir, 'robots.txt'), robots)
    },

    themeConfig: {
        logo: `${BASE}favicon.png`,
        // siteTitle: false,   // 隐藏站点标题
        outline: {
            level: [2, 3],     // H2 H3 标题
            label: '本页目录'
        },
        returnToTopLabel: "回到顶部",
        nav: [
            { text: "✍️ 博客", link: BLOG },
            { text: "🏠 主页", link: "/" },
            {
                text: "📌 使用指南",
                activeMatch: '/',
                items: [
                    { text: "✨ 臻享阅读", link: "/BetterExperience", activeMatch: '/' },
                    { text: "⚡️️️ 快速开始", link: "/QuickStart" },
                    { text: "💾 备份恢复", link: "/WebdavBackup" , activeMatch: '/' },
                    { text: "🅿️ Pixiv 书源", link: "/Pixiv" },
                    { text: "🦊 Linpx 书源", link: "/Linpx" },
                ],
            },
            {
                text: "📖 阅读指南",
                items: [
                    { text: "⬇️ 下载阅读", link: "/Download" },
                    { text: "🚀 导入书源", link: "/ImportBookSource" },
                    { text: "💾 备份恢复", link: "/WebdavBackup" },
                    { text: "☁️ 远程书籍", link: "/RemoteBooks" },
                    { text: "🛠️ 故障排查", link: "/TroubleShoot" }
                ],
            },
            {
                text: "🚧 开发动态",
                items: [
                    { text: "📜 更新日志", link: "/UpdateLog" },
                    { text: "👥 开发团队", link: "/Team" },
                    { text: "🤝 友情链接", link: "/FriendLink" },
                    { text: "☕ 支持开发", link: "/Sponsor" , activeMatch: '/' },
                    { text: "✍️ 作者博客", link: BLOG },
                ],
            },
        ],
        lightModeSwitchTitle: "浅色模式",
        darkModeSwitchLabel: '深色模式',
        sidebarMenuLabel: "菜单",
        sidebar: [
            {
                text: "快速开始",
                collapsed: false,
                items: [
                    { text: "✨ 臻享阅读", link: "/BetterExperience" },
                    { text: "⚡️️️ 快速开始", link: "/QuickStart" },
                ]
            },
            {
                text: "专用教程",
                collapsed: false,
                items: [
                    { text: "🅿️ Pixiv 书源", link: "/Pixiv" },
                    { text: "🦊 Linpx 书源", link: "/Linpx" },
                    { text: "🐯 兽人控小说站 书源", link: "/FurryNovel" },
                ]
            },
            {
                text: "通用教程",
                collapsed: true,
                items: [
                    { text: "⬇️ 下载阅读", link: "/Download" },
                    { text: "🚀 导入书源", link: "/ImportBookSource" },
                    { text: "🚀 导入订阅", link: "/ImportRssSource" },
                    { text: "💾 备份恢复", link: "/WebdavBackup" },
                    { text: "☁️ 远程书籍", link: "/RemoteBooks" },
                    { text: "🛠️ 故障排查", link: "/TroubleShoot" }
                ]
            },
            {
                text: "开发动态",
                collapsed: false,
                items: [
                    { text: "📜 更新日志", link: "/UpdateLog" },
                    { text: "🌱 项目起源", link: "/Beginning" },
                    { text: "👥 开发团队", link: "/Team" },
                    { text: "🤝 友情链接", link: "/FriendLink" },
                ]
            },
            {
                text: "打赏记录",
                collapsed: false,
                items: [
                    { text: "☕ 支持开发", link: "/Sponsor" },
                    { text: "💵 打赏记录", link: `${BLOG}/Sponsor/Source` },
                ]
            },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/DowneyRem/PixivSource" },
            { icon: "codeberg", link: "https://codeberg.org/DowneyRem/PixivSource" },
            { icon: "telegram", link: "https://t.me/PixivSource" },
        ],
        lastUpdated: { text: '上次更新'},
        editLink: {
            pattern: "https://github.com/DowneyRem/PixivSource/blob/main/doc/:path",
            text: "在 GitHub 上编辑本文"
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        footer: {
            copyright: `Copyright © 2025-${new Date().getFullYear()} <a href="https://github.com/DowneyRem/PixivSource">PixivSource</a> All rights reserved.`
        },
        search: {
            provider: "local",
            options: {
                translations: {
                    button: {
                        buttonText: "搜索文档",
                        buttonAriaLabel: "搜索文档"
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "清除查询条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                            closeText: "Esc 键",
                        }
                    }
                }
            }
        }
    },
    markdown: {
        lineNumbers: true, // 行号显示
        // ✅ 通过 VitePress 原生入口配置锚点，避免与内置插件重复注册
        anchor: {
            slugify: (s: string) => s,
            permalink: false,
        },
        config: (md) => {
            md.use(timeline);

            // 图片渲染规则：懒加载 & 异步解码
            md.renderer.rules.image = (tokens, idx, options, env, self) => {
                const token = tokens[idx]
                token.attrSet('loading', 'lazy')    // 开启懒加载
                token.attrSet('decoding', 'async')  // 异步渲染图片
                return self.renderToken(tokens, idx, options)
            }

            // 链接渲染规则：处理站内导入链接
            const defaultRender = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
            md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                const hrefIndex = tokens[idx].attrIndex("href")
                if (hrefIndex >= 0) {
                    const hrefAttr = tokens[idx].attrs![hrefIndex]
                    let href = hrefAttr[1]
                    // @ts-ignore
                    if (href.startsWith("https://loyc.xyz/b/cdx.html?src=")) {
                        hrefAttr[1] = href.replace("https://loyc.xyz/b/cdx.html?src=", "")
                    }
                }
                return defaultRender(tokens, idx, options, env, self);
            };
        }
    },
    sitemap: {
        hostname: CANONICAL_BASE,
        lastmodDateOnly: true,  // print date not time
        xmlns: {   // 精简 xmlns
            news: false,
            xhtml: false,
            image: false,
        }
    }
})