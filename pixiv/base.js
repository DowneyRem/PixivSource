var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}

    u.cacheGetAndSet = (key, supplyFunc) => {
        let v = cache.get(key)
        if (v === undefined || v === null) {
            v = JSON.stringify(supplyFunc())
            // 缓存10分钟
            cache.put(key, v, 600)
        }
        return JSON.parse(v)
    }
    u.getAjaxJson = (url) => {
        return util.cacheGetAndSet(url, () => {
            return JSON.parse(java.ajax(url))
        })
    }
    u.getWebviewJson = (url, parseFunc) => {
        return util.cacheGetAndSet(url, () => {
            let html = java.webView(null, url, null)
            return JSON.parse(parseFunc(html))
        })
    }
    u.debugFunc = (func) => {
        if (String(source.getVariable()) === "debug") {
            func()
        }
    }

    u.urlNovelDetailed = (nid) => {
        return `https://www.pixiv.net/ajax/novel/${nid}`
    }
    u.urlSeries = (seriesId) => {
        return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`
    }
    u.urlSeriesNovels = (seriesId, limit, offset) => {
        if (limit > 30) {
            limit = 30
        }

        if (limit < 10) {
            limit = 10
        }

        return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`
    }
    u.searchNovel = (novelName, page) =>{
        return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
    }
    // 完全匹配用户名
    u.urlSearchUser = (username) => {
        return `https://www.pixiv.net/search_user.php?s_mode=s_usr&nick=${encodeURI(username)}&nick_mf=1`
        // return `https://www.pixiv.net/search_user.php?nick=${encodeURI(username)}&s_mode=s_usr`
        // return `https://www.pixiv.net/search/users?nick=${encodeURI(username)}&s_mode=s_usr`
    }
    u.urlUserAllWorks = (uesrId) => {
        return `https://www.pixiv.net/ajax/user/${uesrId}/profile/all?lang=zh`
    }
    u.urlUserNovels = (nid, nidList) => {
        return `https://www.pixiv.net/ajax/user/${nid}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
    }

    u.urlIllustDetailed = (illustId) => {
        return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
    }
    u.urlSeriesIllusts = (seriesId) => {
        return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
    }
    u.urlCoverUrl = (url) => {
        return `${url},{"headers": {"Referer":"https://www.pixiv.net/"}}`
    }
    u.urlIllustOriginal = function (illustId, order) {
        let illustOriginal = util.getAjaxJson(util.urlIllustDetailed(illustId)).body.urls.original
        if (order >= 1) {
            illustOriginal = illustOriginal.replace(`_p0`, `_p${order - 1}`)
        }
        return illustOriginal
        }

    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.detailedUrl = util.urlNovelDetailed(novel.id)
            const time = this.dateFormat(novel.updateDate);
            novel.tags = novel.tags.join(",")
            novel.coverUrl = util.urlCoverUrl(novel.url)
            novel.description += `\n更新时间:${time}`
        })
        return novels
    }

    u.dateFormat = function (str) {
        let addZero = function (num) {
            return num < 10 ? '0' + num : num;
        }

        let time = new Date(str);
        let Y = time.getFullYear() + "年";
        let M = addZero(time.getMonth() + 1) + "月";
        let D = addZero(time.getDate()) + "日";
        return Y + M + D;
    }


    util = u
    java.put("util", objStringify(u))
}

publicFunc()

// 获取请求的user id方便其他ajax请求构造
let uid = java.getResponse().headers().get("x-userid")
if (uid != null) {
    cache.put("pixiv:uid", uid)
}
java.getStrResponse(null, null)