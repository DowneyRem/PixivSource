var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function novelHandler(novel){
    novel = util.formatNovels(util.handNovels([novel], true))[0]
    if (novel.seriesId && util.settings.COMBINE_NOVELS) {
        book.bookUrl = novel.detailedUrl = urlSeriesUrl(novel.seriesId);
        book.tocUrl = novel.catalogUrl = urlIP(urlSeriesDetailed(novel.seriesId));
    } else {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id);
        book.tocUrl = novel.catalogUrl = urlIP(urlNovelDetailed(novel.id));
    }
    return novel
}

(() => {
    return novelHandler(util.getNovelRespFirst(result).body)
})()