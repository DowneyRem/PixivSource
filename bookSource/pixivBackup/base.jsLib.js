var cacheSaveSeconds = 30*24*60*60  // 长期缓存 30 天
var cacheTempSeconds = 10*60*1000   // 冷却时间 10 分钟

function cacheGetAndSet(key, supplyFunc, requestUpdate) {
    const {java, cache} = this
    let timestamp = 0
    let v = this.getFromCacheObject(key)
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
        this.putInCacheObject(key, v, cacheSaveSeconds)
    }
    return v
}

function putInCache(name, object, saveSeconds) {
    const {java, cache} = this
    if (saveSeconds === undefined) saveSeconds = 0
    if (object) {
        cache.put(name, object, saveSeconds)
    }
}
function getFromCache(name) {
    const {java, cache} = this
    let object = cache.get(name)
    if (object === undefined) return null  // 兼容源阅
    return object
}

function normalizeUrl(url) {
    if (!url.startsWith("https://210.140")) return url
    return url.replace("210.140.139.155", "www.pixiv.net")
        .replace("210.140.139.133", "i.pximg.net")
        .split(",")[0]
}
function putInCacheObject(objectName, object, saveSeconds) {
    const {java, cache} = this
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    // if (objectName === "pixivSettings") {
    //     this._settings = object
    // }
    cache.put(this.normalizeUrl(objectName), JSON.stringify(object), saveSeconds)
}
function getFromCacheObject(objectName) {
    const {java, cache} = this
    // if (objectName === "pixivSettings" && this._settings) {
    //     return this._settings
    // }
    let object = cache.get(this.normalizeUrl(objectName))
    if (object === undefined) return null  // 兼容源阅，避免 parse 报错
    return JSON.parse(object)
}

function putInCacheMap(mapName, mapObject, saveSeconds) {
    const {java, cache} = this
    if (saveSeconds === undefined) saveSeconds = 0
    let orderedArray = []
    mapObject.forEach((value, key) => {
        const item = {}
        item[key] = value
        orderedArray.push(item)
    })
    // [{'key1': 'value1'}, {'key2': 'value2'}]
    cache.put(mapName, JSON.stringify(orderedArray), saveSeconds)
}
function getFromCacheMap(mapName) {
    const {java, cache} = this
    let cached = cache.get(mapName)
    let newMap = new Map()
    if (cached === null || cached === undefined) {
        return newMap
    }

    let parsedData
    try {
        parsedData = JSON.parse(cached)
    } catch (e) {
        return newMap
    }

    if (Array.isArray(parsedData)) {
        parsedData.forEach(item => {
            for (let key in item) {
                newMap.set(key, item[key])
            }
        })
    } else {
        for (let key in parsedData) {
            newMap.set(key, parsedData[key])
        }
    }
    return newMap
}

function isHtmlString(str) {
    return str.startsWith("<!DOCTYPE html>")
}
function isJsonString(str) {
    try {
        let result = JSON.parse(str)
        return typeof result === "object" && result !== null
    } catch(e) {
        return false
    }
}

function isLogin() {
    const {java, cache} = this
    return !!this.getFromCache("pixivCsrfToken")
}

function getAjaxJson(url, requestUpdate) {
    const {java, cache} = this
    return this.cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    }, requestUpdate)
}
function getAjaxAllJson(urls, requestUpdate) {
    const {java, cache} = this
    let batchKey = JSON.stringify(urls)
    return this.cacheGetAndSet(batchKey, () => {
        let results = []
        let now = new Date().getTime()
        let responses = java.ajaxAll(urls)
        for (let i in urls) {
            let data = JSON.parse(responses[i].body())
            data = Object.assign({timestamp: now}, data)
            results.push(data)
            this.putInCacheObject(urls[i], data, cacheSaveSeconds)
        }
        return results
    }, requestUpdate)
}
function getAjaxParseJson(url, parseFunc, requestUpdate) {
    const {java, cache} = this
    return this.cacheGetAndSet(url, () => {
        let resp = parseFunc(java.ajax(url))
        if (resp instanceof Object) return resp
        else return JSON.parse(resp)
    }, requestUpdate)
}
function getWebviewJson(url, parseFunc, requestUpdate) {
    const {java, cache} = this
    return this.cacheGetAndSet(url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse(parseFunc(html))
    }, requestUpdate)
}

