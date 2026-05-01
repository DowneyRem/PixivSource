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
function isLegadoSigma() {
    return typeof java.ajaxTestAll === "function"
}

function publicFunc() {
    let u = {}, settings
    // 输出书源信息
    java.log(`${source.bookSourceComment.split("\n")[0]}`)
    java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
    java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)

    // 设置写入缓存
    u.settings = getFromCacheObject("pixivSettings")
    if (!u.settings) u.settings = setDefaultSettings()
    u.settings = checkSettings()
    putInCacheObject("pixivSettings", u.settings)

    // 环境写入缓存
    u.environment = {}
    u.environment.IS_SOURCEREAD = isSourceRead()
    u.environment.IS_LEGADO = !isSourceRead()
    u.environment.IS_LEGADO_SIGMA = isLegadoSigma()
    putInCacheObject("pixivEnvironment", u.environment)

    // 输出环境信息
    if (u.environment.IS_SOURCEREAD) {
        java.log("📱 软件平台：🍎 源阅 SourceRead")
    } else if (u.environment.IS_LEGADO_SIGMA) {
        java.log("📱 软件平台：🤖 阅读 Beta【新包名】/ 阅读 Plus")
    } else if (u.environment.IS_LEGADO_OFFICIAL) {
        java.log("📱 软件平台：🤖 阅读 正式版")
        // sleepToast("\n⚠️当前软件为：阅读【正式版】\n【正式版】已年久失修，不推荐继续使用\n\n为了更好的使用体验，请用：\n【阅读 Plus】或【阅读 Beta 新包名】\n\n即将为您打开【阅读 Plus】下载界面")
        // sleep(3);
        // startBrowser("https://gitee.com/lyc486/legado/releases/download/3.26.030717/legado_%E6%AD%A3%E5%BC%8F%E7%89%88_3.26.03071721_releaseS.apk", "下载阅读 Plus")
    } else {
        java.log("📱 软件平台：🤖 阅读 Beta【原包名】")
        // sleepToast("\n⚠️当前软件为：阅读 Beta【原包名】\n\n为了更好的使用体验，请用：\n【阅读 Plus】或【阅读 Beta 新包名】\n\n即将为您打开【阅读 Plus】下载界面")
        // sleep(3);
        // startBrowser("https://gitee.com/lyc486/legado/releases/download/3.26.030717/legado_%E6%AD%A3%E5%BC%8F%E7%89%88_3.26.03071721_releaseS.apk", "下载阅读 Plus")
    }
    if (u.settings.IPDirect) {
        java.log("✈️ 直连模式：✅ 已开启")
    } else {
        java.log("✈️ 直连模式：❌ 已关闭")
    }

    u.debugFunc = (func) => {
        if (util.settings.DEBUG === true) {
            func()
        }
    }

    u.checkStatus = function(status) {
        if (status === true) return "✅ 已"
        else if (status === false) return "❌ 未"
        else if (status === undefined) return "🈚️ 无数据："
    }

    u.login = function() {
        let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": "${java.getWebViewUA()}"}}`, '登录账号', false)
        if (resp.code() === 200) {
            this.getCsrfToken(); this.getCookie()
        } else {
            java.log(resp.code()); sleepToast("⚠️ 登录失败")
        }
    }

    u.logout = function() {
        this.removeCookie()
        java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
        this.removeCookie()
        sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
    }

    u.getCookie = function() {
        let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
        if (isLogin()) putInCache("pixivCookie", pixivCookie, 60*60)  // 缓存1h
    }

    u.removeCookie = function() {
        cookie.removeCookie('https://www.pixiv.net')
        cookie.removeCookie('https://accounts.pixiv.net')
        cookie.removeCookie('https://accounts.google.com')
        cookie.removeCookie('https://api.weibo.com')
        cache.delete("pixivCookie")
        cache.delete("pixiv:uid")
        cache.delete("pixivCsrfToken")  // 与登录设备有关
        cache.delete("headers")
    }

    // 获取 Csrf Token，以便进行收藏等请求
    // 获取方法来自脚本 Pixiv Previewer
    // https://github.com/Ocrosoft/PixivPreviewer
    // https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
    u.getCsrfToken = function() {
        let pixivCsrfToken = getFromCache("pixivCsrfToken")
        if (!pixivCsrfToken) {
            let html = java.ajax("https://www.pixiv.net/")
            try {
                pixivCsrfToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
                putInCache("pixivCsrfToken", pixivCsrfToken)  // 与登录设备有关，无法存储 nul
            } catch (e) {
                pixivCsrfToken = null
                cache.delete("pixivCsrfToken")  // 与登录设备有关，无法存储 nul
                // sleepToast("⚠️ 未登录账号(pixivCsrfToken)")
            }
            java.log(`pixivCsrfToken:\n${pixivCsrfToken}`)
        }
        return pixivCsrfToken
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function(novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书
            if (!novel.seriesId) {
                return true
            }
            // 集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }

    // 屏蔽作者
    u.authorFilter = function(novels) {
        let blockAuthorList = getFromCacheObject("blockAuthorList")
        if (Array.isArray(blockAuthorList)) {
            java.log(`🚫 屏蔽作者ID：${JSON.stringify(blockAuthorList)}`)
            let blockAuthorSet = new Set(blockAuthorList.map(id => String(id)))
            novels = novels.filter(novel => !blockAuthorSet.has(String(novel.userId)))
        }
        return novels
    }


    // 过滤收藏与追更
    u.novelFilter = function(novels) {
        let novels1 = [], novels2 = [], msg
        let likeNovels = getFromCacheObject("likeNovels")
        let watchedSeries = getFromCacheObject("watchedSeries")
        let novels0 = novels.map(novel => novel.id)

        java.log(`${util.checkStatus(!util.settings.HIDE_LIKE_NOVELS)}显示收藏小说`)
        if (util.settings.HIDE_LIKE_NOVELS) {
            novels = novels.filter(novel => !likeNovels.includes(Number(novel.id)))
            novels1 = novels.map(novel => novel.id)
            java.log(`⏬ 过滤收藏：过滤前${novels0.length}；过滤后${novels1.length}`)
        }

        java.log(`${util.checkStatus(!util.settings.HIDE_WATCHED_SERIES)}显示追更系列`)
        if (util.settings.HIDE_WATCHED_SERIES) {
            novels = novels.filter(novel => !watchedSeries.includes(Number(novel.seriesId)))
            novels2 = novels.map(novel => novel.id)
            if (novels1.length >= 1) novels0 = novels1
            java.log(`⏬ 过滤追更：过滤前${novels0.length}；过滤后${novels2.length}`)
        }

        let novels3 = novels.map(novel => novel.id)
        if (novels0.length >= 1 && novels3.length === 0) {
            let msg = `⏬ 过滤小说\n⚠️ 过滤后无结果\n\n请根据需要\n`
            if (util.settings.HIDE_LIKE_NOVELS) msg += "开启显示收藏小说\n"
            if (util.settings.HIDE_WATCHED_SERIES) msg += "开启显示追更系列"
            sleepToast(msg, 1)
        }

        util.debugFunc(() => {
            // java.log(JSON.stringify(novels0))
            java.log(JSON.stringify(novels0.length))
            // java.log(JSON.stringify(novels1))
            java.log(JSON.stringify(novels1.length))
            // java.log(JSON.stringify(novels2))
            java.log(JSON.stringify(novels2.length))
        })
        return novels
    }

    // 过滤描述与标签（屏蔽标签/屏蔽描述）
    u.novelFilter2 = function(novels) {
        const length = novels.length
        let novels0 = novels.map(novel => novel.id)
        let captionBlockWords = getFromCacheObject("captionBlockWords")
        if (!captionBlockWords) captionBlockWords = []
        else {
            // 仅保留没有任何屏蔽词的小说
            // novels = novels.filter(novel => {
            //     return !captionBlockWords.some(item => {
            //         if (novel.description !== undefined) return novel.description.includes(item)
            //     })
            // })
            novels = novels.filter(novel => !captionBlockWords.some(item => novel.description.includes(item)))
            let novels2 = novels.map(novel => novel.id)
            java.log(`🚫 屏蔽描述：${captionBlockWords.join("\n")}`)
            java.log(`🚫 屏蔽描述：过滤前${novels0.length}；过滤后${novels2.length}`)
        }

        let tagsBlockWords = getFromCacheObject("tagsBlockWords")
        if (!tagsBlockWords) tagsBlockWords = []
        else {
            // 仅保留没有任何屏蔽词的小说
            // novels = novels.filter(novel => {
            //     return !tagsBlockWords.some(item => {
            //         if (novel.tags !== undefined) return novel.tags.includes(item)
            //     })
            // })
            novels = novels.filter(novel => !tagsBlockWords.some(item => novel.tagsList.includes(item)))
            let novels2 = novels.map(novel => novel.id)
            java.log(`🚫 屏蔽标签：${tagsBlockWords.join("、")}`)
            java.log(`🚫 屏蔽标签：过滤前${novels0.length}；过滤后${novels2.length}`)
        }
        return novels
    }

    // 收藏小说/追更系列 写入缓存
    u.saveNovels = function(listInCacheName, list) {
        let listInCache = getFromCacheObject(listInCacheName)
        if (!listInCache) listInCache = []

        listInCache = listInCache.concat(list)
        listInCache = Array.from(new Set(listInCache))
        putInCacheObject(listInCacheName, listInCache)

        if (listInCacheName === "likeNovels") listInCacheName = "❤️ 收藏小说ID"
        else if (listInCacheName === "watchedSeries") listInCacheName = "📃 追更系列ID"
        util.debugFunc(() => {
            java.log(`${listInCacheName}：${JSON.stringify(listInCache)}`)
        })
    }

    u.saveAuthors = function(authors) {
        let pixivAuthors = getFromCacheObject("pixivAuthors")
        if (!pixivAuthors) pixivAuthors = {}

        pixivAuthors = Object.assign(pixivAuthors, authors)
        putInCacheObject("pixivAuthors", pixivAuthors)
    }

    // 处理 novels 列表
    u.handNovels = function(novels, isDetail) {
        if (!isDetail) isDetail = false
        let likeNovels = [], watchedSeries = [], authors = {}
        novels = util.authorFilter(novels)
        novels.forEach(novel => {
            // novel.id = novel.id
            // novel.title = novel.title
            // novel.userName = novel.userName
            // novel.userId = novel.userId
            // novel.tags = novel.tags
            authors[novel.userName] = novel.userId  // 加入缓存，便于搜索作者
            if (novel.tags === undefined || novel.tags === null) {
                novel.tags = []
            }
            // 搜索单篇
            if (novel.isOneshot === undefined) {
                // novel.seriesId = novel.seriesId
                // novel.seriesTitle = novel.seriesTitle
                // novel.textCount = novel.textCount
                // novel.description = novel.description
                novel.coverUrl = novel.url
                // novel.createDate = novel.createDate
                // novel.updateDate = novel.updateDate
            }

            // 搜索系列
            if (novel.isOneshot !== undefined) {
                if (novel.isOneshot === true) {
                    novel.seriesId = undefined
                    novel.id = novel.novelId  // 获取真正的 novelId
                    novel.seriesTitle = undefined
                } else {
                    novel.seriesId = novel.id
                    novel.id = novel.novelId = novel.latestEpisodeId  // 获取真正的 novelId
                    novel.seriesTitle = novel.title
                    // novel.isWatched = novel.isWatched  // 搜索系列可获取
                }
                novel.textCount = novel.textLength
                novel.description = novel.caption
                novel.coverUrl = novel.cover.urls["480mw"]
                novel.createDate = novel.createDateTime
                novel.updateDate = novel.updateDateTime
            }

            // 单篇正文详情页
            if (novel.content) {
                novel.novelId = novel.id
                novel.tags = novel.tags.tags.map(item => item.tag)
                novel.textCount = novel.userNovels[`${novel.id}`].textCount
                // novel.latestChapter = novel.title
                // novel.description = novel.description
                novel.coverUrl = novel.userNovels[`${novel.id}`].url
                // novel.createDate = novel.createDate
                novel.updateDate = novel.uploadDate

                if (novel.seriesNavData) {
                    novel.seriesId = novel.seriesNavData.seriesId
                    novel.seriesTitle = novel.seriesNavData.title
                }
            }

            // 系列详情
            if (novel.firstNovelId) {
                novel.seriesId = novel.id
                novel.id = novel.novelId = novel.firstNovelId
                novel.seriesTitle = novel.title
                novel.coverUrl = novel.cover.urls["480mw"]
                // novel.isWatched = novel.isWatched  // 搜索系列可获取
            }

            // 发现：排行榜
            if (novel.rank) {
                // novel.id = novel.id
                // novel.title = novel.title
                novel.userName = novel.user_name
                novel.userId = novel.user_id
                novel.tags = novel.tag_a
                // novel.language = novel.language
                novel.seriesId = novel.series_id
                novel.seriesTitle = novel.series_title || ""
                novel.textCount = novel.character_count
                novel.description = novel.comment
                novel.coverUrl = novel.url
                let date = novel.create_date.split(" ")
                novel.createDate = novel.updateDate = `${date[0]}T${date[1]}:00+09:00`
                novel.isBookmark = novel.is_bookmarked
            }

            // 单篇加更多信息
            if (!novel.seriesId) {
                novel.tags.unshift("单本")
                novel.latestChapter = novel.title
                novel.detailedUrl = urlIP(urlNovelDetailed(novel.id))
                novel.total = 1
                if (novel.bookmarkData) {
                    novel.isBookmark = true
                    putInCache(`collect${novel.id}`, novel.bookmarkData.id)
                    likeNovels.push(Number(novel.id))
                } else {
                    novel.isBookmark = false
                }
            }

            if (novel.seriesId && !isDetail) {
                novel.title = novel.seriesTitle
                novel.tags.unshift("长篇")
                novel.detailedUrl = urlIP(urlSeriesDetailed(novel.seriesId))
            }
            // 系列添加更多信息
            if (novel.seriesId && isDetail) {
                let series = getAjaxJson(urlIP(urlSeriesDetailed(novel.seriesId))).body
                novel.id = series.firstNovelId
                novel.title = series.title
                novel.tags = novel.tags.concat(series.tags)
                novel.tags.unshift("长篇")
                novel.textCount = series.publishedTotalCharacterCount
                novel.description = series.caption
                novel.coverUrl = series.cover.urls["480mw"]
                novel.detailedUrl = urlIP(urlSeriesDetailed(novel.seriesId))
                novel.createDate = series.createDate
                novel.updateDate = series.updateDate
                novel.total = series.publishedContentCount
                novel.isWatched = series.isWatched
                if (novel.isWatched === true) {
                    watchedSeries.push(Number(novel.seriesId))
                }

                // 防止系列首篇无权限获取
                // 发送请求获取第一章 获取标签与简介
                let firstNovel = {}
                try {
                    firstNovel = getAjaxJson(urlIP(urlSeriesNovels(novel.seriesId, 30, 0))).body.thumbnails.novel[0]
                    novel.id = novel.firstNovelId = firstNovel.id
                    novel.tags = novel.tags.concat(firstNovel.tags)
                } catch (e) { // 防止系列首篇无权限获取
                    firstNovel = {}
                    firstNovel.description = ""
                }
                if (novel.description === "") {
                    novel.description = firstNovel.description
                }
            }
        })
        // 收藏小说/追更系列 写入缓存
        util.saveNovels("likeNovels", likeNovels)
        util.saveNovels("watchedSeries", watchedSeries)
        util.saveAuthors(authors)
        util.debugFunc(() => {
            java.log(`处理小说完成`)
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function(novels) {
        novels = util.novelFilter(novels)
        novels.forEach(novel => {
            novel.title = novel.title.trim()
            if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
            novel.coverUrl = urlCoverUrl(novel.coverUrl)
            novel.readingTime = `${novel.readingTime / 60} 分钟`
            novel.createDate = dateFormat(novel.createDate)
            novel.updateDate = dateFormat(novel.updateDate)

            novel.tagsList = []
            for (let i in novel.tags) {
                let tag = novel.tags[i]
                if (tag.includes("/")) {
                    let tags = tag.split("/")
                    novel.tagsList = novel.tagsList.concat(tags)
                } else {
                    novel.tagsList.push(tag)
                }
            }
            novel.tags = Array.from(new Set(novel.tagsList))
            novel.tags = novel.tags.join(",")
            let collectMsg
            if (novel.seriesId) {
                collectMsg = `📃 追更：${util.checkStatus(novel.isWatched)}追更系列`
            } else {
                collectMsg = `❤️ 收藏：${util.checkStatus(novel.isBookmark)}加入收藏`
            }

            if (util.settings.MORE_INFORMATION) {
                novel.description = `\n登录：${util.checkStatus(isLogin())}登录账号
                ${collectMsg}\n书名：${novel.title}\n作者：${novel.userName}
                标签：${novel.tags}\n上传：${novel.createDate}
                更新：${novel.updateDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n登录：${util.checkStatus(isLogin())}登录账号
                ${collectMsg}\n上传：${novel.createDate}\n更新：${novel.updateDate}
                简介：${novel.description}`
            }
        })
        novels = util.novelFilter2(novels)
        return novels
    }

    // 正文，详情，搜索：从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    // pixiv 默认分享信息中有#号，不会被识别成链接，无法使用添加网址
    u.getNovelResFirst = function(result) {
        let novelId = 0, res = {"body": {}}
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)

        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/users?/\\d+"
            let isAuthor = baseUrl.match(new RegExp(pattern))
            if (isAuthor) {
                java.log(`作者ID：${id}`)
                novelId = Object.keys(getAjaxJson(urlIP(urlUserWorkLatest(id))).body.novels).reverse()[0]
            }

            pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/series/\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                java.log(`系列ID：${id}`)
                novelId = getAjaxJson(urlIP(urlSeriesNovels(id, 30, 0))).body.thumbnails.novel[0].id
            } else {
                let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    novelId = id
                }
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = getAjaxJson(urlIP(urlNovelDetailed(novelId)))
        }
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.body
    }

    // 目录：从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function(result) {
        let seriesId = 0, res = {"body": {}}
        let isJson = isJsonString(result)
        let isHtml = isHtmlString(result)

        if (!isJson && isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/series/\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                seriesId = id
            } else {
                let pattern = "(https?://)?(www\\.)?pixiv\\.net/novel/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    java.log(`匹配小说ID：${id}`)
                    res = getAjaxJson(urlIP(urlNovelDetailed(id)))
                }
            }
        }
        if (isJson) {
            res = JSON.parse(result)
        }

        if (res.body && res.body.seriesNavData) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = getAjaxJson(urlIP(urlSeriesDetailed(seriesId)))
        }
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.body
    }

    util = u
    java.put("util", objStringify(u))
}

