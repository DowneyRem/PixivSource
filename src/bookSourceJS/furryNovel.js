/**
 * 纯 JavaScript 单文件书源模板。
 * config 配置对象加若干函数声明即完整书源：search、getChapters、getContent 必须实现，
 * getBookInfo 可选，config.exploreUrl 与 explore 成对使用。
 * getReviewSummary 与 getReviewDetail 成对声明即启用段评。
 *
 * - 可直接使用 java、source、cookie、cache、baseUrl 等绑定。网络请求为同步 API，
 *   如 java.ajax(url)；调试输出用 java.log(msg)；完整 API 参阅应用内帮助。
 * - 每次函数调用在新作用域执行；跨请求状态用 cache.put/get 或 source.setVariable/getVariable。
 * - 支持常用 ES6 语法；不支持 class、async/await、Promise 回调和函数展开调用。
 * - book/chapter 属性、java.ajax 和 Jsoup 的返回值可能是 Java 字符串对象，使用字符串方法
 *   或进行判空前，先用 String(value) 转换。
 */

/**
 * 书源配置。字段名与 BookSource 实体一致。
 * 常用可选字段包括 header（JSON 格式请求头）、loginUrl（登录页地址，WebView 登录）、
 * loginUi（表单登录，RowUi 数组，与顶层 login 函数成对）、concurrentRate、
 * enabledCookieJar 和 jsLib。enabled、customOrder 等用户态字段由应用维护。
 */
