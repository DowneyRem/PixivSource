function login() {
    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": ${getWebViewUA()}}}`, '登录账号', false)
    if (resp.code() === 200) {
        getCsrfToken(); getCookie()
        return true
    } else {
        java.log(resp.code()); sleepToast("🅿️ 登录账号\n\n⚠️ 登录失败")
        return false
    }
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie(); removeLikeDataCache(); removeSettingsCache()
    sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
}

function removeCookie() {
    cookie.removeCookie('https://www.pixiv.net')
    cookie.removeCookie('https://accounts.pixiv.net')
    cookie.removeCookie('https://accounts.google.com')
    cookie.removeCookie('https://api.weibo.com')
    cache.delete("pixivCookie")
    cache.delete("pixiv:uid")
    cache.delete("pixivCsrfToken")  // 与登录设备有关
    cache.delete("headers")
}

function removeCacheList(listName) {
    let list = getFromCacheObject(listName)
    list.forEach(item => cache.delete(`collect${item}`))
    if (listName !== "blockAuthorList") cache.delete(listName)
}

function removeLikeDataCache() {
    // 删除 likeNovels 与 watchedSeries
    removeCacheList("likeNovels")
    removeCacheList("watchedSeries")
}

function removeSettingsCache() {
    // 删除 屏蔽作者名单
    // removeCacheList("blockAuthorList")
    // 删除  屏蔽关键词
    // cache.delete("tagsBlockWords")
    // cache.delete("captionBlockWords")
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (isLogin()) putInCache("pixivCookie", pixivCookie, 60*60)
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
function getCsrfToken() {
    let pixivCsrfToken = getFromCache("pixivCsrfToken")
    if (!pixivCsrfToken) {
        let html = java.webView(null, "https://www.pixiv.net/", null)
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

function getNovel() {
    let environment = getFromCacheObject("pixivEnvironment")
    if (environment.IS_LEGADO_SIGMA) {
        try {
            let novel = {}
            try {
                novel.id = chapter.url.match(/\d+/)[0]
            } catch(e){
                novel.id = chapter.url.match(/novel\/(\d+)/)[1]  // 直连模式
            }
            novel.title = chapter.title
            novel.userName = book.author.replace("@", "")
            if (book.bookUrl.includes("series")) {
                novel.seriesId = book.bookUrl.match(/\d+/)[0]
                novel.seriesTitle = book.name
            } else {
                novel.seriesId = 0
                novel.seriesTitle = ""
            }

            let resp = getAjaxJson(urlIP(urlNovelDetailed(novel.id))).body
            novel.userId = resp.userId
            if (resp.pollData) {
                novel.pollChoicesCount = resp.pollData.choices.length
            } else {
                novel.pollChoicesCount = 0
            }
            // java.log(JSON.stringify(novel))
            return novel
        } catch (e) {
            // 无法阻止后续函数在日志中报错
            return sleepToast("🔰 功能提示\n\n⚠️ 请在【小说正文】使用该功能")
        }
    } else {  // 兼容用
        let novel = source.getLoginInfoMap()
        if (!novel) novel = getFromCacheObject("novel")
        return novel
    }
}

function getPostBody(url, body, headers) {
    if (headers === undefined) headers = getFromCacheObject("headers")
    if (isJsonString(body)) {
        headers["content-type"] = "application/json; charset=utf-8"
    } else if (typeof body === "string") {
        headers["content-type"] = "application/x-www-form-urlencoded; charset=utf-8"
    }
    try {
        java.log(`getPostBody(${url}, ${body}, ${headers})`)
        // java.log(`getPostBody(${url}, ${body}, ${JSON.stringify(headers)})`)
        return JSON.parse(java.post(url, body, headers).body())
    } catch (e) {
        e = String(e)
        // sleepToast(e)
        // sleepToast(JSON.stringify(headers))
        if (e.includes("400")) sleepToast(`📤 getPostBody\n\n⚠️ 缺少 headers`, 1)
        else if (e.includes("403")) sleepToast(`📤 getPostBody\n\n⚠️ 缺少 cookie 或 cookie 过期`, 1)
        else if (e.includes("404")) sleepToast(`📤 getPostBody\n\n⚠️ 404 缺少 pixivCsrfToken `, 1)
        else if (e.includes("422")) sleepToast(`📤 getPostBody\n\n⚠️ 请求信息有误`, 1)
        return {error: true, errMsg:e}
    }
}

function novelBookmarkAdd() {
    let restrict = 0
    let novel = getNovel()
    let novelObj = getAjaxJson(urlNovelDetailed(novel.id), true)
    if (novelObj.body.bookmarkData && novelObj.body.bookmarkData.private === false) restrict = 1
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({"novel_id": novel.id, "restrict": restrict, "comment":"", "tags":[]})
    )
    if (resp.error === true) {
        sleepToast(`❤️ 收藏小说\n\n⚠️ 收藏【${novel.title}】失败`)
        shareFactory("novel")
    } else {
        putInCacheObject(`collect${novel.id}`, resp.body)
        let likeNovels = getFromCacheObject("likeNovels")
        likeNovels.push(Number(novel.id))
        putInCacheObject("likeNovels", likeNovels)

        let novelObj = getAjaxJson(urlNovelDetailed(novel.id))
        novelObj.body.isBookmark = true
        putInCacheObject(urlNovelDetailed(novel.id), novelObj, cacheSaveSeconds)
    }

    if (restrict === 1) {
        sleepToast(`㊙️ 私密收藏\n\n✅ 已私密收藏\n${novel.title}`)
    } else {
        sleepToast(`❤️ 公开收藏\n\n✅ 已公开收藏\n${novel.title}`)
    }
}

function getNovelBookmarkId(novelId) {
    let bookmarkId = getFromCacheObject(`collect${novelId}`)
    if (bookmarkId === null) {
        try {
            bookmarkId = getAjaxJson(urlNovelBookmarkData(novelId), true).body.bookmarkData.id
        } catch (e) {
            bookmarkId = 0
        }
    }
    return bookmarkId
}

function novelBookmarkDelete() {
    let novel = getNovel()
    let bookmarkId = getNovelBookmarkId(novel.id)
    if (bookmarkId === 0) return sleepToast(`🖤 取消收藏\n\n✅ 已经取消收藏\n${novel.title}`)

    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/delete",
        `del=1&book_id=${bookmarkId}`
    )
    if (resp.error === true) {
        sleepToast(`🖤 取消收藏\n\n⚠️ 取消收藏失败\n${novel.title}`)
        shareFactory("novel")
    } else {
        cache.delete(`collect${novel.id}`)
        sleepToast(`🖤 取消收藏\n\n✅ 已经取消收藏\n${novel.title}`)

        let likeNovels = getFromCacheObject("likeNovels")
        likeNovels = likeNovels.filter(item => item !== Number(novel.id))
        putInCacheObject("likeNovels", likeNovels)

        let novelObj = getAjaxJson(urlNovelDetailed(novel.id))
        novelObj.body.isBookmark = false
        putInCacheObject(urlNovelDetailed(novel.id), novelObj, cacheSaveSeconds)
    }
}

function novelsBookmarkDelete() {
    let novel = getNovel()
    if (!isLongClick) {
        if (!novel.seriesId) sleepToast(`🖤 取消收藏\n\n正在取消收藏【本章】`)
        else sleepToast(`🖤 取消收藏\n\n正在取消收藏【本章】\n长按可取消收藏【整个系列】`)
        return novelBookmarkDelete(0)
    }
    if (isLongClick && !novel.seriesId) {
        return (`🖤 取消收藏系列\n\n⚠️ 【${novel.title}】非系列小说`)
    }
    sleepToast(`🖤 取消收藏系列\n\n🔄 正在取消收藏系列，请稍后……`, 2)

    let bookmarkIds = []
    let novelIds = getFromCacheObject(`novelIds${novel.seriesId}`)
    novelIds.forEach(novelId => {
        let bookmarkId = getNovelBookmarkId(novelId)
        if (bookmarkId) bookmarkIds.push(getNovelBookmarkId(novelId))
    })
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({"bookmarkIds": bookmarkIds})
    )
    if (resp.error === true) {
        sleepToast(`🖤 取消收藏系列\n\n⚠️ 取消收藏【${novel.seriesTitle}】的篇目失败`, 2)
        shareFactory("series")
    } else {
        sleepToast(`🖤 取消收藏系列\n\n✅ 已取消收藏【${novel.seriesTitle}】的全部篇目`)
        novelIds.forEach(novelId => {cache.delete(`collect${novelId}`)})

        let likeNovels = getFromCacheObject("likeNovels")
        likeNovels = likeNovels.filter(item => !novelIds.includes(Number(item)))
        putInCacheObject("likeNovels", likeNovels)

        novelIds.forEach(novelId => {
            let novelObj = getAjaxJson(urlNovelDetailed(novelId))
            novelObj.body.isBookmark = false
            putInCacheObject(urlNovelDetailed(novelId), novelObj, cacheSaveSeconds)
        })
    }
}

