export const BLOG = "https://downeyrem.pages.dev/"

const homeMenu = {
    text: "🏠 主页",
    link: "/"
}

const toolMenu = {
    text: "常用工具",
    collapsed: false,
    items: [
        { text: "⬇️ 下载阅读", link: "/Download" },
        { text: "🚀 一键导入", link: "/Import" }
    ]
}

const quickMenu = {
    text: "快速开始",
    collapsed: false,
    items: [
        { text: "✨ 臻享阅读", link: "/BetterExperience" },
        { text: "⚡️ 快速开始", link: "/QuickStart" },
        { text: "➕ 添加小说", link: "/AddNovels" }
    ]
}

const pixivMenu = {
    text: "Pixiv 书源",
    collapsed: false,
    items: [
        { text: "️🅿️ 功能手册 ", link: "/Pixiv" },
        { text: "🆚 功能对比", link: "/PixivComparison" },
        { text: "⚙️ 书源设置", link: "/PixivSettings" }
    ]
}

const furryMenu = {
    text: "兽人小说",
    collapsed: false,
    items: [
        { text: "🅿️ Pixiv 书源", link: "/Pixiv" },
        { text: "🦊 Linpx 书源", link: "/Linpx" },
        { text: "🐯 兽人控小说站 书源", link: "/FurryNovel" }
    ]
}

const normalMenu = {
    text: "通用教程",
    // collapsed: true,
    items: [
        { text: "📚 软件合集", link: "/Legado" },
        { text: "🚀 导入书源", link: "/ImportBookSource" },
        { text: "🚀 导入订阅", link: "/ImportRssSource" },
        { text: "📌 使用技巧", link: "/LegadoTips" },
        { text: "💾 备份恢复", link: "/WebdavBackup" },
        { text: "☁️ 远程书籍", link: "/RemoteBooks" },
        { text: "🛠️ 故障排查", link: "/TroubleShoot" },
    ]
}

const devMenu = {
    text: "开发动态",
    collapsed: true,
    items: [
        { text: "📜 更新日志", link: "/UpdateLog" },
        { text: "🚀 项目进展", link: "/TimeLine" },
        { text: "🌱 项目起源", link: "/Beginning" },
        { text: "🔌 Pixiv Api", link: "/PixivWebApi" },
        { text: "👥 开发团队", link: "/Team" },
        { text: "🤝 友情链接", link: "/FriendLink" }
    ]
}
const sponsorMenu = {
    text: "打赏记录",
    collapsed: false,
    items: [
        { text: "☕ 支持开发", link: "/Sponsor" },
        { text: "💵 打赏记录", link: `${BLOG}Sponsor` }
    ]
}

const logMenu = {
    text: "开发动态",
    base: "/UpdateLog/",
    collapsed: false,
    items: [
        { text: "📜 日志 2026", link: "2026" },
        { text: "📜 日志 2025", link: "2025" },
        { text: "📜 日志 2024", link: "2024" }
    ]
}

const defaultMenu = [
    toolMenu,
    quickMenu,
    pixivMenu,
    // furryMenu,
    // normalMenu,
    devMenu,
    sponsorMenu,
]

const linpxMenu = [
    toolMenu,
    quickMenu,
    // pixivMenu,
    furryMenu,
    // normalMenu,
    devMenu,
    sponsorMenu,
]

const generalMenu = [
    toolMenu,
    // quickMenu,
    // pixivMenu,
    // furryMenu,
    normalMenu,
    devMenu,
    sponsorMenu,
]

const updateLogMenu = [
    toolMenu,
    logMenu,
    devMenu,
    sponsorMenu,
]

export const cnNav = [
    homeMenu,
    toolMenu,
    newMenu,
    legadoMenu,
    devMenu,
]

export let cnSidebar = {
    "/": defaultMenu,
    "/Linpx": linpxMenu,
    "/FurryNovel": linpxMenu,
    "/UpdateLog/": updateLogMenu,
}

const generalLinks = legadoMenu.items.map(item => item.link)
generalLinks.forEach(link => {cnSidebar[link] = generalMenu})

