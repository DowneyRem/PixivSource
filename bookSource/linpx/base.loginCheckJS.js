var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

// 检测 源阅
// 可用 java.ajax() 不可用 java.webview() java.ajaxAll()
// 可用 java.getCookie() cache.put() cache.get() 默认值为 undefined
// 可用 java.startBrowser() 不可用 java.startBrowserAwaitAwait
// 可用 source.bookSourceName source.getVariable() source.setVariable()等
// java.getUserAgent() java.getWebViewUA() 目前返回内容相同
function isSourceRead() {
    return java.getUserAgent() === java.getWebViewUA()
}
// 正式版 不支持在 JSlib 的函数直接设置默认参数
// 正式版 不支持 a?.b 的写法
// 检测 阅读 正式版 与 Beta 版本
function isLegadoOfficial() {
    let isLegadoOfficialStatus
    try {
        eval('({})?.value')
        isLegadoOfficialStatus = false
    } catch (e) {
        isLegadoOfficialStatus = true
    }
    return isLegadoOfficialStatus
}
// 检测 阅读 Beta 版本 与 LYC 版本
// LYC 版本新增函数
// java.ajaxTestAll()
// java.openVideoPlayer(url: String, title: String, float: Boolean)
// cookie.setWebCookie(url,cookie)
// source.refreshExplore()
// source.refreshJSLib()
function isLegadoLYC() {
    return typeof java.ajaxTestAll === "function"
}

function publicFunc() {
    let u = {}, settings 
    // 输出书源信息
    java.log(`${source.bookSourceComment.split("\n")[0]}`)
    java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
    java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)

    if (isSourceRead()) {
        java.log("📱 软件平台：🍎 源阅 SourceRead")
    } else if (isLegadoOfficial()) {
        java.log("📱 软件平台：🤖 阅读 正式版")
        sleepToast("\n⚠️当前软件为：阅读【正式版】\n【正式版】已年久失修，不推荐继续使用\n\n为了更好的使用体验，请用：\n【阅读 Plus】或【阅读 Beta 新包名】\n\n即将为您打开【阅读 Plus】下载界面")
        sleep(3); startBrowser("https://gitee.com/lyc486/legado/releases/download/3.26.030717/legado_%E6%AD%A3%E5%BC%8F%E7%89%88_3.26.03071721_releaseS.apk", "下载阅读 Plus")

    } else {
        if (isLegadoLYC()) {
            java.log("📱 软件平台：🤖 阅读 Beta【新包名】/ 阅读 Plus")
        } else {
            java.log("📱 软件平台：🤖 阅读 Beta【原包名】")
            sleepToast("\n⚠️当前软件为：阅读 Beta【原包名】\n\n为了更好的使用体验，请用：\n【阅读 Plus】或【阅读 Beta 新包名】\n\n即将为您打开【阅读 Plus】下载界面")
            sleep(3); startBrowser("https://gitee.com/lyc486/legado/releases/download/3.26.030717/legado_%E6%AD%A3%E5%BC%8F%E7%89%88_3.26.03071721_releaseS.apk", "下载阅读 Plus")
        }
    }

    // 设置初始化
    // cache.delete("linpxSettings")
    settings = getFromCacheObject("linpxSettings")
    if (settings) {
        java.log("⚙️ 使用自定义设置")
    } else {
        java.log("⚙️ 使用默认设置")
        settings = setDefaultSettings()
    }
    u.settings = settings
    putInCacheObject("linpxSettings", settings)  // 设置写入缓存

    u.environment = {}
    u.environment.IS_SOURCEREAD = isSourceRead()
    u.environment.IS_LEGADO = !isSourceRead()
    u.environment.IS_LYC_BRUNCH = isLegadoLYC()
    putInCacheObject("pixivEnvironment", u.environment)  // 设置写入缓存

    u.debugFunc = (func) => {
        if (util.settings.DEBUG) {
            func()
        }
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function(novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书，需要判断是否为 null
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            //集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }

    // 处理 novels 列表
    u.handNovels = function (novels) {
        novels.forEach(novel => {
            if (!novel.id) novel.id = novel._id
            // novel.title = novel.title
            // novel.userName = novel.userName
            // novel.tags = novel.tags
            if (novel.tags === undefined) {
                novel.tags = []
            }
            // 兼容详情页
            if (novel.content) {
                if (novel.series) {
                    novel.seriesId = novel.series.id
                    novel.seriesTitle = novel.series.title
                }
                novel.description = novel.desc
                novel.textCount = novel.length = novel.content.length
            }

            if (!novel.seriesId) {
                novel.tags.unshift("单本")
                novel.textCount = novel.length
                novel.latestChapter = novel.title
                novel.description = novel.desc
                // novel.coverUrl = novel.coverUrl
                novel.detailedUrl = urlNovelDetailed(novel.id)
            }

            // 优化 未缓存系列目录的情况
            let series = getAjaxJson(urlSeriesDetailed(novel.seriesId))   // 兼容详情
            if (novel.seriesId) {
                novel.latestChapter = novel.title
                novel.title = novel.seriesTitle
                novel.tags.unshift("长篇")
                // novel.createDate = novel.createDate
                novel.description = novel.desc
                novel.detailedUrl = urlNovelDetailed(novel.id)
            }

            if (novel.seriesId && !series.error) {
                java.log(`正在获取系列小说：${novel.seriesId}`)
                novel.id = series.novels[0].id
                // novel.title = series.title
                if (series.tags) {
                    novel.tags = novel.tags.concat(series.tags)
                }
                novel.latestChapter = series.novels.reverse()[0].title
                novel.description = series.caption
                // 后端目前没有系列的 coverUrl 字段
                // novel.coverUrl = series.coverUrl
                novel.coverUrl = series.novels[0].coverUrl

                let firstNovel = getAjaxJson(urlNovelDetailed(novel.id))
                if (firstNovel.error !== true) {
                    novel.tags = novel.tags.concat(firstNovel.tags)
                    novel.createDate = firstNovel.createDate
                    if (novel.description === "") {
                        novel.description = firstNovel.desc
                    }
                }
            }
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.trim()
            if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.createDate = dateFormat(novel.createDate)

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
            novel.tags = novel.tags.join(",")

            if (util.settings.MORE_INFORMATION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
            }
        })
        return novels
    }

    // 从网址获取id，返回单篇小说 res
    u.getNovelRes = function (novel) {
        let novelId = 0, res = []
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)
        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(api\\.|www\\.)?(furrynovel\\.(ink|xyz))/pixiv/user/\\d+(/cache)?"
            let isAuthor = baseUrl.match(new RegExp(pattern))
            if (isAuthor) {
                java.log(`作者ID：${id}`)
                novelId = getAjaxJson(urlUserDetailed(id)).novels.reverse()[0]
                java.log(`最新一篇小说ID：${novelId}`)
            }

            pattern = "(https?://)?(api\\.|www\\.)?(furrynovel\\.(ink|xyz))/(pn|pixiv/novel)/\\d+(/cache)?"
            let isNovel = baseUrl.match(new RegExp(pattern))
            if (isNovel) {
                novelId = id
                java.log(`匹配小说ID：${id}`)
            }
            res = getAjaxJson(urlNovelDetailed(novelId))
        }

        if (isJson) {
            res = JSON.parse(result)
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
if (result.code() === 200) getWebViewUA()
java.getStrResponse(null, null)