function novelsBookmarkAdd() {
    let novel = getNovel()
    if (!novel.seriesId) {
        sleepToast(`❤️ 收藏系列\n\n⚠️ 【${novel.title}】非系列小说，现已收藏本篇小说`)
        return novelBookmarkAdd(0)
    } else {
        sleepToast(`❤️ 收藏系列\n\n🔄 正在收藏系列【${novel.seriesTitle}】，请稍后……`, 2)
    }

    let novelIds = getFromCacheObject(`novelIds${novel.seriesId}`)
    let likeNovels = getFromCacheObject("likeNovels")
    if (likeNovels === null) likeNovels = []
    novelIds.forEach(novelId => {
        if (likeNovels && !likeNovels.includes(Number(novelId))) {
            sleep(0.5 * 1000 * Math.random())
            let resp = getPostBody(
                "https://www.pixiv.net/ajax/novels/bookmarks/add",
                JSON.stringify({"novel_id": novelId, "restrict": 0, "comment": "", "tags": []})
            )

            if (resp.error === true) {
                sleepToast(`❤️ 收藏系列\n\n⚠️ 收藏【${novelId}】失败`)
                shareFactory("series")
            } else if (resp.body === null) {
                // sleepToast(`❤️ 收藏小说\n\n✅ 已经收藏【${novel.title}】了`)
            } else {
                putInCacheObject(`collect${novelId}`, resp.body)
                likeNovels.push(Number(novelId))

                let novelObj = getAjaxJson(urlNovelDetailed(novelId))
                novelObj.body.isBookmark = true
                putInCacheObject(urlNovelDetailed(novelId), novelObj, cacheSaveSeconds)
            }
        }
    })
    putInCacheObject("likeNovels", likeNovels)
    sleepToast(`❤️ 收藏系列\n\n✅ 已经收藏【${novel.seriesTitle}】全部章节`)
}

