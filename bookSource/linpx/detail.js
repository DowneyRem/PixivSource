var util = objParse(String(java.get("util")))

function novelHandler(novel) {
    novel = util.formatNovels(util.handNovels([novel], true))[0]
    // 优化 未缓存系列目录的情况：目录链接设置为单篇链接
    let result = getAjaxJson(urlSeriesDetailed(novel.seriesId))
    if (!novel.seriesId || novel.seriesId && result.error) {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    return novel
}

(() => {
    return novelHandler(util.getNovelRes(result))
})();