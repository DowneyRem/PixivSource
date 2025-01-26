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
        settings = String(source.variableComment).match(RegExp(/{([\s\S]*?)}/gm))
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
    u.getWebviewJson = (url) => {
        return util.cacheGetAndSet(url, () => {
            let html = java.webView(null, url, null)
            return JSON.parse((html.match(new RegExp(">\\[{.*?}]<"))[0].replace(">", "").replace("<", "")))
        })
    }

    u.urlNovelUrl = (novelId) => {
        return `https://furrynovel.ink/pixiv/novel/${novelId}/cache`
    }
    u.urlNovelDetailed = (novelId) => {
        return `https://api.furrynovel.ink/pixiv/novel/${novelId}/cache`
    }
    u.urlNovelsDetailed = (nidList) => {
        return `https://api.furrynovel.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
    }
    u.urlNovelComments = (novelId) => {
        return `https://api.furrynovel.ink/pixiv/novel/${novelId}/comments`
    }
    u.urlNovel = (novelId) => {
        if (util.SHOW_ORIGINAL_NOVEL_LINK) {
            return util.urlNovelUrl(novelId)
        } else {
            return util.urlNovelDetailed(novelId)
        }
    }

    // u.urlSeriesUrl = function (id) {
    //     return `https://furrynovel.ink/pixiv/series/${id}/cache`
    // }
    u.urlSeriesUrl = (seriesId) => {
        return `https://www.pixiv.net/novel/series/${seriesId}`
    }
    u.urlSeriesDetailed = (seriesId) => {
        return `https://api.furrynovel.ink/pixiv/series/${seriesId}/cache`
    }
    u.urlSeries = (seriesId) => {
        if (util.SHOW_ORIGINAL_NOVEL_LINK) {
            return util.urlSeriesUrl(seriesId)
        } else {
            return util.urlSeriesDetailed(seriesId)
        }
    }

    u.urlUserUrl = (userId) => {
        return `https://furrynovel.ink/pixiv/user/${userId}/cache`
    }
    u.urlUserDetailed = (userId) => {
        return `https://api.furrynovel.ink/pixiv/user/${userId}/cache`
    }
    u.urlUsersDetailed = (uidList) => {
        return `https://api.furrynovel.ink/pixiv/users/cache?${uidList.map(v => "ids[]=" + v).join("&")}`
    }

    u.urlSearchNovel = (novelName) => {
        return `https://api.furrynovel.ink/pixiv/search/novel/${novelName}/cache`
    }
    u.urlSearchUsers = (userName) => {
        return `https://api.furrynovel.ink/pixiv/search/user/${userName}/cache`
    }

    u.urlCoverUrl = (pxImgUrl) => {
        return `https://pximg.furrynovel.ink/?url=${pxImgUrl}&w=800`
    }
    // u.urlIllustUrl = function (illustId) {
    //     return `https://www.pixiv.net/artworks/${illustId}`
    // }
    u.urlIllustOriginal = (illustId, order) => {
        // 使用 pixiv.cat 获取插图
        let illustOriginal = `https://pixiv.re/${illustId}.png`
        // let illustOriginal = `https://pixiv.nl/${illustId}.png`
        if (order >= 1) {
            illustOriginal = `https://pixiv.re/${illustId}-${order}.png`
            // illustOriginal = `https://pixiv.nl/${illustId}-${order}.png`
        }
        return illustOriginal
    }

    // 将多个长篇小说解析为一本书
    u.combineNovels = function(novels) {
        return novels.filter(novel => {
            // 单本直接解析为一本书，需要判断是否为 null
            if (novel.seriesId === undefined || novel.seriesId === null) {
                return true
            }
            //集合中没有该系列解析为一本书
            if (!seriesSet.has(novel.seriesId)) {
                seriesSet.add(novel.seriesId)
                return true
            }
            return false
        })
    }

    // 处理 novels 列表
    u.handNovels = function (novels){
        novels.forEach(novel => {
            if (novel.tags === undefined) {
                novel.tags = []
            }
            // novel.id = novel.id
            // novel.title = novel.title
            // novel.userName = novel.userName
            if (novel.seriesId === undefined || novel.seriesId === null) {
                // novel.tags = novel.tags
                novel.tags.unshift("单本")
                novel.textCount = novel.length
                novel.latestChapter = novel.title
                novel.description = novel.desc
                // novel.coverUrl = novel.coverUrl
                novel.detailedUrl = util.urlNovel(novel.id)

            } else {
                java.log(`正在获取系列小说：${novel.seriesId}`)
                let series = util.getAjaxJson(util.urlSeriesDetailed(novel.seriesId))
                novel.id = series.novels[0].id
                novel.title = novel.seriesTitle
                novel.tags = series.tags
                // novel.tags = novel.tags.concat(series.tags)
                novel.tags = novel.tags.concat(series.novels[0].tags)
                novel.tags.unshift("长篇")
                novel.tags = Array.from(new Set(novel.tags))
                novel.textCount = null  // 无数据
                novel.createDate = null  // 无数据
                novel.latestChapter = series.novels[series.novels.length-1].title
                novel.description = series.caption
                // 后端目前没有系列的 coverUrl 字段
                // novel.coverUrl = series.coverUrl
                novel.coverUrl = series.novels[0].coverUrl
                novel.detailedUrl = util.urlNovel(novel.id)
                // novel.detailedUrl = util.urlSeries(novel.id)

                if (series.caption === "") {
                    let firstNovel = util.getAjaxJson(util.urlNovelDetailed(novel.id))
                    novel.createDate = firstNovel.createDate
                    if (firstNovel.length > 0) {
                        novel.description = firstNovel[0].desc
                    } else {
                        novel.description = "该小说可能部分章节因为权限或者被删除无法查看"
                    }
                }
            }
        })
        return novels
    }

    // 小说信息格式化
    u.formatNovels = function (novels) {
        novels.forEach(novel => {
            novel.title = novel.title.replace(RegExp(/^\s+|\s+$/g), "")
            novel.tags = novel.tags.join(",")
            novel.coverUrl = util.urlCoverUrl(novel.coverUrl)
            // novel.readingTime = `${novel.readingTime / 60} 分钟`
            novel.createDate = util.dateFormat(novel.createDate);
            // novel.updateDate = this.dateFormat(novel.updateDate);
            if (util.MORE_INFO_IN_DESCRIPTION) {
                novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
            } else {
                novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
            }
        })
        return novels
    }

    // 从网址获取id，返回单篇小说 res，系列返回首篇小说 res
    u.getNovelRes = function (result) {
        let novelId = 0, res = {}
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
                res = util.getAjaxJson(util.urlSeriesDetailed(id))
            } else {
                let pattern = "((furrynovel\\.(ink|xyz))|pixiv\\.net)/(pn|(pixiv/)?novel)/(show\\.php\\?id=)?\\d+"
                let isNovel = baseUrl.match(new RegExp(pattern))
                if (isNovel) {
                    novelId = id
                }
            }
        } else {
            res = JSON.parse(result)
        }
        if (res.total !== undefined && res.total !== null) {
            novelId = res.novels[0].id
        }
        if (novelId) {
            java.log(`匹配小说ID：${novelId}`)
            res = util.getAjaxJson(util.urlNovelDetailed(novelId))
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
            return []
        }
        return res
    }

    // 从网址获取id，尽可能返回系列 res，单篇小说返回小说 res
    u.getNovelResSeries = function (result) {
        let seriesId = 0, res = {}
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
        if (res.series !== undefined && res.series !== null) {
            seriesId = res.series.id
        }
        if (seriesId) {
            java.log(`系列ID：${seriesId}`)
            res = util.getAjaxJson(util.urlSeriesDetailed(seriesId))
        }
        if (res.error) {
            java.log(`无法从 Linpx 获取当前小说`)
            java.log(JSON.stringify(res))
            return []
        }
        return res
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
        if (text === undefined) {
            return ""
        }
        return `${text.slice(0, 10)} ${text.slice(11, 19)}`
    }

    util = u
    java.put("util", objStringify(u))
}

publicFunc()
java.getStrResponse(null, null)