function novelMarker(page) {
    if (page === undefined) page = 1
    let novel = getNovel()
    let lastMarker = getFromCacheObject(`marker${novel.id}`)
    if (lastMarker === true) page = 0

    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc_marker.php",
        `mode=save&i_id=${novel.id}&u_id=${getFromCacheObject("pixiv:uid")}&page=${page}`
    )
    java.log(`mode=save&i_id=${novel.id}&u_id=${getFromCacheObject("pixiv:uid")}&page=${page}`)
    if (resp.error === true) {
        sleepToast("🏷️ 添加书签\n\n⚠️ 操作失败", 1)
        shareFactory("novel")
    } else if (lastMarker === true) {
        putInCache(`marker${novel.id}`, false)
        sleepToast(`🏷️ 添加书签\n\n✅ 已删除书签`)
    } else {
        putInCache(`marker${novel.id}`, true)
        sleepToast(`🏷️ 添加书签\n\n✅ 已加入书签`)
    }
}

function seriesWatch() {
    let novel = getNovel()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/watch`,
        "{}"
    )
    if (resp.error === true) {
        sleepToast(`📃 追更系列\n\n⚠️ 追更【${novel.seriesTitle}】失败`, 1)
        shareFactory("series")
    } else {
        putInCache(`watch${novel.seriesId}`, true)
        sleepToast(`📃 追更系列\n\n✅ 已追更【${novel.seriesTitle}】`)

        let watchedSeries = getFromCacheObject("watchedSeries")
        watchedSeries.push(Number(novel.seriesId))
        putInCacheObject("watchedSeries", watchedSeries)

        let novelObj = getAjaxJson(urlSeriesDetailed(novel.seriesId))
        novelObj.body.isWatched = true
        putInCacheObject(urlSeriesDetailed(novel.seriesId), novelObj, cacheSaveSeconds)
    }
}

function seriesUnWatch() {
    let novel = getNovel()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/unwatch`,
        "{}"
    )
    if (resp.error === true) {
        sleepToast(`📃 追更系列\n\n⚠️ 取消追更【${novel.seriesTitle}】失败`, 1)
        shareFactory("series")
    } else {
        cache.delete(`watch${novel.seriesId}`)
        sleepToast(`📃 追更系列\n\n✅ 已取消追更【${novel.seriesTitle}】`)

        let watchedSeries = getFromCacheObject("watchedSeries")
        watchedSeries = watchedSeries.filter(item => item !== Number(novel.seriesId))
        putInCacheObject("watchedSeries", watchedSeries)

        let novelObj = getAjaxJson(urlSeriesDetailed(novel.seriesId))
        novelObj.body.isWatched = false
        putInCacheObject(urlSeriesDetailed(novel.seriesId), novelObj, cacheSaveSeconds)
    }
}

function seriesWatchFactory(code) {
    if (code === undefined) code = 1
    let novel = getNovel()
    if (!novel.seriesId) {
        return sleepToast(`📃 追更系列\n\n⚠️ 【${novel.title}】非系列小说，无法加入追更列表`)
    }

    let lastStatus = getFromCacheObject(`watch${novel.seriesId}`)
    if (lastStatus === true) code = 0
    if (code === 0) seriesUnWatch()
    else if (code === 1) seriesWatch()
}

function userFollow(restrict) {
    if (restrict === undefined) restrict = 0
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${novel.userId}&tag=""&restrict=${restrict}&format=json`
    )
    if (resp.error === true) {
        sleepToast(`⭐️ 关注作者\n\n⚠️ 关注【${novel.userName}】失败`, 1)

        java.startBrowserAwait(`${urlUserUrl(novel.userId)},
    {"headers": {"User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36" }}`, `关注${novel.userName}`, false)
        let lastStatus = getAjaxJson(urlUserDetailed(novel.userId), true).body.isFollowed
        if (lastStatus) sleepToast(`⭐️ 关注作者\n\n✅ 已关注【${novel.userName}】`)

    } else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已关注【${novel.userName}】`)
    }
}

function userUnFollow() {
    let novel = getNovel()
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${novel.userId}`
    )
    if (resp.error === true) {
        sleepToast(`⭐️ 关注作者\n\n⚠️ 取消关注【${novel.userName}】失败`, 1)
        shareFactory("author")
    } else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已取消关注【${novel.userName}】`)
    }
}

function userFollowFactory(code) {
    if (code === undefined) code = 1
    let novel = getNovel()

    let lastStatus = getAjaxJson(urlUserDetailed(novel.userId), true).body.isFollowed
    if (lastStatus) userUnFollow()
    else userFollow()
}

