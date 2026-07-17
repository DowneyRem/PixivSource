function getNovelId(seriesId) {
    if (chapter) {
        try {
            return chapter.url.match(/novel\/(\d+)/)[1]
        } catch (e) {
            return chapter.url.match(/\d+/)[0]
        }
    }

    if (!book.bookUrl.includes("series")) {
        return book.bookUrl.match(/\d+/)[0]
    } else {
        seriesId = book.bookUrl.match(/\d+/)[0]
    }

    if (seriesId) {
        let novelIds = getFromCacheObject(`novelIds${seriesId}`)
        if (novelIds) {
            return getFromCacheObject(`novelIds${seriesId}`)[book.durChapterIndex]
        } else {
            return getAjaxJson(urlIP(urlSeriesNovelsTitles(seriesId)), true).body[book.durChapterIndex].id
        }
    }
}

function getNovel() {
    let novel = {}
    if (book.bookUrl.includes("series")) {
        novel.seriesId = book.bookUrl.match(/\d+/)[0]
        novel.seriesTitle = book.name
        novel.id = getNovelId(novel.seriesId)
        novel.title = book.durChapterTitle
    } else {
        novel.seriesId = 0
        novel.seriesTitle = ""
        novel.id = book.bookUrl.match(/\d+/)[0]
        novel.title = book.name
    }
    novel.author = novel.userName = book.author.replace("@", "")
    let resp = getAjaxJson(urlIP(urlNovelDetailed(novel.id))).body
    novel.userId = resp.userId
    novel.question = resp?.pollData?.question || ""
    // java.log(JSON.stringify(novel))
    return novel
}

function getPostBody(url, body, headers) {
    if (headers === undefined) headers = getFromCacheObject("pixivHeaders")
    if (headers === undefined) headers = getFromCacheObject("headers")
    if (isJsonString(body)) {
        headers["content-type"] = "application/json; charset=utf-8"
    } else if (typeof body === "string") {
        headers["content-type"] = "application/x-www-form-urlencoded; charset=utf-8"
    }

    let settings = getFromCacheObject("pixivSettings")
    if (settings.IPDirect) {
        url = url.replace("http://", "https://").replace("www.pixiv.net", "210.140.139.155")
        headers["Host"] = "www.pixiv.net"
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
            // else if (e.includes("401")) sleepToast(`📤 getPostBody\n\n⚠️ 缺少 cookie 或 cookie 过期`, 1)
        // else if (e.includes("403")) sleepToast(`📤 getPostBody\n\n⚠️ 缺少 cookie 或 cookie 过期`, 1)
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
        // shareFactory("novel")
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
        // shareFactory("novel")
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

function seriesWatch() {
    let novel = getNovel()
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/watch`,
        "{}"
    )
    if (resp.error === true) {
        sleepToast(`📃 追更系列\n\n⚠️ 追更【${novel.seriesTitle}】失败`, 1)
        // shareFactory("series")
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
        // shareFactory("series")
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

function shareBook() {
    let text = `我正在看：【${book.author.replace("@", "")}】创作的《${book.name}》`
    if (!!book.durChapterTitle && String(book.name) !== String(book.durChapterTitle)) {
        text += `的 【${book.durChapterTitle}】`
    }
    text += `\n\n小说链接：\n${book.bookUrl}\n\n分享自【开源阅读】Pixiv书源。使用添加网址，快速添加本文`
    java.copyText(text)
    return true
}

function clearCache() {
    let novel = getNovel()
    if (novel.id) {
        cache.delete(`${urlNovelUrl(novel.id)}`)
        cache.delete(`${urlNovelDetailed(novel.id)}`)
        cache.delete(`${urlSearchNovel(novel.title, 1)}`)
    }
    if (novel.seriesId) {
        cache.delete(`${urlSeriesUrl(novel.seriesId)}`)
        cache.delete(`${urlSeriesDetailed(novel.seriesId)}`)
        cache.delete(`${urlSearchSeries(novel.seriesTitle, 1)}`)

        let novelIds = getFromCacheObject(`novelIds${novel.seriesId}`)
        if (!novelIds) novelIds = getAjaxJson(urlIP(urlSeriesNovelsTitles(seriesId)), true).body.map(item => item.id)
        if (novelIds && novelIds.length > 0) {
            novelIds.forEach(novelId => {
                cache.delete(`${urlNovelUrl(novelId)}`)
                cache.delete(`${urlNovelDetailed(novelId)}`)
            })
        }
    }
    return true
}

function copyBookUrl() {
    java.copyText(book.bookUrl)
    return true
}
function copyTocUrl() {
    java.copyText(book.tocUrl)
    return true
}

// 添加书籍、删除书籍
function addBookShelf() {
    let settings = getFromCacheObject("pixivSettings")
    if (!settings.AUTO_LIKE_NOVELS) return

    let novel = getNovel()
    if (novel.seriesId) seriesWatch()
    else if (novel.id) novelBookmarkAdd()
}
function delBookShelf() {
    let settings = getFromCacheObject("pixivSettings")
    if (!settings.AUTO_DISLIKE_NOVELS) return

    let novel = getNovel()
    if (novel.seriesId) seriesUnWatch()
    else if (novel.id) novelBookmarkDelete()
}

// 保存阅读，更新登录界面的章节名称
function saveRead() {
    let novel = getNovel()
    novelData = {}
    novelData["章节名称"] = book.durChapterTitle
    // novelData["章节名称"] = novel.title
    novelData["问卷调查"] = novel.question
    source.putLoginInfo(JSON.stringify(novelData))
}

function startShelfRefresh() {
    source.putConcurrent("18/30000")
}
function endShelfRefresh() {
    source.putConcurrent("25/5000")
}

function customButton(){
    java.open("login")
}
function longCustomButton(){
    java.open("login")
}

function clickBookName() {
    java.open("search", null, book.name)
    return true
}
function longClickBookName() {
    let novel = getNovel()
    startBrowser(urlNovelUrl(novel.id), novel.title)
    return true
}

function clickAuthor() {
    java.open("search", null, book.author)
    return true
}
function longClickAuthor() {
    let novel = getNovel()
    startBrowser(urlUserUrl(novel.userId), novel.userName)
    return true
}

// function clickBookLabel() {
//     java.open("search", null, book.tags)
//     return true
// }
// function longClickBookLabel() {
//     startBrowser(urlSearchNovelWeb(book.tags,1), book.tag)
//     return true
// }

function callBackFactory(event) {
    switch (event) {
        case "clickBookName":
            return clickBookName()
        case "longClickBookName":
            return longClickBookName()

        case "clickAuthor":
            return clickAuthor()
        case "longClickAuthor":
            return longClickAuthor()

        // case "clickBookLabel":
        //     return clickBookLabel()
        // case "longClickBookLabel":
        //     return longClickBookLabel()

        case "clickCustomButton":
            return customButton()
        case "longClickCustomButton":
            return longCustomButton()

        case "clickShareBook":
            return shareBook()
        case "clickClearCache":
            return clearCache()

        case "clickCopyBookUrl":
            return copyBookUrl()
        case "clickCopyTocUrl":
            return copyTocUrl()

        // 下面的事件无法被回调结果消费
        case "addBookShelf":
            return addBookShelf()
        case "delBookShelf":
            return delBookShelf()

        case "saveRead":
            return saveRead()
        case "startRead":
            return saveRead()
        // case "endRead":
        //     return endRead()

        case "startShelfRefresh":
            return startShelfRefresh()
        case "endShelfRefresh":
            return endShelfRefresh()
    }
}

(() => {
    return callBackFactory(event)
})()