function getWebViewUA() {
    const {java, cache} = this
    let userAgent = this.getFromCache("userAgent")
    if (userAgent) return String(userAgent)

    userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    // java.log(`userAgent=${userAgent}`)
    this.putInCache("userAgent", userAgent, cacheSaveSeconds/7)
    return String(userAgent)
}
function startBrowser(url, title) {
    const {java, cache} = this
    if (!title) title = url
    let msg = ""
    let headers = {}
    headers["User-Agent"] = this.getWebViewUA()

    if (url.includes("https://www.pixiv.net")) {
        if (url.includes("settings")) msg += "⚙️ 账号设置"
        else msg += "⤴️ 分享小说"
        msg += "\n\n即将打开 Pixiv\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("github.com") || url.includes("github.io")) {
        if (url.includes("issues")) msg += "🐞 反馈问题"
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    this.sleepToast(msg, 0.01)
    java.startBrowser(`${url}, ${JSON.stringify({headers: headers})}`, title)
}

// 直连功能参考自 洛娅橙的阅读仓库
// https://github.com/Luoyacheng/yuedu
// 其直连功能参考自 PixEz Flutter
// https://github.com/Notsfsssf/pixez-flutter
function urlIP(url) {
    const {java, cache} = this
    let settings = this.getFromCacheObject("pixivSettings")
    if (!settings) settings = this.setDefaultSettings()
    if (settings.IPDirect) {
        url = url.replace("http://", "https://").replace("www.pixiv.net", "210.140.139.155")
        let headers = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 14)",
            "X-Requested-With": "XMLHttpRequest",
            "Host": "www.pixiv.net",
            "Referer": "https://www.pixiv.net/",
            "X-csrf-token": this.getFromCache("pixivCsrfToken") || "",
            "Cookie": this.getFromCache("pixivCookie") || ""
        }
        return `${url}, ${JSON.stringify({headers: headers})}`
    }
    return url
}

function urlNovelUrl(novelId) {
    return `https://www.pixiv.net/novel/show.php?id=${novelId}`
}
function urlNovelDetailed(novelId) {
    return `https://www.pixiv.net/ajax/novel/${novelId}`
}
function urlNovelsDetailed(userId, nidList) {
    return `https://www.pixiv.net/ajax/user/${userId}/novels?${nidList.map(v => `ids[]=${v}`).join("&")}`
}
function urlNovelBookmarkData(novelId) {
    return `https://www.pixiv.net/ajax/novel/${novelId}/bookmarkData`
}
function urlNovelComments(novelId, offset, limit) {
    return `https://www.pixiv.net/ajax/novels/comments/roots?novel_id=${novelId}&offset=${offset}&limit=${limit}&lang=zh`
}
function urlNovelCommentsReply(commentId, page) {
    return `https://www.pixiv.net/ajax/novels/comments/replies?comment_id=${commentId}&page=${page}&lang=zh`
}
function urlNovelsRecommendInit(novelId, limit) {
    if (limit === undefined) limit = 9
    return `https://www.pixiv.net/ajax/novel/${novelId}/recommend/init?limit=${limit}&lang=zh`
}
function urlNovelsRecommendDetailed(nidList) {
    if (nidList.length >= 9) nidList.length = 9
    return `https://www.pixiv.net/ajax/novel/recommend/novels?${nidList.map(v => `novelIds[]=${v}`).join("&")}`
}

function urlSeriesUrl(seriesId) {
    return `https://www.pixiv.net/novel/series/${seriesId}`
}
function urlSeriesDetailed(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
}
function urlSeriesNovelsTitles(seriesId) {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}/content_titles`
}
function urlSeriesNovels(seriesId, limit, offset) {
    if (limit > 30) limit = 30
    if (limit < 10) limit = 10
    return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`
}

function urlUserUrl(userID) {
    return `https://www.pixiv.net/users/${userID}/novels`
}
function urlUserDetailed(userID) {
    return `https://www.pixiv.net/ajax/user/${userID}`
}
function urlUserWorkLatest(userID) {
    return `https://www.pixiv.net/ajax/user/${userID}/works/latest`
}
function urlUserAllWorks(userId) {
    return `https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=zh`
}
function urlUserBookmarks(userId) {
    return `https://www.pixiv.net/ajax/user/${userId}/novels/bookmarks?tag=&offset={{(page-1)*30}}&limit=30&rest=show&lang=zh`
}

function urlSearchNovel(novelName, page) {
    return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
}
function urlSearchSeries(seriesName, page) {
    return`https://www.pixiv.net/ajax/search/novels/${encodeURI(seriesName)}?word=${encodeURI(seriesName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`
}
function urlSearchUser(userName, page, full) {
    let pageUrl = "", fullUrl = ""
    if (full) fullUrl = "_full"
    if (page && page >= 2) pageUrl = `&p=${page}`
    return `https://www.pixiv.net/search/users?nick=${userName}&s_mode=s_usr${fullUrl}&i=1${pageUrl}`;
}