function userBlock() {
    let authors = getFromCacheObject("blockAuthorList")
    if (!authors) authors = []
    let authorsMap = getFromCacheMap("blockAuthorMap")
    if (!authorsMap || authorsMap.size === 0) {
        authorsMap = new Map()
        authors.forEach(author => {
            authorsMap.set(author, getAjaxJson(urlUserDetailed(author)).body.name)
        })
    }

    let novel = getNovel()
    if (authorsMap.has(String(novel.userId))) {
        authorsMap.delete(String(novel.userId))
        sleepToast(`🚫 屏蔽作者\n\n✅ 已取消屏蔽【${novel.userName}】\n现已恢复显示其小说`)
    } else if (!!novel.userId) {
        authorsMap.set(String(novel.userId), novel.userName)
        sleepToast(`🚫 屏蔽作者\n\n✅ 本地已屏蔽【${novel.userName}】\n今后不再显示其小说`)
    }

    authors = Array.from(authorsMap.keys())
    putInCacheObject("blockAuthorList", authors)
    putInCacheMap("blockAuthorMap", authorsMap)
    // source.setVariable(authors.toString())
    // sleepToast(JSON.stringify(authors))
}

// 拆分长评论
function splitComments(text) {
    if (!text) return []
    let limit = 140

    // 1. 预留序号空间（例如 " (10/10)" 占 8 个字符，预留 10 个以防万一）
    const reservedSpace = 10
    const safeLimit = limit - reservedSpace

    // 2. 核心拆分逻辑
    let chars = Array.from(text.trim())
    let tempSegments = []

    const strongPunc = /[。！？…\uff0e\uff01\uff1f!?.…]/ // 强断句标点
    const weakPunc = /[\uff0c\uff1b,;]/                // 弱断句标点

    while (chars.length > 0) {
        if (chars.length <= safeLimit) {
            tempSegments.push(chars.join('').trim())
            break
        }

        let chunk = chars.slice(0, safeLimit)
        let splitIndex = -1

        // 优先级 1: 换行符
        for (let i = chunk.length - 1; i >= 0; i--) {
            if (chunk[i] === '\n') {
                splitIndex = i
                break
            }
        }

        // 优先级 2: 强标点（。！？等）
        if (splitIndex === -1) {
            for (let i = chunk.length - 1; i >= 0; i--) {
                if (strongPunc.test(chunk[i])) {
                    splitIndex = i
                    break
                }
            }
        }

        // 优先级 3: 弱标点（仅在没找到强标点时使用逗号）
        if (splitIndex === -1) {
            for (let i = chunk.length - 1; i >= 0; i--) {
                if (weakPunc.test(chunk[i])) {
                    splitIndex = i
                    break
                }
            }
        }

        // 兜底: 硬截断
        if (splitIndex === -1) {
            splitIndex = safeLimit - 1
        }

        // 截取并清理
        let segment = chars.slice(0, splitIndex + 1).join('').trim();
        if (segment) tempSegments.push(segment)

        // 移除已处理字符并跳过开头的空白
        chars = chars.slice(splitIndex + 1);
        while (chars.length > 0 && (chars[0] === '\n' || chars[0] === ' ')) {
            chars.shift()
        }
    }

    // 3. 注入序号
    const total = tempSegments.length;
    if (total <= 1) return tempSegments;
    return tempSegments.map((content, i) => `${content} (${i + 1}/${total})`).reverse();
}

function novelCommentAdd() {
    let resp, novel = getNovel()
    let userId = getFromCacheObject("pixiv:uid")
    let comment = String(result.get("文本框")).trim()
    if (comment === "") {
        return sleepToast(`✅ 发送评论\n⚠️ 请在【文本框】内输入评论\n\n输入【评论内容；评论ID】可回复该条评论，如【非常喜欢；123456】`)
    }

    let comments = splitComments(comment)
    if (comments.length >= 2) sleepToast("✅ 发送评论\n\n正在拆分长评论，即将逐条发送")
    comments.forEach(comment => {
        sleep(0.5 * 1000 * Math.random())
        let matched = comment.match(RegExp(/(；|;\s*)\d{8,}/))
        if (matched) {
            let commentId = comment.match(new RegExp(/；(\d{8,})/))[1]
            comment = comment.replace(new RegExp(`(；|;\s*)${commentId}`), "")
            resp = getPostBody(
                "https://www.pixiv.net/novel/rpc/post_comment.php",
                `type=comment&novel_id=${novel.id}&author_user_id=${userId}&comment=${encodeURI(comment)}&parent_id=${commentId}`)
        } else {
            resp = getPostBody(
                "https://www.pixiv.net/novel/rpc/post_comment.php",
                `type=comment&novel_id=${novel.id}&author_user_id=${userId}&comment=${encodeURI(comment)}`
            )
        }

        if (resp.error === true) {
            sleepToast("✅ 发送评论\n\n⚠️ 评论失败", 1)
            shareFactory("novel")
        } else {
            sleepToast(`✅ 发送评论\n\n✅ 已在【${novel.title}】发布评论：\n${comment}`, 1)
        }
    })
    try {java.refreshContent()} catch(err) {}
    if (comments.length >= 2) sleepToast("✅ 发送评论\n\n✅ 长评论已发送完毕", 1)
}

function getNovelCommentID(novelId, commentText) {
    let list = [], uid = String(getFromCacheObject("pixiv:uid"))
    let resp = getAjaxJson(urlNovelComments(novelId, 0, 50), true)
    resp.body.comments.forEach(comment => {
        if (comment.userId === uid && comment.comment === commentText) list.push(comment.id)

        if (comment.hasReplies === true) {
            let resp = getAjaxJson(urlNovelCommentsReply(comment.id, 1), true)
            resp.body.comments.forEach(comment => {
                if (comment.userId === uid && comment.comment === commentText) list.push(comment.id)
            })
        }
    })
    // java.log(JSON.stringify(list))
    return list
}

