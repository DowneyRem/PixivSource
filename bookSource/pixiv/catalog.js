var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
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
        java.log(`本系列 ${seriesID} 一共有${allChaptersCount}章`);
    })

    //发送请求获得相应数量的目录列表
    function sendAjaxForGetChapters(lastIndex) {
        resp = getAjaxJson(urlIP(urlSeriesNovels(seriesID, limit, lastIndex)), true)
        res = resp.body.thumbnails.novel
        // res = resp.body.page.seriesContents
        res.forEach(v => {
            v.title = v.title.trim()
            v.chapterUrl = urlIP(urlNovel(v.id))
            novelIds.push(v.id)
            if (v.updateDate !== undefined) {
                v.updateDate = timeTextFormat(v.createDate)
                v.chapterInfo = `${v.updateDate}　　${v.textCount}字`
            } else {
                v.updateDate = java.timeFormat(v.uploadTimestamp)
                v.chapterInfo = `${v.updateDate}　　${v.textLength}字`
            }
        })
        return res;
    }

    sendAjaxForGetChapters = profile("sendAjaxForGetChapters", sendAjaxForGetChapters);

    if (!util.settings.SHOW_UPDATE_TIME) {
        returnList = getAjaxJson(urlIP(urlSeriesNovelsTitles(seriesID)), true).body
        returnList.forEach(v => {
            v.title = v.title.trim()
            v.chapterUrl = urlIP(urlNovel(v.id))
            novelIds.push(v.id)
        })
    } else {
        //逻辑控制者 也就是使用上面定义的两个函数来做对应功能
        //要爬取的总次数
        let max = Math.ceil(allChaptersCount / limit)
        for (let i = 0; i < max; i++) {
            //java.log("i的值:"+i)
            let list = sendAjaxForGetChapters(i * limit);
            //取出每个值
            returnList = returnList.concat(list)
        }
    }
    // 放入小说信息以便登陆界面使用
    let novel = source.getLoginInfoMap()
    if (novel === undefined) novel = getFromCacheObject("novel")
    novel.novelIds = novelIds
    putInCacheObject(`novelIds${seriesID}`, novelIds, cacheSaveSeconds)
    // java.log(JSON.stringify(returnList))
    source.putLoginInfo(JSON.stringify(novel))
    putInCacheObject("novel", novel)
    return returnList
}

oneShotHandler = profile("oneShotHandler", oneShotHandler);
seriesHandler = profile("seriesHandler", seriesHandler);


(function (res) {
    res = util.getNovelResSeries(result)
    if (res.firstNovelId === undefined || res.seriesNavData === null) {
        return oneShotHandler(res)
    } else {
        return seriesHandler(res)
    }
})()