const config = {
    bookSourceUrl: "https://furrynovel.com/zh",
    bookSourceName: "🐯 兽人小说 JS",
    bookSourceType: 0, // 0 文本，1 音频，2 图片，3 下载
    bookSourceGroup: "🔞 Pixiv,🐲 Furry",
    bookSourceComment: (() => { return `
🐯 兽人控小说站 JS书源（更新📆：2026/11/04）

书源版本：291
使用说明：📌阅读 T 3.26.0818 版本可用
可用功能：✅搜索✅发现✅添加网址✅订阅源
搜索小说：✅单篇✅系列✅作者✅标签
发现小说：✅热门小说✅最新小说✅随便来点
添加网址：✅兽人控小说站链接
订阅用法：点击订阅源打开小说/系列小说，点击【加入书架】按钮，添加小说到书架

书源发布：Pixiv 书源频道 https://t.me/PixivSource
兽人阅读频道 https://t.me/FurryReading
项目地址：https://github.com/DowneyRem/PixivSource
使用教程：https://pixivsource.pages.dev/FurryNovel

⚙️ 书源设置：
书源管理 - 编辑书源 - 基本 - 变量说明 - 修改并保存
`.trim()
    })(),
    // 发现分类，由 explore 抓取。数组每项 {title, url}，url 原样传入 explore；
    // 省略 url 的项渲染为分区标题。也接受“名称::url”每行一个的字符串形态。
    header: {"Referer":"https://furrynovel.com/"},
    // loginUrl
    loginUi: [],
    exploreUrl: (() => {
        // let keyword = String(source.getVariable()).replace("#", "")
        // let key = keyword.split(/[ 　,，、\n]/)
        // if (key.includes("")) {
        //     key.splice(key.indexOf(""), 1)
        // }
        // if (key.length === 0) {
        //     sleepToast("可设置源变量，筛选发现 🔍 ")
        //     sleepToast('发现页 - 长按"兽人控小说站" - 编辑 - 右上角菜单 - 设置源变量')
        // } else {
        //     sleepToast(`正在搜索：${key.join("、")}`)
        // }

        // let settings = getFromCacheObject("FNSettings")
        // if (!settings) settings = setDefaultSettings()

        let key = []
        let li = []
        let novel = [
            {"🔥 热门": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=popular&${key.map(v => "tags[]=" + v).join("&")}`},
            {"🆕 最新": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=latest&${key.map(v => "tags[]=" + v).join("&")}`},
            {"🔄 随便": `https://api.furrynovel.com/api/novel?page={{page}}&order_by=random&${key.map(v => "tags[]=" + v).join("&")}`},
            {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json"},
        ]
        let about = [
            {"📙 书源相关 📙": ""},
            {"🏠 主页": "https://pixivsource.pages.dev"},
            {"🔰 指南": "https://pixivsource.pages.dev/FurryNovel"},
            {"🐞 反馈": "https://github.com/DowneyRem/PixivSource/issues"},
            {"💰 打赏": "https://pixivsource.pages.dev/Sponsor"},
        ]

        // 添加发现
        li = li.concat(novel).concat(about)
        // if (settings.SHOW_ADULT) li = li.concat(novel)
        // if (settings.SHOW_ABOUT) li = li.concat(about)

        // 格式化发现地址
        li.forEach(item => {
            item.title = Object.keys(item)[0]
            item.url = Object.values(item)[0]
            delete item[Object.keys(item)[0]]
            item.style = {}
            item.style.layout_flexGrow = 1
            item.style.layout_flexShrink = 1
            item.style.layout_alignSelf = "auto"
            item.style.layout_wrapBefore = "false"
            if (item.url === "") {
                item.style.layout_flexBasisPercent = 1
            } else {
                item.style.layout_flexBasisPercent = -1
            }
        })
        return li
    })(),
    concurrentRate: "30/5000",
    enabledCookieJar: true,
    lastUpdateTime: 1788019258510, // 版本时间戳（毫秒）；导入值较新时提示更新
}

const Jsoup = org.jsoup.Jsoup
const isJSBookSource = true
const bookSourceName = "furryNovel"

/**
 * 搜索书籍。
 * @param {string} key 搜索关键词
 * @param {number} page 页码，从 1 开始
 * @returns { [{name, bookUrl, author, kind, coverUrl, intro, wordCount, latestChapterTitle, tocUrl, type}] } 书籍数组或 JSON 字符串；name、bookUrl 必填，地址用绝对 URL
 */
function search(key, page) {
    let novels = []
    java.log(urlSearchNovel(key, page))
    let resp = getAjaxJson(urlSearchNovel(key, page))
    if (resp.code === 200 && resp.count > 0) {
        novels = novels.concat(resp.data)
    }
    novels = novels.sort((a, b) => (a.source_id > b.source_id ? 1 : -1))
    return formatNovels(handNovels(novels))
}

/**
 * 获取发现页书籍，与 config.exploreUrl 成对使用。
 * @param {string} url exploreUrl 中的分类地址，原样传入
 * @param {number} page 页码，从 1 开始
 * @returns 同 search
 */
function explore(url, page) {
    if (url.includes("cdn.jsdelivr.net" || "raw.githubusercontent.com")) {
        updateSource(); return []
    }
    if(url.includes("furrynovel.com")) {
        let resp = getAjaxJson(url.replace("{{page}}", page))
        return formatNovels(handNovels(resp))
    }
    else {
        startBrowser(url, ""); return []
    }
}


/**
 * 获取书籍详情。可选；仅写出的字段覆盖原值。
 * @param {Object} book 搜索结果中的书籍对象
 * @returns { {name, author, intro, coverUrl, kind, wordCount, latestChapterTitle, tocUrl, type, variable} } 字段补丁对象或 JSON 字符串
 */
function getBookInfo(book) {
    let novelId = book.bookUrl.match(new RegExp("\\d+"))[0]
    let novel = getAjaxJson(urlNovelDetail(novelId)).data
    book = novel = formatNovels(handNovels([novel]))[0]
    book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
    book.tocUrl = novel.catalogUrl = urlNovelChapterInfo(novel.id)
    return book
}

/**
 * 获取目录。
 * @param {Object} book 书籍对象
 * @returns { [{title, url, isVolume, isVip, isPay, wordCount, tag, resourceUrl}] } 目录数组或 JSON 字符串；title、url 必填，数组序即目录序
 */
function getChapters(book) {
    let novelId = book.bookUrl.match(new RegExp("\\d+"))[0]
    let novels = getAjaxJson(urlNovelChapterInfo(novelId)).data
    novels.forEach(novel => {
        novel.title = novel.name.trim()
        novel.url = urlNovelChapter(novelId, novel.id)
        novel.createDate = timeTextFormat(novel.created_at)
        novel.updateDate = timeTextFormat(novel.updated_at)
        novel.chapterInfo = `${novel.createDate}　　${novel.text_count}字`
    })
    return novels
}

function urlNovelChapter(novelId, chapterId) {
    let settings = getFromCacheObject("FNSettings")
    if (settings.SHOW_ORIGINAL_LINK) {
        return urlNovelChapterUrl(novelId, chapterId)
    } else {
        return urlNovelChapterDetail(novelId, chapterId)
    }
}

/**
 * 获取正文。运行时额外提供 nextChapterUrl，表示下一章地址，可能为 null。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns {string} 正文文本；返回空字符串视为失败。纯文本段落用 \n 分隔；
 *   也可将正文 HTML 传入 java.htmlFormat(html, chapter.url) 转换为文本并保留插图
 */
function getContent(chapter, book) {
    let bookId = book.bookUrl.match(new RegExp("\\d+"))[0]
    let chapterId = chapter.url.match(RegExp(/\/(\d+)\/chapter\/(\d+)/))[2]
    let resp = getAjaxJson(urlNovelChapterDetail(bookId, chapterId)).data
    let content = resp.content

    // 替换 Pixiv 标记符
    content = replaceUploadedImage(resp, content)
    content = replacePixivImage(content)
    content = replaceNewPage(content)
    content = replaceChapter(content)
    content = replaceJumpPage(content)
    content = replaceJumpUrl(content)
    content = replaceRb(content)
    return content
}

// 获取 [uploadedimage:] 的图片链接
function replaceUploadedImage(resp, content) {
    let hasEmbeddedImages = content.match(RegExp(/\[uploadedimage:(\d+)-?(\d+)]/gm))
    if (hasEmbeddedImages) {
        let novel = getAjaxJson(urlNovelDetailLinpx(resp.source_id))
        Object.keys(novel.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${urlPxImgUrlLinpx(novel.images[key].origin)}">`)
        })
    }
    return content
}
// 获取 [pixivimage:] 的图片链接 [pixivimage:1234] [pixivimage:1234-1]
function replacePixivImage(content) {
    let matched = content.match(RegExp(/\[pixivimage:(\d+)-?(\d+)]/gm))
    if (matched) {
        matched.forEach(pixivimage => {
            let matched2, illustId, order = 0
            if (pixivimage.includes("-")) {
                matched2 = pixivimage.match(RegExp("(\\d+)-(\\d+)"))
                illustId = matched2[1]; order = matched2[2]
            } else {
                matched2 = pixivimage.match(RegExp("\\d+"))
                illustId = matched2[0];
            }
            if (urlIllustOriginal(illustId, order)) {
                content = content.replace(`${pixivimage}`, `<img src="${urlIllustOriginal(illustId, order)}">`)
            } else {
                content = content.replace(`${pixivimage}`, ``)
            }
        })
    }
    return content
}
// 替换 Pixiv 分页标记符号 [newpage]
function replaceNewPage(content) {
    // if (!util.environment.IS_LYC_BRUNCH) {
    let matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
    if (matched) {
        for (let i in matched) {
            content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}`)
        }
    }
    // }
    return content
}
// 替换 Pixiv 章节标记符号 [chapter:]
function replaceChapter(content) {
    let matched = content.match(RegExp(/\[chapter:(.*?)]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[chapter:(.*?)]/m)
            let chapter = matched2[1].trim()
            // 替换 Pixiv 分页标记符号 [newpage]
            // if (util.environment.IS_LYC_BRUNCH) {
            //     content = content.replace(`${matched[i]}`, `<usehtml><h3>${chapter}</h3></usehtml>`)
            // } else {
            content = content.replace(`${matched[i]}`, `${chapter}<p>​<p/>`)
            // }
        }
    }
    return content
}
// 替换 Pixiv 跳转页面标记符号 [[jump:]]
function replaceJumpPage(content) {
    let matched = content.match(RegExp(/\[jump:(\d+)]/gm))
    if (matched) {
        for (let i in matched) {
            let page = matched[i].match(/\d+/)
            content = content.replace(`${matched[i]}`, `\n\n跳转至第${page}节`)
        }
    }
    return content
}
// 替换 Pixiv 链接标记符号 [[jumpuri: > ]]
function replaceJumpUrl(content) {
    let matched = content.match(RegExp(/\[\[jumpuri:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[jumpuri:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let urlName = matched2[1].trim()
            let urlLink = matched2[2].trim()

            // if (util.environment.IS_LYC_BRUNCH) {
            //     content = content.replace(`${matchedText}`, `<usehtml><p>　　<a href=${urlLink}>${urlName}</a></p></usehtml>`)
            // } else {
            if (urlLink === urlName) {
                content = content.replace(`${matchedText}`, `${urlName}`)
            } else {
                content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
            }
            // }
        }
    }
    return content
}
// 替换 Pixiv 注音标记符号 [[rb: > ]]
function replaceRb(content) {
    let settings = getFromCacheObject("FNSettings")
    let matched = content.match(RegExp(/\[\[rb:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[rb:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let kanji = matched2[1].trim()
            let kana = matched2[2].trim()

            // 默认替换成（括号）
            if (!settings.REPLACE_TITLE_MARKS) {
                content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
            } else {
                let reg = RegExp("[\\u4E00-\\u9FFF]+", "g");
                if (reg.test(kana)) {
                    // kana为中文，则替换回《书名号》
                    content = content.replace(`${matchedText}`, `${kanji}《${kana}》`)
                } else {
                    // 阅读不支持 <ruby> <rt> 注音
                    // content = content.replace(`${matchedText}`, `<ruby>${kanji}<rt>${kana}</rt></ruby>`)
                    content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
                }
            }
        }
    }
    return content
}

/**
 * 段评统计，与 getReviewDetail 成对使用。章节加载后调用，返回各段落的评论数。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns { [{paraIndex, count, paraData}] } 数组或 JSON 字符串；paraIndex 段落序号（从 1 起），count 评论数（≤0 忽略），paraData 可选，传给 getReviewDetail
 */
function getReviewSummary(chapter, book) {
    const html = java.ajax(`${config.bookSourceUrl}/review/summary?cid=${chapter.url}`)
    const list = []
    // list.push({ paraIndex: 1, count: 5, paraData: "token" })
    return list
}

/**
 * 段评详情，与 getReviewSummary 成对使用。点击段评图标时调用，支持翻页。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @param {number} paraIndex 段落序号
 * @param {string} paraData getReviewSummary 返回的附加数据，可能为空字符串
 * @param {number} page 页码，从 1 开始
 * @returns { {items: [{content, id, name, avatar, badge, replies}], nextPageUrl} } content 必填，replies 为同结构子评论数组；nextPageUrl 非空则可继续翻页，翻页由 page 递增自行拼接
 */
function getReviewDetail(chapter, book, paraIndex, paraData, page) {
    const html = java.ajax(`${config.bookSourceUrl}/review/detail?para=${paraIndex}&page=${page}`)
    const items = []
    // items.push({ content: "评论内容", name: "用户名", replies: [{ content: "回复内容" }] })
    return { items, nextPageUrl: null }
}


// util 工具
function debugFunc(func) {
    let settings = getFromCacheObject("FNSettings")
    if (settings.DEBUG) {
        func()
    }
}

// Handler
function handNovels(novels) {
    novels.forEach((novel) => {
        // novel.id = novel.id
        novel.title = novel.name
        // novel.tags = novel.tags
        novel.userName = novel.author.name
        // novel.userId = novel.author.id
        novel.textCount = null
        if (novel.latest_chapters === undefined) {
            novel.latestChapter = null
            novel.detailedUrl = urlNovelDetail(novel.id)
        } else {
            novel.latestChapter = novel.latest_chapters[0].name
            novel.detailedUrl = urlNovelUrl(novel.id)
        }
        novel.description = novel.desc
        novel.coverUrl = novel.cover
        novel.sourceUrl = urlSourceUrl(novel.source, novel.ext_data.oneshot, novel.source_id)

        novel.createDate = novel.created_at
        novel.updateDate = novel.updated_at
        novel.syncDate = novel.fetched_at
        // novel.status = novel.status
        // if (novel.status !== "publish") {  // suspend
        //     java.log(urlNovelUrl(novel.id))
        //     java.log(novel.sourceUrl)
        // }
    })
    return novels
}

function formatNovels(novels) {
    novels.forEach((novel) => {
        novel.title = novel.title.trim()
        if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
        novel.tags2 = []
        for (let i in novel.tags) {
            let tag = novel.tags[i]
            if (tag.includes("/")) {
                let tags = tag.split("/")
                novel.tags2 = novel.tags2.concat(tags)
            } else {
                novel.tags2.push(tag)
            }
        }
        novel.tags = Array.from(new Set(novel.tags2))
        novel.tags = novel.tags.map((item) => `#${item}`)
        novel.tags = novel.tags.join(",")

        novel.createDate = timeTextFormat(novel.createDate)
        novel.updateDate = timeTextFormat(novel.updateDate)
        novel.syncDate = timeTextFormat(novel.syncDate)
        // if (util.settings.MORE_INFORMATION) {
        novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n同步：${novel.syncDate}\n简介：${novel.description}`
        // } else {
        //     novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}\n同步时间：${novel.syncDate}`
        // }

        novel.name = novel.title
        novel.bookUrl = novel.detailedUrl
        novel.author = novel.userName
        novel.kind = novel.tags
        // novel.coverUrl = novel.coverUrl
        novel.intro = novel.description
        novel.wordCount = novel.textCount
        novel.latestChapterTitle = novel.latestChapter
        novel.tocUrl = novel.catalogUrl
    })
    return novels
}