function novelCommentDelete() {
    let commentIDs, novel = getNovel()
    let comment = String(result.get("文本框")).trim()
    if (comment === "") {
        return sleepToast(`🗑 删除评论\n⚠️ 请在【文本框】内输入需要删除的【评论ID】，以分号间隔\n或输入需要删除的【评论内容】\n\n如：【123；456；789】\n或【模拟评论内容】`)
    }

    if (RegExp(/[；;]/).test(comment)) {
        commentIDs = comment.split(/[；;]/)
            .map(item => item.trim())         // 去除每个元素前后的空格
            .filter(item => item !== "")     // 过滤掉因为末尾分号产生的空项
    } else if (RegExp(/\d{8,}/).test(comment)) {
        let matched = comment.match(/\d{8,}/g)
        commentIDs = Array.from(matched || [])
    } else {
        commentIDs = getNovelCommentID(novel.id, comment)
        // java.log(JSON.stringify(commentIDs))
        if (commentIDs.length === 0) {
            return sleepToast(`🗑 删除评论\n\n⚠️ 未能找到这条评论\n请检查是否有错别字或标点符号是否一致`)
        }
    }

    commentIDs.forEach(commentID =>{
        sleep(0.5 * 1000 * Math.random())
        let resp = getPostBody(
            "https://www.pixiv.net/novel/rpc_delete_comment.php",
            `i_id=${novel.id}&del_id=${commentID}`
        )
        // java.log(JSON.stringify(resp))
        if (resp.error === true) {
            sleepToast("🗑 删除评论\n\n⚠️ 评论删除失败", 1)
            shareFactory("novel")
        } else {
            let isCommentText = !RegExp(/[；;]/).test(comment) && !RegExp(/\d{8,}/).test(comment)
            let toastComment = isCommentText ? comment : commentID
            sleepToast(`🗑 删除评论\n\n✅ 已在【${novel.title}】删除评论：\n${toastComment}`, 1)
        }
    })
    try {java.refreshContent()} catch(err) {}
    if (comments.length >= 2) sleepToast("🗑 删除评论\n\n✅ 评论已删除完毕", 1)
}

function novelPollAnswer() {
    let novel = getNovel()
    // novel.pollChoicesCount = getAjaxJson(urlNovelDetailed(novel.id)).body.pollData.selectedValue
    if (!novel.pollChoicesCount) {
        return sleepToast(`📃 小说投票\n\n⚠️ 该小说【${novel.title}】无投票信息，建议【清除缓存】【刷新】后重试`)
    }

    let choiceId = String(result.get("文本框")).trim()
    if (!choiceId) {
        return sleepToast(`📃 小说投票\n\n⚠️ 投票失败：请在【文本框】内输入投票选项(数字)`)
    } else if (Number(choiceId) > novel.pollData.selectedValue) {
        return sleepToast(`📃 小说投票\n\n⚠️ 投票失败：选项${choiceId}超出范围`)
    } else if (Number(choiceId) <= 0 || Number(choiceId) > novel.pollChoicesCount) {
        return sleepToast(`📃 小说投票\n\n⚠️ 投票失败：选项${choiceId}超出范围`)
    }

    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/${novel.id}/poll/answer`,
        JSON.stringify({"choice_id": choiceId})
    )
    // 200 成功，403 重复投票，400 选项超过范围
    if (resp.error === true) {
        if (resp.errMsg.includes("403")) {
            sleepToast(`📃 小说投票\n\n✅ 已经投过票了`)
        } else {
            sleepToast(`📃 小说投票\n\n⚠️ 投票失败`)
            shareFactory("novel")
        }
    } else {
        sleepToast(`📃 小说投票\n\n✅ 投票成功`)
    }
}

let wordsType = {
    "caption": "📃 简介屏蔽列表",
    "tags": "#️ 标签屏蔽列表",
    "authors": "👤 作者屏蔽列表"
}

function printAuthorMap(map) {
    let text = ""
    map.forEach((value, key) => {
        text += `@${value} ${key}\n`
    })
    return text.trim()
}

function blockShowFactory() {
    let keys = Object.keys(wordsType)
    let key = getFromCacheObject("wordsType")

    // 切换屏蔽列表
    let index = keys.indexOf(key) + 1
    if (index === keys.length) index = 0
    key = keys[index]
    putInCacheObject("wordsType", key)

    if (key === "authors") {
        let words = printAuthorMap(getFromCacheMap("blockAuthorMap"))
        if (!words) words = ""
        sleepToast(`👀 查看屏蔽\n${wordsType[key]}\n\n${words}`, 2)
    } else {
        let words = getFromCacheObject(`${key}BlockWords`)
        if (!words) words = []
        sleepToast(`👀 查看屏蔽\n${wordsType[key]}\n\n${words.join("\n")}`, 2)
    }
}

function blockWordAdd() {
    let method = getFromCacheObject("wordsType")
    let blockWords = getFromCacheObject(`${method}BlockWords`)
    if (blockWords === null) blockWords = []

    let word = String(result.get("文本框")).trim()
    if (word === "") {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 请在【文本框】内输入屏蔽词`)
    } else if (blockWords.includes(word)) {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 【${word}】已经加入屏蔽列表了`)
    } else {
        blockWords.push(word)
        putInCacheObject(`${method}BlockWords`, blockWords)
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 已将【${word}】加入屏蔽列表中`)
    }
}