// 直连功能参考自 洛娅橙的阅读仓库
// https://github.com/Luoyacheng/yuedu
// 其直连功能参考自 PixEz Flutter
// https://github.com/Notsfsssf/pixez-flutter
function urlCoverUrl(url) {
    const {java, cache} = this
    if (url && !url.trim()) return ""
    let headers = {"Referer": "https://www.pixiv.net/"}

    let settings = this.getFromCacheObject("pixivSettings")
    if (!settings) settings = this.setDefaultSettings()
    if (!settings.IPDirect) return url

    if (settings.IPDirect && url.trim()) {
        if (url.includes("i.pximg.net")) {
            url = url.replace("https://i.pximg.net", "https://210.140.139.133")
            headers.host = "i.pximg.net"
        } else {
            url = url.replace("https://s.pximg.net", "https://210.140.139.133")
            headers.host = "s.pximg.net"
        }
    }
    return `${url}, ${JSON.stringify({headers: headers})}`
}
function urlIllustUrl(illustId) {
    return `https://www.pixiv.net/artworks/${illustId}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}
function urlIllustOriginal(illustId, order) {
    const {java, cache} = this
    if (!order || order <= 1) order = 1
    let illustOriginal = ""

    let resp = this.getAjaxJson(this.urlIP(urlIllustDetailed(illustId)))
    try {
        illustOriginal = resp.body.urls.original
    } catch (e) {
        try {
            let illustThumb = resp.body.userIllusts[illustId].url
            let date = illustThumb.match("\\d{4}\\/\\d{2}\\/\\d{2}\\/\\d{2}\\/\\d{2}\\/\\d{2}")[0]
            illustOriginal = `https://i.pximg.net/img-master/img/${date}/${illustId}_p0_master1200.jpg`
        } catch (e) {}
    }

    if (illustOriginal.split(",")[0] === "") return ""
    return this.urlCoverUrl(illustOriginal.replace(`_p0`, `_p${order - 1}`))
}
function urlEmojiUrl(emojiId) {
    return `https://s.pximg.net/common/images/emoji/${emojiId}.png, {'style': 'text'}`
}
function urlStampUrl(stampId) {
    return `https://s.pximg.net/common/images/stamp/generated-stamps/${stampId}_s.jpg, {'style': 'text'}`
}

function urlMessageThreadLatest(max) {
    if (max === undefined || max <= 5) max = 5
    return `https://www.pixiv.net/rpc/index.php?mode=latest_message_threads2&num=${max}&lang=zh`
}
function urlMessageThreadContents(threadId, max) {
    return `https://www.pixiv.net/rpc/index.php?mode=message_thread_contents&thread_id=${threadId}&num=${max}`
}
function urlMessageThreadDetail(threadId) {
    return `https://www.pixiv.net/rpc/index.php?mode=message_thread&thread_id=${threadId}`
}
function urlNotification() {
    return `https://www.pixiv.net/ajax/notification?lang=zh`
}

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
    let MM = this.addZero(time.getMonth() + 1)
    let DD = this.addZero(time.getDate())
    let hh = this.addZero(time.getHours())
    let mm = this.addZero(time.getMinutes())
    let ss = this.addZero(time.getSeconds())
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}

function sleep(seconds) {
    return Packages.java.lang.Thread.sleep(1000*seconds)
}
function sleepToast(text, seconds) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (seconds === undefined) {seconds = 0.01}
    this.sleep(seconds)
}

