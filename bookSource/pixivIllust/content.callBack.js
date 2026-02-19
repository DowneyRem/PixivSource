// function getNovel() {
//     let novel = {}
//     novel.author = novel.userName = book.author.replace("@", "")
//     if (book.bookUrl.includes("series")) {
//         novel.seriesId = book.bookUrl.match(/\d+/)[0]
//         novel.seriesTitle = book.name
//
//         let novelIds = getFromCacheObject(`novelIds${novel.seriesId}`)
//         novel.id = novelIds[book.durChapterIndex]
//         novel.title = book.durChapterTitle
//     } else {
//         novel.seriesId = 0
//         novel.seriesTitle = ""
//         novel.id = book.bookUrl.match(/\d+/)[0]
//         novel.title = book.name
//     }
//     return novel
// }

function shareBook() {
    let text = `我正在看：【${book.author.replace("@", "")}】创作的《${book.name}》`
    if (!!book.durChapterTitle && String(book.name) !== String(book.durChapterTitle)) {
        text += `的 【${book.durChapterTitle}】`
    }
    text += `\n\n链接：\n${book.bookUrl}\n\n分享自【开源阅读】Pixiv书源。使用添加网址，快速添加本文`
    java.copyText(text)
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

// 保存阅读，更新登录界面的章节名称
function saveRead() {
    source.putLoginInfo(JSON.stringify({"章节名称": book.durChapterTitle}))
}

function startShelfRefresh() {
    source.putConcurrent("18/30000")
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
        // case "clickClearCache":
        //     return clearCache()
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