function blockWordDelete() {
    let method = getFromCacheObject("wordsType")
    let blockWords = getFromCacheObject(`${method}BlockWords`)
    if (blockWords === null) blockWords = []

    let word = String(result.get("文本框")).trim()
    if (word === "") {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 请在【文本框】内输入屏蔽词`)
    } else if (!blockWords.includes(word)) {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 【${word}】不在屏蔽列表\n请检查是否有错别字或标点符号是否一致`)
    } else {
        blockWords = blockWords.filter(item => item !== word)
        putInCacheObject(`${method}BlockWords`, blockWords)
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除屏蔽词【${word}】`)
    }
}

function blockAuthorAdd() {
    let method = getFromCacheObject("wordsType")
    let blockAuthors = getFromCacheMap(`blockAuthorMap`)

    let word = String(result.get("文本框")).trim()
    if (word === "") {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 请在【文本框】内输入【作者ID】\n或使用上方 🚫 屏蔽作者`)
    } else if (blockAuthors.has(word)) {
        let text = `${blockAuthors.get(word)} ${word}`
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 【${text}】已经加入屏蔽列表了`)
    }
    // 输入纯数字，添加对应ID的作者
    else if (!isNaN(word)) {
        let user = getAjaxJson(urlUserDetailed(word)).body
        blockAuthors.set(user.userId, user.name)
        let text = `@${user.name} ${user.userId}`
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 已将【${text}】加入屏蔽列表中`)
    }
    else if (word) {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 输入【用户ID】可屏蔽该作者`)
    }
    putInCacheMap(`blockAuthorMap`, blockAuthors)
}

function blockAuthorDelete() {
    let method = getFromCacheObject("wordsType")
    let blockAuthors = getFromCacheMap(`blockAuthorMap`)

    let word = String(result.get("文本框")).trim()
    if (word === "") {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 请在【文本框】内输入【作者ID】\n或使用上方 🚫 屏蔽作者`)
    }
    // 输入纯数字，删除对应ID的作者
    else if (!isNaN(word) && blockAuthors.has(word)) {
        let text = `@${blockAuthors.get(word)} ${word}`
        blockAuthors.delete(word)
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除【${text}】`)
    }
    //作者名称
    else if (Array.from(blockAuthors.values()).includes(word)) {
        let index = Array.from(blockAuthors.values()).indexOf(word)
        let key = Array.from(blockAuthors.keys())[index]
        let text = `@${blockAuthors.get(key)} ${key}`
        blockAuthors.delete(key)
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除【${text}】`)
    }
    else if (word) {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 输入【用户ID】可屏蔽该作者`)
    }
    putInCacheMap(`blockAuthorMap`, blockAuthors)
}

function blockAddFactory() {
    if (getFromCacheObject("wordsType") === "authors") return blockAuthorAdd()
    else return blockWordAdd()
}

function blockDeleteFactory() {
    if (getFromCacheObject("wordsType") === "authors") return blockAuthorDelete()
    else return blockWordDelete()
}


function likeTagsShow() {
    let likeTags = getFromCacheObject(`likeTags`)
    if (likeTags === null) likeTags = []
    sleepToast(`👀 查看标签\n📌 喜欢标签\n\n${likeTags.join("、")}`, 5)
}

function likeTagsAdd() {
    let likeTags = getFromCacheObject(`likeTags`)
    if (likeTags === null) likeTags = []

    let word = String(result.get("文本框")).trim()
    if (word === "") {
        sleepToast(`📌 喜欢标签\n📌 添加标签\n\n⚠️ 请在【文本框】内直接输入标签内容`)
    } else if (word.startsWith("@") || word.startsWith("＠")) {
        sleepToast(`📌 喜欢标签\n📌 添加标签\n\n⚠️ 仅支持添加【标签】\n不支持添加 @作者名称`)
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        sleepToast(`📌 喜欢标签\n📌 添加标签\n\n⚠️ 仅支持添加【标签】\n不支持添加 #标签名称`)
    } else if (likeTags.includes(word)) {
        sleepToast(`📌 喜欢标签\n📌 添加标签\n\n✅ 【${word}】已经加入喜欢标签了\n请于发现页刷新后查看`)
    } else {
        likeTags.push(word)
        putInCacheObject(`likeTags`, likeTags)
        sleepToast(`📌 喜欢标签\n📌 添加标签\n\n✅ 已将【${word}】加入喜欢标签了`)
        try {source.refreshExplore()} catch (e) {}
    }
}

function likeTagsDelete() {
    let likeTags = getFromCacheObject(`likeTags`)
    if (likeTags === null) likeTags = []

    let word = String(result.get("文本框")).trim()
    if (word === "") {
        sleepToast(`📌 喜欢标签\n🗑 删除标签\n\n⚠️ 请在【文本框】内直接输入标签内容`)
    } else if (!likeTags.includes(word)) {
        sleepToast(`📌 喜欢标签\n🗑 删除标签\n\n⚠️ 【${word}】不在喜欢标签\n请检查是否有错别字`)
    } else {
        likeTags = likeTags.filter(item => item !== word)
        putInCacheObject(`likeTags`, likeTags)
        sleepToast(`📌 喜欢标签\n🗑 删除标签\n\n✅ 已删除该标签【${word}】`)
        try {source.refreshExplore()} catch (e) {}
    }
}