// JSLib cache
var cacheSaveSeconds = 30*24*60*60  // 长期缓存 30 天
var cacheTempSeconds = 10*60*1000   // 冷却时间 10 分钟
function cacheGetAndSet(key, supplyFunc, requestUpdate) {
    const {java, cache} = this
    let timestamp = 0
    let v = getFromCacheObject(key)
    if (Array.isArray(v)) {
        try {
            timestamp = v[0].timestamp
        } catch (e) {
            timestamp = 0
        }
    } else if (v) {
        timestamp = v.timestamp
    }

    const isExpired = v && (new Date().getTime() >= timestamp + cacheTempSeconds)
    const isError = v && (v.error === true) && isExpired
    requestUpdate = requestUpdate && isExpired

    if (!v || requestUpdate || isError) {
        v = supplyFunc()
        let now = new Date().getTime()
        // getAjaxJson getWebviewJson 时间戳写入对象本身
        if (!Array.isArray(v)) {
            v = Object.assign({timestamp: now}, v)
        }
        // else {
        //     // getAjaxAllJson 时间戳写入第一个元素（读取时 v[0].timestamp）// 不重复写入
        //     if (v.length > 0) v[0] = Object.assign({timestamp: now}, v[0])
        // }
        putInCacheObject(key, v, cacheSaveSeconds)
    }
    return v
}

