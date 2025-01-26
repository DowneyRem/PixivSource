var util = {}

function objStringify(obj) {
    return JSON.stringify(obj, (n, v) => {
        if (typeof v == "function")
            return v.toString();
        return v;
    });
}

function publicFunc() {
    let u = {}, settings = {}
    java.log(String(source.bookSourceComment).split("\n")[0]) // 输出书源信息
    java.log(`手动更新时间：${java.timeFormat(source.lastUpdateTime)}`) // 输出书源信息
    try {
        settings = JSON.parse(String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm)))
        java.log("⚙️ 使用自定义设置")
    } catch (e) {
        settings.SHOW_ORIGINAL_NOVEL_LINK = true
        settings.REPLACE_BOOK_TITLE_MARKS = true
        settings.MORE_INFO_IN_DESCRIPTION = false
        settings.DEBUG = false
        java.log("⚙️ 使用默认设置（无自定义设置 或 自定义设置有误）")
    } finally {
        u.SHOW_ORIGINAL_NOVEL_LINK = settings.SHOW_ORIGINAL_NOVEL_LINK  // 目录处显示小说源链接，但会增加请求次数
        u.REPLACE_BOOK_TITLE_MARKS = settings.REPLACE_BOOK_TITLE_MARKS  // 注音内容为汉字时，替换为书名号
        u.MORE_INFO_IN_DESCRIPTION = settings.MORE_INFO_IN_DESCRIPTION  // 书籍简介显示更多信息
        u.DEBUG = settings.DEBUG // 调试模式
    }

    if (u.DEBUG === true) {
        // java.log(JSON.stringify(settings))
        // java.log(`SHOW_ORIGINAL_NOVEL_LINK = ${u.SHOW_ORIGINAL_NOVEL_LINK}`)
        // java.log(`REPLACE_BOOK_TITLE_MARKS = ${u.REPLACE_BOOK_TITLE_MARKS}`)
        // java.log(`MORE_INFO_IN_DESCRIPTION = ${u.MORE_INFO_IN_DESCRIPTION}`)
        java.log(`DEBUG = ${u.DEBUG}`)
    }


    u.debugFunc = (func) => {
        if (util.DEBUG) {
            func()
        }
    }
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

    u.urlNovelUrl = (novelId) => {
        return `https://www.pixiv.net/novel/show.php?id=${novelId}`
    }
    u.urlNovelDetailed = (novelId) => {
        return `https://www.pixiv.net/ajax/novel/${novelId}`
    }
    u.urlNovelsDetailed = (userId, nidList) => {
        return `https://www.pixiv.net/ajax/user/${userId}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlNovelComments = (novelId, offset, limit) => {
        return `https://www.pixiv.net/ajax/novels/comments/roots?novel_id=${novelId}&offset=${offset}&limit=${limit}&lang=zh`
    }
    u.urlNovelCommentsReply = (commentId, page) => {
        return `https://www.pixiv.net/ajax/novels/comments/replies?comment_id=${commentId}&page=${page}&lang=zh`
    }
    u.urlNovel = (novelId) => {
        if (util.SHOW_ORIGINAL_NOVEL_LINK) {
            return util.urlNovelUrl(novelId)
        } else {
            return util.urlNovelDetailed(novelId)
        }
    }

    u.urlSeriesUrl = (seriesId) => {
        return `https://www.pixiv.net/novel/series/${seriesId}`
    }
    u.urlSeriesDetailed = (seriesId) => {
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
    u.urlSeries = (seriesId) => {
        if (util.SHOW_ORIGINAL_NOVEL_LINK) {
            return util.urlSeriesUrl(seriesId)
        } else {
            return util.urlSeriesDetailed(seriesId)
        }
    }

    u.urlUserUrl = (userId) => {
        return `https://www.pixiv.net/users/${userId}`
    }
    u.urlUserDetailed = (userId) => {
        return `https://www.pixiv.net/ajax/user/${userId}`
    }
    u.urlUserAllWorks = (userId) => {
        return `https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=zh`
    }

    u.urlSearchNovel = (novelName, page) =>{
        return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`
    }
    u.urlSearchSeries = (seriesName, page) => {
        return`https://www.pixiv.net/ajax/search/novels/${encodeURI(seriesName)}?word=${encodeURI(seriesName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`
    }
    // 完全匹配用户名
    u.urlSearchUser = (userName) => {
        return `https://www.pixiv.net/search/users?nick=${encodeURI(userName)}&s_mode=s_usr&nick_mf=1`
    }

    u.urlCoverUrl = (url) => {
        return `${url}, {"headers": {"Referer":"https://www.pixiv.net/"}}`
    }
    u.urlIllustUrl = (illustId) => {
        return `https://www.pixiv.net/artworks/${illustId}`
    }
    u.urlIllustDetailed = (illustId) => {
        return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
    }
    u.urlIllustOriginal = (illustId, order) => {
        let illustOriginal = util.getAjaxJson(util.urlIllustDetailed(illustId)).body.urls.original
        if (order >= 1) {
            illustOriginal = illustOriginal.replace(`_p0`, `_p${order - 1}`)
        }
        return illustOriginal
    }

    u.urlSeriesIllustsUrl = (userId, seriesId) => {
        return `https://www.pixiv.net/user/${userId}/series/${seriesId}`
    }
    u.urlSeriesIllustsDetailed = (seriesId) => {
        return `https://www.pixiv.net/ajax/series/${seriesId}?p=1&lang=zh`
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function (novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            // 集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }

    // 处理 novels 列表
    u.handNovels = function (novels) {
        novels.forEach(novel => {
            // 处理正文 tag
            if (!(novel.tags instanceof Array)) {
                novel.tags = novel.tags.tags.map(item => item.tag)
                novel.updateDate = novel.uploadDate
                if (novel.seriesNavData !== null){
                    novel.seriesId = novel.seriesNavData.seriesId
                }
            }
            if (novel.tags === undefined || novel.tags === null) {
                novel.tags = []
            }
            // novel.id = novel.id
            // novel.title = novel.title
            // novel.userName = novel.userName
            if (novel.isOneshot !== undefined) { // 搜索系列
                if (novel.isOneshot === true) {
                    novel.seriesId = undefined
                    novel.id = novel.novelId  // 获取真正的 novelId
                } else {  //系列
                    novel.seriesId = novel.id  // 获取系列小说id
                    // novel.id = novel.latestEpisodeId  // 最近一篇
                }
                novel.textCount = novel.textLength
                novel.description = novel.caption
                novel.coverUrl = novel.cover.urls["480mw"]
                if (novel.createDate === undefined) {  // 兼容搜索作者获取获取系列小说
                    novel.createDate = novel.createDateTime
                    novel.updateDate = novel.updateDateTime
                }

            } else {  // 搜索作者，发现排行榜
                // novel.textCount = novel.textCount
                // novel.description = novel.description
                if (novel.coverUrl === undefined) {  // 兼容发现排行榜
                    novel.coverUrl = novel.url
                }
                // novel.createDate = novel.createDate
                // novel.updateDate = novel.updateDate
            }

            if (novel.seriesId === undefined || novel.seriesId === null) {  // 单篇
                novel.tags.unshift("单本")
                novel.latestChapter = novel.title
                novel.detailedUrl = util.urlNovel(novel.id)
            } else { // 系列
                // novel.seriesId = novel.seriesId
                let series = util.getAjaxJson(util.urlSeriesDetailed(novel.seriesId)).body
                novel.id = series.firstNovelId
                novel.title = series.title
                // novel.userName = novel.userName
                novel.tags = series.tags
                novel.textCount = series.publishedTotalCharacterCount
                // novel.lastChapter = util.getAjaxJson(util.urlNovelDetailed(series.lastNovelId)).body.title
                novel.description = series.caption
                novel.coverUrl = series.cover.urls["480mw"]
                novel.detailedUrl = util.urlSeries(novel.seriesId)

                // 发送请求获取第一章 获取标签与简介
                let firstNovel = {}
                try {
                    firstNovel = util.getAjaxJson(util.urlNovelDetailed(series.firstNovelId)).body
                    novel.tags = novel.tags.concat(firstNovel.tags.tags.map(item => item.tag))
                } catch (e) {  // 防止系列首篇无权限获取
                    firstNovel = util.getAjaxJson(util.urlSeriesNovels(novel.seriesId, 30, 0)).body.thumbnails.novel[0]
                    novel.id = novel.firstNovel.id = firstNovel.id
                    novel.tags = novel.tags.concat(firstNovel.tags)
                }
                novel.tags.unshift("长篇")
                novel.tags = Array.from(new Set(novel.tags))
                if (novel.description === "") {
                    novel.description = firstNovel.description
                }
            }
        })
        util.debugFunc(() => {
            java.log(`处理小说完成`)
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            novel.tags = novel.tags.join(",")
            novel.coverUrl = this.urlCoverUrl(novel.coverUrl)
            novel.readingTime = `${novel.readingTime / 60} 分钟`
            novel.createDate = this.dateFormat(novel.createDate);
            novel.updateDate = this.dateFormat(novel.updateDate);
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n更新：${novel.updateDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}\n更新时间：${novel.updateDate}`
            }
        })
        return novels
    }

    // 正文，搜索：从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    u.getNovelRes = function (result) {
        let novelId = 0, seriesId = 0, res = {}
        // 兼容搜索直接输入链接
        pattern = "(https?://)?(api\\.|www\\.)?((furrynovel\\.(ink|xyz))|pixiv\\.net)(/ajax)?/(pn|(pixiv/)?novel)/(show\\.php\\?id=|series/)?\\d+(/cache)?"
        // pattern = String(bookSourceUrl).replace(".*", "")
        if (RegExp(pattern).test(result) && !(result.startsWith("<!DOCTYPE html>"))) {
            baseUrl = result.match(RegExp(pattern))[0]
            result = "<!DOCTYPE html>"
            java.log(`匹配链接：${baseUrl}`)
        }

        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                java.log(`系列ID：${id}`)
                seriesId = id
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    res = util.getAjaxJson(util.urlNovelDetailed(id))
                    novelId = id
                }
            }
        } else {
            res = JSON.parse(result)
        }

        if (res.body !== undefined && res.body.firstNovelId !== undefined && res.body.firstNovelId !== null) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {  // 防止系列首篇无权限获取
            res = util.getAjaxJson(util.urlSeriesNovels(seriesId, 30, 0))
            res.body = res.body.thumbnails.novel[0]
            novelId = res.body.id
        }
        java.log(`匹配小说ID：${novelId}`)
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
            return {}
        }
        return res.body
    }

    // 详情、目录：从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function (result) {
        let seriesId = 0, res = {}
        // 兼容详情，添加网址直接输入链接
        // pixiv 默认分享信息中有 # 号，不会被识别成链接，无法使用添加网址
        // baseUrl = baseUrl.replace("#", "%23")
        pattern = "(https?://)?(api\\.|www\\.)?((furrynovel\\.(ink|xyz))|pixiv\\.net)(/ajax)?/(pn|(pixiv/)?novel)/(show\\.php\\?id=|series/)?\\d+(/cache)?"
        // pattern = String(bookSourceUrl).replace(".*", "")
        if (!(result.startsWith("<!DOCTYPE html>")) && JSON.parse(result).error === true && RegExp(pattern).test(baseUrl)) {
            baseUrl = baseUrl.match(RegExp(pattern))[0]
            result = "<!DOCTYPE html>"
            java.log(`匹配链接：${baseUrl}`)
        }

        let isHtml = result.startsWith("<!DOCTYPE html>")
        if (isHtml) {
            let id = baseUrl.match(new RegExp("\\d+"))[0]
            let pattern = "(https?://)?(www\\.)?pixiv\\.net(/ajax)?/novel/(series/)?\\d+"
            let isSeries = baseUrl.match(new RegExp(pattern))
            if (isSeries) {
                seriesId = id
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    java.log(`匹配小说ID：${id}`)
                    res = util.getAjaxJson(util.urlNovelDetailed(id))
                }
            }
        } else {
            res = JSON.parse(result)
        }
        if (res.body !== undefined && res.body.seriesNavData !== undefined && res.body.seriesNavData !== null) {
            seriesId = res.body.seriesNavData.seriesId
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = util.getAjaxJson(util.urlSeriesDetailed(seriesId))
        }
        if (res.error === true) {
            java.log(`无法从 Pixiv 获取当前小说`)
            java.log(JSON.stringify(res))
        }
        return res.body
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
    u.timeTextFormat = function (text) {
        return `${text.slice(0, 10)} ${text.slice(11, 19)}`
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