function likeAuthorsShow() {
    let text = printAuthorMap(getFromCacheMap(`likeAuthors`))
    sleepToast(`👀 查看收藏\n❤️ 他人收藏\n\n${text.trim()}`, 2)
}

function likeAuthorsAdd() {
    let likeAuthors = getFromCacheMap(`likeAuthors`)
    let word = String(result.get("文本框")).trim()
    if (word.startsWith("@") || word.startsWith("＠")) {
        return sleepToast(`❤️ 他人收藏\n❤️ 添加收藏\n\n⚠️ 仅支持通过【作者ID】关注\n不支持添加 @作者名称`)
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        return sleepToast(`❤️ 他人收藏\n❤️ 添加收藏\n\n⚠️ 仅支持通过【作者ID】关注\n不支持添加 #标签名称`)
    } else if (likeAuthors.has(word)) {
        let text = `${likeAuthors.get(word)} ${word}`
        sleepToast(`❤️ 他人收藏\n❤️ 添加收藏\n\n✅ 【${text}】已经加入收藏列表了，请于发现页查看`)
    }

    // 无输入内容，添加当前小说的作者
    if (word === "") {
        let novel = getNovel()
        likeAuthors.set(String(novel.userId), novel.userName)
        let text = `@${novel.userName} ${novel.userId}`
        sleepToast(`❤️ 他人收藏\n❤️ 添加收藏\n\n✅ 已将【${text}】加入他人收藏列表了，请于发现页查看\n\n📌 【文本框】内输入【用户ID】可关注其他用户的收藏`)
    }
    // 输入纯数字，添加对应ID的作者
    else if (!isNaN(word)) {
        let user = getAjaxJson(urlUserDetailed(word)).body
        likeAuthors.set(user.userId, user.name)
        let text = `@${user.name} ${user.userId}`
        sleepToast(`❤️ 他人收藏\n️ 添加收藏\n\n✅ 已将【${text}】加入他人收藏列表了，请于发现页查看`)
    }

    else if (word) {
        sleepToast(`❤️ 他人收藏\n❤️ 添加收藏\n\n📌 【文本框】内输入【用户ID】可关注其他用户的收藏`)
    }
    putInCacheMap(`likeAuthors`, likeAuthors)
    try {source.refreshExplore()} catch (e) {}
}

function likeAuthorsDelete() {
    let likeAuthors = getFromCacheMap(`likeAuthors`)
    let word = String(result.get("文本框")).trim()
    if (word.startsWith("@") || word.startsWith("＠")) {
        return sleepToast(`❤️ 他人收藏\n🖤 取消收藏\n\n⚠️ 仅支持通过【作者ID/作者名称】取关\n不支持输入 @作者名称`)
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        return sleepToast(`❤️ 他人收藏\n🖤 取消收藏\n\n⚠️ 仅支持通过【作者ID/作者名称】取关\n不支持输入 #标签名称`)
    }

    if (word === "") {
        let novel = getNovel()
        likeAuthors.delete(novel.userId)
        let text = `@${novel.userName} ${novel.userId}`
        sleepToast(`❤️ 他人收藏\n🖤 取消收藏\n\n✅ 已将【${text}】移出他人收藏列表了\n\n📌 【文本框】内输入【用户ID】可取消关注其他用户的收藏`)

    // 输入纯数字，删除对应ID的作者
    } else if (!isNaN(word) && likeAuthors.has(word)) {
        let text = `@${likeAuthors.get(word)} ${word}`
        likeAuthors.delete(word)
        sleepToast(`❤️ 他人收藏\n🖤 取消收藏\n\n✅ 已取关【${text}】`)

    //作者名称
    } else if (Array.from(likeAuthors.values()).includes(word)) {
        let index = Array.from(likeAuthors.values()).indexOf(word)
        let key = Array.from(likeAuthors.keys())[index]
        let text = `@${likeAuthors.get(key)} ${key}`
        likeAuthors.delete(key)
        sleepToast(`❤️ 他人收藏\n🖤 取消收藏\n\n✅ 已取关【${text}】`)
    }
    else if (word) {
        sleepToast(`❤️ 他人收藏\n🖤 取消收藏\n\n📌 【文本框】内输入【用户ID】可取关其他用户的收藏`)
    }
    putInCacheMap(`likeAuthors`, likeAuthors)
    try {source.refreshExplore()} catch (e) {}
}

function shareFactory(type) {
    let novel = getNovel()
    if (novel === undefined || novel === null) return sleepToast("⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel") || (!novel.seriesId)) {
        startBrowser(urlNovelUrl(novel.id), novel.title)
    }
    else if (type.includes("series") && novel.seriesId) {
        startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}