function putInCache(name, object, saveSeconds) {
    if (saveSeconds === undefined) saveSeconds = 0
    if (object) cache.put(name, object, saveSeconds)
}
function getFromCache(name) {
    let object = cache.get(name)
    if (object === undefined) return null  // 兼容源阅
    return object
}

function putInCacheObject(objectName, object, saveSeconds) {
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(objectName, JSON.stringify(object), saveSeconds)
}
function getFromCacheObject(objectName) {
    let object = cache.get(objectName)
    if (object === undefined) return null  // 兼容源阅
    return JSON.parse(object)
}

function getAjaxJson(url, requestUpdate) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    }, requestUpdate)
}
function getAjaxAllJson(urls, requestUpdate) {
    let batchKey = JSON.stringify(urls)
    return cacheGetAndSet(batchKey, () => {
        let results = []
        let now = new Date().getTime()
        let responses = java.ajaxAll(urls)
        for (let i in urls) {
            let data = JSON.parse(responses[i].body())
            data = Object.assign({timestamp: now}, data)
            results.push(data)
            putInCacheObject(urls[i], data, cacheSaveSeconds)
        }
        return results
    }, requestUpdate)
}
function getWebviewJson(url) {
    return cacheGetAndSet(url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse((html.match(new RegExp(">\\[{.*?}]<"))[0].replace(">", "").replace("<", "")))
    })
}
function getWebViewUA() {
    let userAgent = getFromCache("userAgent")
    if (userAgent) return String(userAgent)

    userAgent = String(java.getWebViewUA())
    // java.log(`userAgent=${userAgent}`)
    putInCache("userAgent", userAgent, cacheSaveSeconds/4)
    return String(userAgent)
}

