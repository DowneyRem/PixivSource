var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function urlNovel(novelId){
    if (util.settings.SHOW_ORIGINAL_LINK) {
        return urlNovelUrl(novelId)
    } else {
        return urlNovelDetailed(novelId)
    }
}

function oneShotHandler(res) {
    res.textCount = res.userNovels[`${res.id}`].textCount
    res.createDate = timeTextFormat(res.createDate)
    return [{
        title: res.title.trim(),
        chapterUrl: urlIP(urlNovel(res.id)),
        chapterInfo: `${res.createDate}　　${res.textCount}字`
    }]
}

function seriesHandler(res) {
    const limit = 30
    let returnList = [], novelIds = []
    let seriesID = res.id, allChaptersCount = res.total
    util.debugFunc(() => {
        java.log(`本系列 ${seriesID} 一共有${allChaptersCount}章`)
    })

    //发送请求获得相应数量的目录列表
    function sendAjaxForGetChapters(lastIndex) {
        let resp = getAjaxJson(urlIP(urlSeriesNovels(seriesID, limit, lastIndex)), true)
        let novels = resp.body.thumbnails.novel
        // let novels = resp.body.page.seriesContents

        novels.forEach((v, i) => {
            novelIds.push(v.id)
            v.chapterUrl = urlIP(urlNovel(v.id))
            v.title = v.title.trim()
            if (util.settings.ADD_CHAPTER_INDEX) v.title = "第"+ (i+1) +"章 " + v.title
            if (v.updateDate && v.textCount) {
                v.updateDate = timeTextFormat(v.createDate)
                v.chapterInfo = `${v.updateDate}　　${v.textCount}字`
            }

            util.debugFunc(() => {
                java.log(`${v.title}`)
            })
        })
        return novels
    }

    if (!util.settings.SHOW_UPDATE_TIME) {
        returnList = getAjaxJson(urlIP(urlSeriesNovelsTitles(seriesID)), true).body
        returnList.forEach((v, i) => {
            novelIds.push(v.id)
            v.chapterUrl = urlIP(urlNovel(v.id))
            v.title = v.title.trim()
            if (util.settings.ADD_CHAPTER_INDEX) v.title = "第"+ (i+1) +"章 " + v.title

            util.debugFunc(() => {
                java.log(`${v.title}`)
            })
        })
    } else {
        //逻辑控制者 也就是使用上面定义的两个函数来做对应功能
        //要爬取的总次数
        let max = Math.ceil(allChaptersCount / limit)
        for (let i = 0; i < max; i++) {
            //java.log("i的值:"+i)
            let list = sendAjaxForGetChapters(i * limit)
            //取出每个值
            returnList = returnList.concat(list)
        }
    }
    putInCacheObject(`novelIds${seriesID}`, novelIds, cacheSaveSeconds)
    // java.log(JSON.stringify(returnList))
    return returnList
}

(() => {
    let res = util.getNovelRespSeries(result).body
    if (res.firstNovelId === undefined || res.seriesNavData === null) {
        return oneShotHandler(res)
    } else {
        return seriesHandler(res)
    }
})()