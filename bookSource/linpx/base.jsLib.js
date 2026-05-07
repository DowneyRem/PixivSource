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

function putInCacheObject(objectName, object, saveSeconds) {
    const {java, cache} = this
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(objectName, JSON.stringify(object), saveSeconds)
}
function getFromCacheObject(objectName) {
    const {java, cache} = this
    let object = cache.get(objectName)
    if (object === undefined) return null  // 兼容源阅
    return JSON.parse(object)
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
// function getWebviewJson(url, parseFunc, requestUpdate) {
//     const {java, cache} = this
//     return this.cacheGetAndSet(url, () => {
//         let html = java.webView(null, url, null)
//         return JSON.parse(parseFunc(html))
//     }, requestUpdate)
// }
function getWebviewJson(url) {
    const {java, cache} = this
    return this.cacheGetAndSet(url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse((html.match(new RegExp(">\\[{.*?}]<"))[0].replace(">", "").replace("<", "")))
    })
}

function getWebViewUA() {
    const {java, cache} = this
    let userAgent = this.getFromCache("userAgent")
    if (userAgent) return String(userAgent)

    userAgent = String(java.getWebViewUA())
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
    }
    userAgent += " Reader"
    // java.log(`userAgent=${userAgent}`)
    this.putInCache("userAgent", userAgent, cacheSaveSeconds/7)
    return String(userAgent)
}
function startBrowser(url, title) {
    const {java} = this
    if (!title) title = url
    let msg = ""
    let headers = {}
    headers["User-Agent"] = this.getWebViewUA()
    headers["Referer"] = "https://furrynovel.ink/"

    if (url.includes("github.com") || url.includes("github.io")) {
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    this.sleepToast(msg, 0.01)
    java.startBrowser(`${url}, ${JSON.stringify({headers: headers})}`, title)
}

function urlNovelUrl(novelId) {
    return `https://furrynovel.ink/pixiv/novel/${novelId}/cache`
}
function urlNovelDetailed(novelId) {
    return `https://api.furrynovel.ink/pixiv/novel/${novelId}/cache`
}
function urlNovelsDetailed(nidList) {
    return `https://api.furrynovel.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
}

function urlSourceUrl(novelId) {
    return `https://www.pixiv.net/novel/show.php?id=${novelId}`
}

function urlSeriesUrl(seriesId) {
    return `https://www.pixiv.net/novel/series/${seriesId}`
}
function urlSeriesDetailed(seriesId) {
    return `https://api.furrynovel.ink/pixiv/series/${seriesId}/cache`
}

function urlUserUrl(userId) {
    return `https://furrynovel.ink/pixiv/user/${userId}/cache`
}
function urlUserDetailed(userId) {
    return `https://api.furrynovel.ink/pixiv/user/${userId}/cache`
}
function urlUsersDetailed(uidList) {
    return `https://api.furrynovel.ink/pixiv/users/cache?${uidList.map(v => "ids[]=" + v).join("&")}`
}
function urlUserFavorite() {
    return "https://api.furrynovel.ink/fav/user/cache"
}

function urlSearchNovel(novelName, page) {
    return `https://api.furrynovel.ink/pixiv/search/novel/${novelName}/cache?page=${page}`
}
function urlSearchUsers(userName) {
    return `https://api.furrynovel.ink/pixiv/search/user/${userName}/cache`
}

function urlCoverUrl(pxImgUrl) {
    let url = `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
    let headers = {"Referer": "https://furrynovel.ink/"}
    return `${url}, ${JSON.stringify({headers: headers})}`
}

function urlIllustUrl(illustId) {
    return `https://www.pixiv.net/artworks/${illustId}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}
// 直连功能参考自 洛娅橙的阅读仓库
// https://github.com/Luoyacheng/yuedu
// 其直连功能参考自 PixEz Flutter
// https://github.com/Notsfsssf/pixez-flutter
function urlIP(url) {
    const {java, cache} = this
    url = url.replace("http://", "https://").replace("www.pixiv.net", "210.140.139.155")
    let headers = {
        "User-Agent": this.getWebViewUA(),
        "X-Requested-With": "XMLHttpRequest",
        "Host": "www.pixiv.net",
        "Referer": "https://www.pixiv.net/"
    }
    return `${url}, ${JSON.stringify({headers: headers})}`
}
function urlPixivCoverUrl(url) {
    const {java, cache} = this
    if (url && !url.trim()) return ""
    let headers = {"Referer": "https://www.pixiv.net/"}

    if (url.trim()) {
        if (url.includes("i.pximg.net")) {
            url = url.replace("https://i.pximg.net", "https://210.140.139.133")
            headers.Host = "i.pximg.net"
        } else {
            url = url.replace("https://s.pximg.net", "https://210.140.139.133")
            headers.Host = "s.pximg.net"
        }
    }
    return `${url}, ${JSON.stringify({headers: headers})}`
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
    return this.urlPixivCoverUrl(illustOriginal.replace(`_p0`, `_p${order - 1}`))
}

// function urlIllustOriginal(illustId, order) {
//     // 使用 pixiv.cat 获取插图
//     let illustOriginal = `https://pixiv.re/${illustId}.png`
//     // let illustOriginal = `https://pixiv.nl/${illustId}.png`
//     if (order >= 1) {
//         illustOriginal = `https://pixiv.re/${illustId}-${order}.png`
//         // illustOriginal = `https://pixiv.nl/${illustId}-${order}.png`
//     }
//     return illustOriginal
// }

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
    settings.SEARCH_AUTHOR = false      // 搜索：默认搜索作者名称
    settings.CONVERT_CHINESE = true     // 搜索：搜索时进行繁简转换

    settings.MORE_INFORMATION = false   // 详情：书籍简介显示更多信息
    settings.SHOW_ORIGINAL_LINK = true  // 目录：显示原始链接，但会增加大量请求

    settings.REPLACE_TITLE_MARKS = true // 正文：注音内容为汉字时，替换为书名号
    settings.SHOW_CAPTIONS = true       // 正文：章首显示描述

    settings.DEBUG = false              // 全局：调试模式

    settings.PIC_SOURCE = "Pixiv"       // 正文：Pixiv 插图解析方式
    settings.PIC_LINK = "Linpx"         // 正文：图片链接打开方式

    this.putInCacheObject("linpxSettings", settings)
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
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length-2, comment.length).join("<br>")}</td></tr>
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