@js:
var util = objParse(String(java.get("util")))

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (typeof v == "string" && v.match("()")) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function oneShotHandler(res) {
    res.textCount = res.userNovels[`${res.id}`].textCount
    res.createDate = util.timeTextFormat(res.createDate)
    return [{
        title: res.title.replace(RegExp(/^\s+|\s+$/g), ""),
        chapterUrl: util.urlNovel(res.id),
        chapterInfo: `${res.createDate}　　${res.textCount}字`
    }]
}

function seriesHandler(res) {
    const limit = 30
    let returnList = []
    let seriesID = 0, allChaptersCount = 0
    if (res.seriesNavData !== undefined) {
        seriesID = res.seriesNavData.seriesId
        allChaptersCount = util.getAjaxJson(util.urlSeriesDetailed(seriesID)).body.total
    } else {
        seriesID = res.id
        allChaptersCount = res.total
    }
    util.debugFunc(() => {
        java.log(`本系列 ${seriesID} 一共有${allChaptersCount}章`);
    })

    //发送请求获得相应数量的目录列表
    function sendAjaxForGetChapters(lastIndex) {
        res = util.getAjaxJson(util.urlSeriesNovels(seriesID, limit, lastIndex)).body.thumbnails.novel
        res.forEach(v => {
            v.title = v.title.replace(RegExp(/^\s+|\s+$/g), "").replace(RegExp(/（|）|-/g), "")
            v.chapterUrl = util.urlNovel(v.id)
            v.updateDate = util.timeTextFormat(v.createDate)
            v.chapterInfo = `${v.updateDate}　　${v.textCount}字`
            util.debugFunc(() => {
                java.log(`${v.title}`)
            })
        })
        return res;
    }

    //逻辑控制者 也就是使用上面定义的两个函数来做对应功能
    //要爬取的总次数
    let max = (allChaptersCount / limit) + 1
    for (let i = 0; i < max; i++) {
        //java.log("i的值:"+i)
        let list = sendAjaxForGetChapters(i * limit);
        //取出每个值
        returnList = returnList.concat(list)
        // java.log(JSON.stringify(returnList))
    }
    return returnList
}

(function (res) {
    res = util.getNovelResSeries(result)
    if (res.firstNovelId !== undefined || res.seriesNavData !== null) {
        return seriesHandler(res)
    } else {
        return oneShotHandler(res)
    }
})()