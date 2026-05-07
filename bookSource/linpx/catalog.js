var util = objParse(String(java.get("util")))

function urlNovel(novelId) {
    if (util.settings.SHOW_ORIGINAL_LINK) {
        return urlNovelUrl(novelId)
    } else {
        return urlNovelDetailed(novelId)
    }
}

function oneShotHandler(resp) {
    resp.textCount =　resp.content.length
    resp.updateDate = timeTextFormat(resp.createDate)
    return [{
        title: resp.title.trim(),
        chapterUrl: urlNovel(resp.id),
        chapterInfo:`${resp.updateDate}　　${resp.textCount}字`
    }]
}

function seriesHandler(resp) {
    resp.novels.forEach(novel => {
        if (novel.title) novel.title = novel.title.trim()
        novel.chapterUrl = urlNovel(novel.id)
        // novel.updateDate = String(novel.coverUrl.match(RegExp("\\d{4}/\\d{2}/\\d{2}")))  //fake

        // 防止 urlSeriesDetailed 无法返回有全部数据
        novel.detail = getAjaxJson(urlNovelDetailed(novel.id))
        if (!novel.title) novel.title = novel.detail.title.trim()
        novel.textCount = novel.detail.content.length
        novel.updateDate = timeTextFormat(novel.detail.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.textCount}字`
        delete novel.detail
    })
    return resp.novels
}

// 优化 未缓存系列目录的情况：从章节数据中，获取系列目录
function seriesContentHandler(resp) {
    let novels = [], prevNovels = [], nextNovels = []
    while (resp.series.prev !== null && resp.series.prev !== undefined) {
        prevNovels.push(resp.series.prev)
        resp = getAjaxJson(urlNovelDetailed(resp.series.prev.id))
    }
    nextNovels.push({id: resp.id, order: resp.series.order, title: resp.title})
    while (resp.series.next !== null && resp.series.prev !== undefined) {
        nextNovels.push(resp.series.next)
        resp = getAjaxJson(urlNovelDetailed(resp.series.next.id))
    }
    novels = novels.concat(prevNovels.reverse())
    novels = novels.concat(nextNovels)
    novels.forEach(novel => {
        novel.title = novel.title.trim()
        novel.chapterUrl = urlNovel(novel.id)
        novel.detail = getAjaxJson(urlNovelDetailed(novel.id))
        novel.textCount = novel.detail.content.length
        novel.updateDate = timeTextFormat(novel.detail.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.textCount}字`
        delete novel.detail
    })
    // java.log(JSON.stringify(novels))
    return novels
}

(() => {
    let resp = util.getNovelRes(result)
    if (resp.novels) {
        return seriesHandler(resp)
    } else if (resp.series) {
        // 优化 未缓存系列目录的情况
        return seriesContentHandler(resp)
    } else {
        return oneShotHandler(resp)
    }
})()