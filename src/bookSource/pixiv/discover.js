var util = objParse(String(java.get("util")))
var seriesSet = new Set();  // 存储seriesID 有BUG无法处理翻页

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function handlerFactory() {
    if (baseUrl.includes("https://cdn.jsdelivr.net")) {
        return () => {updateSource(); return []}
    }
    if (!baseUrl.includes("www.pixiv.net")) {
        return () => {startBrowser(baseUrl, ""); return []}
    }

    if (baseUrl.includes("/bookmark")) {
        return handlerBookMarks()
    }
    if (baseUrl.includes("/top")) {
        return handlerRecommend()
    }
    if (baseUrl.includes("/follow_latest")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/watch_list")) {
        return handlerWatchList()
    }
    if (baseUrl.includes("/genre")) {
        return handlerWatchList()
    }
    if (baseUrl.includes("/discovery")) {
        return handlerDiscovery()
    }
    if (baseUrl.includes("/new")) {
        return handlerDiscovery()
    }
    if (baseUrl.includes("/commission/")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/user_event/portal")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/editors_picks")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("/ranking")) {
        return handlerRanking()
    }
    if (baseUrl.includes("/search/novels")) {
        return handlerSearch()
    }
    if (baseUrl.includes("/street/for_you")) {
        return handlerHome()
    }
    // 正则匹配网址内容
    if (baseUrl.includes("/marker_all")) {
        return handlerRankingOld()
    }
}


// 推荐小说
function handlerRecommend() {
    return () => {
        let resp = JSON.parse(result)
        const recommend = resp.body.page.recommend
        const novels = resp.body.thumbnails.novel
        let nidSet = new Set(recommend.ids)
        // java.log(nidSet.size)
        let list = novels.filter(novel => nidSet.has(String(novel.id)))
        // java.log(`过滤结果:${JSON.stringify(list)}`)
        return util.formatNovels(util.handNovels(util.combineNovels(list)))
    }
}

// 收藏小说，他人收藏
function handlerBookMarks() {
    return () => {
        let resp = JSON.parse(result).body.works
        if (resp === undefined || resp.length === 0) {
            //流程无法本环节中止 只能交给下一流程处理
            return []
        }
        return util.formatNovels(util.handNovels(resp))
    }
}

//关注作者，小说委托，小说企划，编辑部推荐
function handlerFollowLatest() {
    return () => {
        let resp = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(resp.body.thumbnails.novel)))
    }
}

//推荐小说，最近小说
function handlerDiscovery() {
    return () => {
        let resp = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(resp.body.novels)))
    }
}

// 搜索标签
function handlerSearch() {
    return () => {
        let resp = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(resp.body.novel.data)))
    }
}

// 追更列表，热门分类
function handlerWatchList() {
    return () => {
        let resp = JSON.parse(result)
        return util.formatNovels(util.handNovels(resp.body.thumbnails.novelSeries))
    }
}

// 排行榜
function handlerRanking() {
    return () => {
        try {
            let resp = JSON.parse(result)
            return util.formatNovels(util.handNovels(resp.body.display_a.rank_a))
        } catch (e) {
            return []
        }
    }
}

// 首页
function handlerHome() {
    return () => {
        let resp = JSON.parse(result)
        let novels = resp.body.contents
            .filter(item => item.kind === "novel")
            .flatMap(item => {
                return item.thumbnails.map(novel => {
                    novel.tags = novel.tags.map(tag => tag.name)
                    return novel
                })
            })
        // novels.forEach(novel => novel.tags = novel.tags.map(tag => tag.name))
        // java.log(JSON.stringify(novels))
        return util.formatNovels(util.handNovels(util.combineNovels(novels)))
    }
}

// 书签，顺序相同
function handlerRankingOld() {
    if (globalThis.environment.IS_LEGADO) return handlerRankingAjaxAll()
    // else if (globalThis.environment.IS_SOURCE_READ) return handlerRankingWebview()
    else if (globalThis.environment.IS_SOURCE_READ) return handlerRankingAjax()
    else return []
}

// 书签，顺序相同
function handlerRankingAjaxAll() {
    return () => {
        let  novelIds = [], novelUrls = []
        // let result = result + java.ajax(`${baseUrl}&p=2`)  // 正则获取网址中的 novelId
        let matched = result.match(RegExp(/\/novel\/show\.php\?id=\d{5,}/gm))
        for (let i in matched) {
            let novelId = matched[i].match(RegExp(/\d{5,}/))[0]
            if (novelIds.indexOf(novelId) === -1) {
                novelIds.push(novelId)
                novelUrls.push(urlNovelDetailed(novelId))
            }
        }
        // java.log(JSON.stringify(novelIds))
        let novels = getAjaxAllJson(novelUrls).map(resp => resp.body)
        return util.formatNovels(util.handNovels(util.combineNovels(novels)))
    }
}

// 书签
function handlerRankingWebview() {
    return () => {
        let novelIds = []  // 正则获取网址中的 novelId
        // let result = result + java.ajax(`${baseUrl}&p=2`)  // 正则获取网址中的 novelId
        let matched = result.match(RegExp(/\/novel\/show\.php\?id=\d{5,}/gm))
        for (let i in matched) {
            let novelId = matched[i].match(RegExp(/\d{5,}/))[0]
            if (novelIds.indexOf(novelId) === -1) {
                novelIds.push(novelId)
            }
        }
        // java.log(JSON.stringify(novelIds))
        let userNovels = getWebviewJson(
            urlNovelsDetailed(getFromCache("pixivUid"), novelIds), html => {
                return (html.match(new RegExp(">\\{.*?}<"))[0].replace(">", "").replace("<", ""))
            }).body
        return util.formatNovels(util.handNovels(util.combineNovels(Object.values(userNovels))))
    }
}

// 书签，顺序相同
function handlerRankingAjax() {
    return () => {
        let novels = [], novelIds = []
        // let result = result + java.ajax(`${baseUrl}&p=2`)  // 正则获取网址中的 novelId
        let matched = result.match(RegExp(/\/novel\/show\.php\?id=\d{5,}/gm))
        for (let i in matched) {
            let novelId = matched[i].match(RegExp(/\d{5,}/))[0]
            if (novelIds.indexOf(novelId) === -1) {
                novelIds.push(novelId)
                // java.log(urlNovelDetailed(novelId))
                let resp = getAjaxJson(urlNovelDetailed(novelId))
                if (resp.error !== true) {
                    novels.push(resp.body)
                } else {
                    java.log(JSON.stringify(resp))
                }
            }
        }
        return util.formatNovels(util.handNovels(util.combineNovels(novels)))
    }
}

(() => {
    return handlerFactory()()
})()