// 翻转 key 顺序，优先匹配设定规则
cnSidebar = Object.fromEntries(Object.entries(cnSidebar).reverse())


export const twNav = [
    {
        text: "🏠 主頁",
        link: "/zh-TW/"
    },
    {
        text: "📌 站方功能",
        activeMatch: "/",
        items: [
            { text: "⬇️ 下載閱讀", link: "/zh-TW/Download" },
            { text: "🚀 一鍵匯入", link: "/zh-TW/Import" }
        ]
    },
    {
        text: "📚 書源指南",
        activeMatch: "/",
        items: [
            { text: "✨ 臻享閱讀", link: "/zh-TW/BetterExperience", activeMatch: "/" },
            { text: "⚡️️️ 快速開始", link: "/zh-TW/QuickStart" },
            { text: "➕ 新增小說", link: "/zh-TW/AddNovels" },
            { text: "🅿️ Pixiv 書源", link: "/zh-TW/Pixiv" }
        ]
    },
    {
        text: "📖 閱讀指南",
        items: [
            { text: "📚 軟體合集", link: "/zh-TW/Legado" },
            { text: "🚀 匯入書源", link: "/zh-TW/ImportBookSource" },
            { text: "🚀 匯入訂閱", link: "/zh-TW/ImportRssSource" },
            { text: "📌 使用技巧", link: "/LegadoTips" },
            { text: "💾 備份恢復", link: "/zh-TW/WebdavBackup", activeMatch: "/" },
            { text: "☁️ 遠端書籍", link: "/zh-TW/RemoteBooks" },
            { text: "🛠️ 故障排查", link: "/zh-TW/TroubleShoot" }
        ]
    },
    {
        text: "🚧 開發動態",
        items: [
            { text: "📜 更新日誌", link: "/zh-TW/UpdateLog" },
            { text: "👥 開發團隊", link: "/zh-TW/Team" },
            { text: "🤝 友情連結", link: "/zh-TW/FriendLink" },
            { text: "☕ 支援開發", link: "/zh-TW/Sponsor", activeMatch: "/" },
            { text: "✍️ 作者部落格", link: BLOG
            }
        ]
    }
]

export const twSidebar = [
    {
        text: "站方功能",
        collapsed: false,
        items: [
            { text: "⬇️ 下載閱讀", link: "/zh-TW/Download" },
            { text: "🚀 一鍵匯入", link: "/zh-TW/Import" }
        ]
    },
    {
        text: "快速開始",
        collapsed: false,
        items: [
            { text: "✨ 臻享閱讀", link: "/zh-TW/BetterExperience" },
            { text: "⚡️️️ 快速開始", link: "/zh-TW/QuickStart" },
            { text: "➕ 新增小說", link: "/zh-TW/AddNovels" },
        ]
    },
    {
        text: "Pixiv 書源",
        collapsed: false,
        items: [
            { text: "🅿️ 功能手冊", link: "/zh-TW/Pixiv" },
            { text: "🆚 功能對比", link: "/zh-TW/PixivComparison" },
            { text: "⚙️ 書源設定", link: "/zh-TW/PixivSettings" }
        ]
    },
    {
        text: "通用教程",
        collapsed: true,
        items: [
            { text: "📚 軟體合集", link: "/zh-TW/Legado" },
            { text: "🚀 匯入書源", link: "/zh-TW/ImportBookSource" },
            { text: "🚀 匯入訂閱", link: "/zh-TW/ImportRssSource" },
            { text: "📌 使用技巧", link: "/LegadoTips" },
            { text: "💾 備份恢復", link: "/zh-TW/WebdavBackup" },
            { text: "☁️ 遠端書籍", link: "/zh-TW/RemoteBooks" },
            { text: "🛠️ 故障排查", link: "/zh-TW/TroubleShoot" }
        ]
    },
    {
        text: "開發動態",
        collapsed: false,
        items: [
            { text: "📜 更新日誌", link: "/zh-TW/UpdateLog" },
            { text: "🌱 專案起源", link: "/zh-TW/Beginning" },
            { text: "👥 開發團隊", link: "/zh-TW/Team" },
            { text: "🤝 友情連結", link: "/zh-TW/FriendLink" }
        ]
    },
    {
        text: "打賞記錄",
        collapsed: false,
        items: [
            { text: "☕ 支援開發", link: "/zh-TW/Sponsor" },
            { text: "💵 打賞記錄", link: `${BLOG}Sponsor` },
        ]
    }
]


