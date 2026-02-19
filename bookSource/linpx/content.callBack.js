function shareBook() {
    let text = `我正在看：【${book.author.replace("@", "")}】创作的《${book.name}》`
    if (!!book.durChapterTitle && String(book.name) !== String(book.durChapterTitle)) {
        text += `的 【${book.durChapterTitle}】`
    }
    text += `\n\n小说链接：\n${book.bookUrl}\n\n分享自【开源阅读】Linpx书源。使用添加网址，快速添加本文`
    java.copyText(text)
    return true
}

function clearCache() {
    let novel = getNovel()
    cache.delete(urlNovelDetailed(novel.id))
    if (novel.seriesId) cache.delete(urlSeriesDetailed(novel.seriesId))
    return true
}

function copyBookUrl() {
    java.copyText(book.bookUrl)
    return true
}
copyTocUrl = copyBookUrl

// 保存阅读，更新登录界面的章节名称
function saveRead() {
    source.putLoginInfo(JSON.stringify({"章节名称": book.durChapterTitle}))
}

function startShelfRefresh() {
    source.putConcurrent("2/2000")
}

function endShelfRefresh() {
    source.putConcurrent("25/5000")
}

function callBackFactory(event) {
    switch (event) {
        // case "clickBookName":
        //     return clickBookName()
        // case "longClickBookName":
        //     return longClickBookName()
        // case "clickAuthor":
        //     return clickAuthor()
        // case "longClickAuthor":
        //     return longClickAuthor()
        // case "clickCustomButton":
        //     return customButton()
        // case "longClickCustomButton":
        //     return longcustomButton()

        case "clickShareBook":
            return shareBook()
        case "clickClearCache":
            return clearCache()
        case "clickCopyBookUrl":
            return copyBookUrl()
        case "clickCopyTocUrl":
            return copyTocUrl()

        // 下面的事件无法被回调结果消费
        // case "addBookShelf":
        //     return addBookShelf()
        // case "delBookShelf":
        //     return delBookShelf()
        case "saveRead":
            return saveRead()
        // case "startRead":
        //     return startRead()
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