function startGithubReadme() {
    startBrowser("https://pixivsource.pages.dev/Pixiv", "使用指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

function readMeSearch() {
    return sleepToast(`🔍 搜索说明\n
    标签之间需要以【空格】间隔
    ➖ 排除标签：#标签1 -标签2
    👤 作者专搜：@搜索作者名称
    #️ 标签专搜：#标签1 标签2 
    ⏬ 字数筛选1：#标签1 标签2 字数3k5
    ⏬ 字数筛选2：@作者的名称 字数3w5`.replace("    ",""), 5)
}

let settingsName = {
    "SEARCH_AUTHOR": "🔍 搜索作者",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "SHOW_UPDATE_TIME": "📅 更新时间",
    "SHOW_COMMENTS": "💬 显示评论",
    "MORE_INFORMATION": "📖 更多简介",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "🖼️ 显示描述",
    "HIDE_LIKE_NOVELS": "❤️ 隐藏收藏",
    "HIDE_WATCHED_SERIES": "📃 隐藏追更",
    "IPDirect": "✈️ 直连模式",
    "FAST": "⏩ 快速模式",
    "DEBUG": "🐞 调试模式",
    "SHOW_GENERAL": "🆗 常规小说",
    "SHOW_NEW_ADULT": "🔞 最新企划",
    "SHOW_NEW_GENERAL": "🆗 最新企划",
    "SHOW_RANK_ADULT": "🔞 排行榜单",
    "SHOW_RANK_GENERAL": "🆗 排行榜单",
    "SHOW_GENRE_ADULT": "🔞 原创热门",
    "SHOW_GENRE_GENERAL": "🆗 原创热门",
    "SHOW_FURRY": "🐺 兽人小说",
    "SHOW_DISCOVER": "⚙️ 发现设置\n（书源编辑界面）",
    "SHOW_SETTINGS": "⚙️ 书源设置\n（书源编辑界面）",
    "SHOW_DISCOVER2": "⚙️ 发现设置\n（小说阅读界面）",
    "SHOW_SETTINGS2": "⚙️ 书源设置\n（小说阅读界面）",
}

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else return "🈚️ 未设置"
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode) {
    if (mode === undefined) mode = ""
    let keys = [], msgList = []
    let settings = getFromCacheObject("pixivSettings")
    if (mode === "FAST") {
        keys = Object.keys(settingsName).slice(0, 5)
    } else if (mode === "IPDirect") {
        keys = Object.keys(settingsName).slice(0, 2)
    } else if (mode.includes("DISCOVER")) {
        keys = Object.keys(settingsName).slice(13, 21)
    } else {
        keys = Object.keys(settingsName).slice(0, 13)
    }
    for (let i in keys) {
        msgList.push(`${statusMsg(settings[keys[i]])}　${settingsName[keys[i]]}`)
    }
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`\n⚙️ 当前设置\n\n${getSettingStatus()}`)
}
function showSettingsDiscover() {
    sleepToast(`\n⚙️ 当前发现设置\n\n${getSettingStatus("DISCOVER")}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n✅ 已恢复　🔧 默认设置\n\n${getSettingStatus()}`)
}

function editSettings(settingName) {
    let msg, status
    let settings = getFromCacheObject("pixivSettings")
    if (!settings) settings = setDefaultSettings()
    if (!!settings[settingName]) {
        status = settings[settingName] = !settings[settingName]
    } else {
        status = settings[settingName] = true
    }
    putInCacheObject("pixivSettings", settings)

    if (settingName === "FAST") {
        checkSettings(settings)
        msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}\n\n${getSettingStatus(settingName)}`
    } else if (settingName === "IPDirect") {
        if (settings.IPDirect && !isLogin()) {
            msg = "✈️ 直连模式\n\n✈️ 直连模式 需登录账号\n当前未登录账号，现已关闭直连模式"
            settings.IPDirect = false
            checkSettings(settings)
        } else {
            checkSettings(settings)
            msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}\n\n${getSettingStatus(settingName)}`
        }
        try {source.refreshExplore()} catch (e) {}
    } else {
        msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}`
        if (settingName.startsWith("SHOW")) try {source.refreshExplore()} catch (e) {}
    }
    sleepToast(msg)
}

function cleanCache() {
    let novel = getNovel()
    cache.delete(`${urlNovelUrl(novel.id)}`)
    cache.delete(`${urlNovelDetailed(novel.id)}`)
    try {java.refreshContent()} catch(err) {}
    sleepToast(`🔄 刷新本章\n\n若正文未更新，请手动刷新`, 5)
}

function getFurryAuthors() {
    cache.delete("https://api.furrynovel.ink/fav/user/cache")  // 删除缓存实时请求数据
    let furryAuthorsMap = {}
    let authorsListLinpx = getAjaxJson("https://api.furrynovel.ink/fav/user/cache")
    authorsListLinpx.forEach(author => {
        furryAuthorsMap[author.name] = author.id || author._id
    })

    // let authorsMapFurryReading = getAjaxJson("")
    // furryAuthorsMap = Object.assign(furryAuthorsMap, authorsMapFurryReading)
    putInCacheObject("furryAuthors", furryAuthorsMap)
    return furryAuthorsMap
}

function updatePixivAuthors() {
    let furryAuthors = getFurryAuthors()
    let pixivAuthors = getFromCacheObject("pixivAuthors")
    if (!pixivAuthors) pixivAuthors = {}
    pixivAuthors = Object.assign(pixivAuthors, furryAuthors)
    putInCacheObject("pixivAuthors", pixivAuthors, cacheSaveSeconds)
    sleepToast("\n🐺 兽人作者搜索优化 \n\n ✅ 已导入 Linpx 推荐作者", 1)
    return pixivAuthors
}