export const enNav = [
    {
        text: "🏠 Home",
        link: "/en/"
    },
    {
        text: "📌 Toolkit",
        activeMatch: "/",
        items: [
            { text: "⬇️ Download", link: "/en/Download" },
            { text: "🚀 Import", link: "/en/Import" }
        ]
    },
    {
        text: "📚 Source Guide",
        activeMatch: "/",
        items: [
            // { text: "✨ Ultimate Read", link: "/en/BetterExperience", activeMatch: "/" },
            { text: "⚡️️️ Quick Start", link: "/en/QuickStart" },
            { text: "➕ Add Novels", link: "/en/AddNovels" },
            // { text: "🅿️ Pixiv Manual", link: "/en/Pixiv" }
        ]
    },
    {
        text: "📖 Legado Guide",
        items: [
            // { text: "📚 Legado Apps", link: "/en/Legado" },
            // { text: "🚀 Import BookSource", link: "/en/ImportBookSource" },
            // { text: "🚀 Import RssSource", link: "/en/ImportRssSource" },
            { text: "💾 Webdav Backup", link: "/en/WebdavBackup", activeMatch: "/" },
            // { text: "☁️ Remote Books", link: "/en/RemoteBooks" },
            { text: "🛠️ Trouble Shoot", link: "/en/TroubleShoot" }
        ]
    },
    {
        text: "🚧 Development",
        items: [
            { text: "📜 Updates", link: "/en/UpdateLog" },
            { text: "👥 Dev Team", link: "/en/Team" },
            { text: "🤝 Friend Link", link: "/en/FriendLink" },
            { text: "☕ Sponsor", link: "/en/Sponsor", activeMatch: "/" },
        ]
    }
]

export const enSidebar = [
    {
        text: "📌 Toolkit",
        activeMatch: "/",
        items: [
            { text: "⬇️ Download Apps", link: "/en/Download" },
            { text: "🚀 One-Click Import", link: "/en/Import" }
        ]
    },
    {
        text: "📚 Source Guide",
        activeMatch: "/",
        items: [
            // { text: "✨ Ultimate Read", link: "/en/BetterExperience" },
            { text: "⚡️️️ Quick Start", link: "/en/QuickStart" },
            { text: "➕ Add Novels", link: "/en/AddNovels" },
        ]
    },
    {
        text: "🅿️ Pixiv BookSource",
        collapsed: true,
        items: [
            // { text: "🅿️ Pixiv Manual", link: "/en/Pixiv" },
            // { text: "🆚 Comparison", link: "/PixivComparison" },
            // { text: "⚙️ Settings", link: "/PixivSettings" },
        ]
    },
    {
        text: "📖 Legado Guide",
        items: [
            // { text: "📚 Legado Apps", link: "/en/Legado" },
            // { text: "🚀 Import BookSource", link: "/en/ImportBookSource" },
            // { text: "🚀 Import RssSource", link: "/en/ImportRssSource" },
            { text: "💾 Webdav Backup", link: "/en/WebdavBackup" },
            // { text: "☁️ Remote Books", link: "/en/RemoteBooks" },
            { text: "🛠️ Trouble Shoot", link: "/en/TroubleShoot" }
        ]
    },
    {
        text: "🚧 Development",
        items: [
            { text: "📜 Updates", link: "/en/UpdateLog" },
            { text: "👥 Dev Team", link: "/en/Team" },
            { text: "🤝 Friend Link", link: "/en/FriendLink" },
        ]
    },
    {
        text: "Sponsor",
        collapsed: false,
        items: [
            { text: "☕ Sponsor", link: "/en/Sponsor" },
            // { text: "💵 Sponsorship History", link: `${BLOG}Sponsor` },
        ]
    },
]