function checkMessageThread(checkTimes) {
    if (checkTimes === undefined) {
        checkTimes = Number(getFromCache("checkTimes"))
    }
    if (checkTimes === 0 && isLogin()) {
        let latestMsg = getAjaxJson(urlIP(urlMessageThreadLatest(5)))
        if (latestMsg.error === true) {
            java.log(JSON.stringify(latestMsg))
        } else if (latestMsg.body.total >= 1) {
            let msg = latestMsg.body.message_threads.filter(item => item.thread_name === "pixiv事務局")[0]
            if (msg && new Date().getTime()- 1000*msg.modified_at <= 3*24*60*60*1000) { // 3天内进行提示
                sleepToast(`您于 ${timeFormat(1000*msg.modified_at)} 触发 Pixiv 【过度访问】，请修改密码并重新登录。\n如已修改请忽略`, 3)
                sleepToast(`${msg.latest_content}`, 5)
                java.startBrowser("https://accounts.pixiv.net/password/change",'修改密码')
            }
        }
    }
    putInCache("checkTimes", checkTimes + 1, 4*60*60)  // 缓存4h，每4h提醒一次
    // putInCache("checkTimes", checkTimes + 1, 60)  // 测试用，缓存60s，每分钟提醒一次
    // java.log(checkTimes + 1)
}