function startBrowser(url, title) {
    if (!title) title = url
    let msg = "", headers = {}
    headers["User-Agent"] = getWebViewUA()
    headers["Referer"] = "https://furrynovel.com/zh/"

    if (url.includes("github.com") || url.includes("github.io")) {
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg, 0.01)
    java.startBrowser(`${url}, ${JSON.stringify({headers: headers})}`, title)
}

// JSLib url
function urlNovelUrl(novelId) {
    return `https://furrynovel.com/zh/novel/${novelId}`
}
function urlNovelDetail(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}`
}
function urlNovelDetailLinpx(sourceId) {
    return `https://api.linpx.ink/pixiv/novel/${sourceId}/cache`
}
function urlNovelsDetail(novelIds) {
    return `https://api.furrynovel.com/api/zh/novel?${novelIds.map(v => "ids[]=" + v).join("&")}`
}
function urlNovelChapterUrl(novelId, chapterId) {
    return `https://furrynovel.com/zh/novel/${novelId}/chapter/${chapterId}`
}
function urlNovelChapterInfo(novelId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter`
}
function urlNovelChapterDetail(novelId, chapterId) {
    return `https://api.furrynovel.com/api/zh/novel/${novelId}/chapter/${chapterId}`
}

function urlSourceUrl(source, oneShot, sourceId) {
    if (source === "bilibili") {
        return `https://www.bilibili.com/read/readlist/rl${sourceId}/`
    }
    if (source === "pixiv" && oneShot === true) {
        return `https://www.pixiv.net/novel/show.php?id=${sourceId}`
    }
    if (source === "pixiv" && oneShot === false) {
        return `https://www.pixiv.net/novel/series/${sourceId}`
    }
}

