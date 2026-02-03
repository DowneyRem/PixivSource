var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function novelHandler(novel){
    novel = util.formatNovels(util.handNovels([novel], true))[0]
    if (novel.seriesId === undefined || novel.seriesId === null) {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlIP(urlNovelDetailed(novel.id))
    } else {
        book.bookUrl = novel.detailedUrl = urlSeriesUrl(novel.seriesId)
        book.tocUrl = novel.catalogUrl = urlIP(urlSeriesDetailed(novel.seriesId))
    }
    // 放入信息以便登陆界面使用
    source.putLoginInfo(JSON.stringify(novel))
    putInCacheObject("novel", novel)
    return novel
}

novelHandler = profile("novelHandler", novelHandler);

(() => {
    return novelHandler(util.getNovelResFirst(result))
})()