function setDefaultSettings() {
    const {java, cache} = this
    let settings = {}
    settings.SEARCH_AUTHOR = false      // 搜索：默认不搜索作者名称
    settings.CONVERT_CHINESE = true     // 搜索：搜索时进行繁简转换
    settings.HIDE_LIKE_NOVELS = false   // 搜索：搜索结果 隐藏收藏小说
    settings.HIDE_WATCHED_SERIES = false// 搜索：搜索结果 隐藏追整系列

    settings.MORE_INFORMATION = false   // 详情：书籍简介显示更多信息
    settings.SHOW_UPDATE_TIME = true    // 目录：显示更新时间，但会增加少许请求
    settings.SHOW_ORIGINAL_LINK = true  // 目录：显示原始链接，但会增加大量请求

    settings.REPLACE_TITLE_MARKS = true // 正文：注音内容为汉字时，替换为书名号
    settings.SHOW_CAPTIONS = true       // 正文：章首显示描述
    settings.SHOW_COMMENTS = true       // 正文：章尾显示评论，但会增加大量请求

    settings.IPDirect = false           // 全局：直连模式
    settings.FAST  = false              // 全局：快速模式
    settings.DEBUG = false              // 全局：调试模式

    settings.SHOW_GENERAL = true        // 发现：显示 常规小说
    settings.SHOW_NEW_ADULT = true      // 发现：显示 最新企划约稿 R18
    settings.SHOW_NEW_GENERAL = false   // 发现：显示 最新企划约稿 常规
    settings.SHOW_RANK_ADULT = true     // 发现：显示 排行榜单 R18
    settings.SHOW_RANK_GENERAL = false  // 发现：显示 排行榜单 常规
    settings.SHOW_GENRE_ADULT = false   // 发现：显示 原创热门 R18
    settings.SHOW_GENRE_GENERAL = false // 发现：显示 原创热门 常规
    settings.SHOW_FURRY = false         // 发现：显示 兽人小说推荐作者

    settings.SHOW_SETTINGS = true       // 设置：显示 书源设置
    settings.SHOW_DISCOVER = true       // 设置：显示 发现设置
    settings.SHOW_SETTINGS2 = false     // 设置：显示 书源设置
    settings.SHOW_DISCOVER2 = false     // 设置：显示 发现设置
    this.putInCacheObject("pixivSettings", settings)
    return settings
}
function checkSettings(settings) {
    const {java, cache} = this
    if (!settings) settings = this.getFromCacheObject("pixivSettings")
    if (!settings) settings = this.setDefaultSettings()
    if (settings.FAST || settings.IPDirect) {
        settings.SEARCH_AUTHOR = false        // 搜索：默认不搜索作者名称
        settings.SHOW_ORIGINAL_LINK = false   // 目录：显示章节源链接
    }
    if (!settings.FAST && !settings.IPDirect) {
        // settings.SEARCH_AUTHOR = true         // 搜索：默认不搜索作者名称
        settings.SHOW_ORIGINAL_LINK = true    // 目录：显示章节源链接
    }

    if (settings.FAST) {
        settings.SEARCH_AUTHOR = false        // 搜索：默认不搜索作者名称
        settings.CONVERT_CHINESE = false      // 搜索：繁简通搜
        settings.SHOW_UPDATE_TIME = false     // 目录：显示章节更新时间
        settings.SHOW_COMMENTS = false        // 正文：显示评论
    }
    this.putInCacheObject("pixivSettings", settings)
    return settings
}

function updateSource() {
    const {java, source} = this
    java.longToast("🆙 更新书源\n\nJsdelivr CDN 更新有延迟\nGithub 更新需代理")
    let onlineSource, comment, sourceName, sourceNameCapitalize, index = 0
    if (source.bookSourceUrl.includes("pixiv")) sourceName = "pixiv"
    else if (source.bookSourceUrl.includes("furrynovel")) sourceName = "linpx"
    sourceNameCapitalize = sourceName[0].toUpperCase() + sourceName.substring(1)

    if (source.bookSourceName.includes("备用")) index = 1
    else if (source.bookSourceName.includes("漫画")) index = 2
    if (source.bookSourceUrl.includes("furrynovel.com")) {
        sourceNameCapitalize = "FurryNovel"
        index = 1
    }

    try {
        let updateUrl = `https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/${sourceName}.json`
        onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
    } catch (e) {
        try {
            let updateUrl = `https://raw.githubusercontent.com/DowneyRem/PixivSource/main/${sourceName}.json`
            onlineSource = JSON.parse(java.get(updateUrl,{'User-Agent': 'Mozilla/5.0 (Linux; Android 14)','X-Requested-With': 'XMLHttpRequest'}).body())[index]
        } catch (e) {
            onlineSource = {lastUpdateTime: new Date().getTime(), bookSourceComment: source.bookSourceComment}
        }
    }
    comment = onlineSource.bookSourceComment.split("\n")
    // onlineSource = source
    // comment = source.bookSourceComment.split("\n")

    let htm = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 5vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 6vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 
        <a href="https://pixivsource.pages.dev/${sourceNameCapitalize}">🔰 使用指南</a>
        || <a href="https://pixivsource.pages.dev/Sponsor">❤️ 赞助开发</a>
        </th>
        <tr>
            <td>☁️ 远程版本：${onlineSource.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(onlineSource.lastUpdateTime)}</td>
        </tr>
        <tr>
            <td>📥 本地版本：${source.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(source.lastUpdateTime)}</td>
        </tr> 
        <tr><td colspan="2" style="text-align: left;">${comment.slice(3, 10).join("<br>")}</td></tr>
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length-3, comment.length).join("<br>")}</td></tr>
    </table>
    
    <table border="0" cellspacing="20">
        <th colspan="2"> 更新 ${source.bookSourceName} 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/${sourceName}.json">
            <button><span>更新书源<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/btsrk.json">
            <button><span>更新订阅<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/${sourceName}.json">
            <button><span>书源链接<br>(GitHub)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/btsrk.json">
            <button><span>订阅链接<br>(GitHub)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/${sourceName}.json">
            <button><span>备用书源链接<br>(Codeberg)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
            <button><span>备用订阅链接<br>(Codeberg)</span></button>
            </a></div></td>
        </tr>
    </table>
</body>
</html>`
    java.startBrowser(`data:text/html;charset=utf-8;base64, ${java.base64Encode(htm)}`, '更新书源')
    return []
}