// 获取请求的user id方便其他ajax请求构造
function getPixivUid() {
    // cache.delete("pixiv:uid")
    let uid = getFromCache("pixiv:uid")
    if (!uid && isLogin()) {
        let html = java.ajax("https://www.pixiv.net/")
        uid = html.match(/user_id:'(\d+)'/)[1]
        putInCache("pixiv:uid", uid)
    }
    return uid
}

function getHeaders() {
    let headers = {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "zh-CN",
        // "content-type": "application/json; charset=utf-8",
        // "content-type": "application/x-www-form-urlencoded; charset=utf-8",
        "origin": "https://www.pixiv.net",
        "Referer": "https://www.pixiv.net/",
        // "sec-ch-ua": `"Not/A)Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"`,
        // "sec-ch-ua-mobile": "?0",
        // "sec-ch-ua-platform": "Windows",
        // "sec-fetch-dest": "empty",
        // "sec-fetch-mode": "cors",
        // "sec-fetch-site": "same-origin",
        "user-agent": getFromCache("userAgent") || "",
        "x-csrf-token": getFromCache("pixivCsrfToken") || "",
        "Cookie": getFromCache("pixivCookie") || ""
    }
    putInCacheObject("headers", headers)
    return headers
}

publicFunc()
if (!isLogin() && !util.settings.DEBUG) {
    sleepToast("🔍 搜索小说\n\n⚠️ 当前未登录账号\n请登录 Pixiv 账号", 1.5)
    util.removeCookie(); util.login()
    sleepToast("🔍 搜索小说\n\n登录成功后，请重新搜索/进入发现", 2)
}
if (result.code() === 200) {
    getPixivUid(); getWebViewUA(); util.getCookie(); util.getCsrfToken(); getHeaders()
    if (!util.settings.FAST) checkMessageThread()   // 检测过度访问
}
java.getStrResponse(null, null)