function urlSearchNovel(name, page) {
    return `https://api.furrynovel.com/api/zh/novel?page=${page}&order_by=popular&keyword=${name}`
}
function urlSearchUser(name, page) {
    return `https://api.furrynovel.com/api/zh/novel?keyword=${name}&page=${page}`
}
function urlUserUrl(name) {
    return `https://furrynovel.com/zh/search?keyword=${name}`
}

function urlPxImgUrlLinpx(pxImgUrl) {
    if (!pxImgUrl.trim()) return ""
    let url = `https://pximg.linpx.ink/?url=${pxImgUrl}&w=800`
    let headers = {"Referer": "https://linpx.ink/"}
    return `${url}, ${JSON.stringify({headers: headers})}`
}

function urlIllustUrl(illustId) {
    return `https://www.pixiv.net/artworks/${illustId}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}

function urlIllustOriginal(illustId) {
    let targetUrl = `https://pixiv.shojo.cn/${illustId}`
    let headers = {
        "User-Agent": getWebViewUA(),
        "Referer": "https://pixiv.shojo.cn/",
    }
    try {
        let resHeaders = java.head(targetUrl, headers).headers()
        let originalUrl = resHeaders["Location"] || resHeaders["location"]
        // originalUrl = originalUrl.replace("proxy.pixiv.shojo.cn", "i.pximg.net")
        return originalUrl ? originalUrl : ""
    } catch (e) {
        // java.log("请求失败: " + e)
        return ""
    }
}



// JSLib date
function addZero(num) {
    return String(num).padStart(2, '0')
}
function dateFormat(str) {
    let time = new Date(str);
    let Y = time.getFullYear() + "年";
    let M = this.addZero(time.getMonth() + 1) + "月";
    let D = this.addZero(time.getDate()) + "日";
    return Y + M + D;
}
function timeFormat(str) {
    let time = new Date(str);
    let YY = time.getFullYear()
    let MM = addZero(time.getMonth() + 1)
    let DD = addZero(time.getDate())
    let hh = addZero(time.getHours())
    let mm = addZero(time.getMinutes())
    let ss = addZero(time.getSeconds())
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)}`
}

function sleep(seconds) {
    return Packages.java.lang.Thread.sleep(1000*seconds)
}
function sleepToast(text, seconds) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (seconds === undefined) {seconds = 0.01}
    sleep(seconds)
}

function updateSource() {
    return updateSourceLink()
}

function updateSourceLink(){
    if (isJSBookSource) {
        try {
            java.openUrl(`legado://import/bookSource?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/src/bookSourceJS/${bookSourceName}.js`)
        } catch (e) {
            java.openUrl(`legado://import/bookSource?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/src/bookSourceJS/${bookSourceName}.js`)
        }
    } else {
        try {
            java.openUrl(`legado://import/bookSource?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json`)
        } catch (e) {
            java.openUrl(`legado://import/bookSource?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/linpx.json`)
        }
    }
}
