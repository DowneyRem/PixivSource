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

var first = true;
// 存储seriesID
var seriesSet = {
    keywords: "Pixiv:Search",
    has: (value) => {
        let page = Number(java.get("page"))
        if (page === 1 && first) {
            first = false
            cache.deleteMemory(this.keywords)
            return false
        }

        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            return false
        }
        let set = new Set(JSON.parse(v))
        return set.has(value)
    },

    add: (value) => {
        let v = cache.getFromMemory(this.keywords)
        if (v === undefined || v === null) {
            cache.putMemory(this.keywords, JSON.stringify([value]))

        } else {
            let arr = JSON.parse(v)
            if (typeof arr === "string") {
                arr = Array(arr)
            }
            arr.push(value)
            cache.putMemory(this.keywords, JSON.stringify(arr))
        }
    },
};

function isLogin() {
    let cookie = String(java.getCookie("https://www.pixiv.net/", null))
    return typeof cookie === "string" && cookie !== ""
}

function getUserNovels() {
    if (!isLogin()) {
        return []
    }

    let username = String(java.get("key"))
    let html = java.ajax(util.urlSearchUser(username))
    // java.log(html)
    // 仅匹配有投稿作品的用户
    let match = html.match(new RegExp(`"userIds":\\[(?:(?:\\d+,?)+)]`))
    // java.log(JSON.stringify(match))
    if (match === null || match.length === 0) {
        return []
    }

    match = JSON.stringify(match).replace("\\","").split(",")
    // java.log(JSON.stringify(match))
    let regNumber = new RegExp("\\d+")
    let uidList = match.map(v => {
        return v.match(regNumber)[0]
    })

    // 仅限3个作者
    java.log(JSON.stringify(uidList))
    if (uidList.length >= 3) {
        uidList.length = 3
    }

    let novels = []
    let page = Number(java.get("page"))

    uidList.forEach(id => {
        // 获取系列小说
        let resp = util.getAjaxJson(util.urlUserAllWorks(id))
        // java.log(util.urlUserAllWorks(id))
        if (resp.error === true) {
            return []
        }
        // resp.body.novelSeries.forEach(novel =>{
        //     novel.isOneshot = false
        //     novel.createDate = novel.createDateTime
        //     novel.updateDate = novel.updateDateTime
        // })
        // novels = novels.concat(resp.body.novelSeries)

        // 获取单篇小说
        let novelsId = Object.keys(resp.body.novels).reverse().slice((page - 1) * 20, page * 20)
        let url = util.urlNovelsDetailed(id, novelsId)
        util.debugFunc(() => {
            java.log(`发送获取作者小说的Ajax请求:${url}`)
        })
        let userNovels = util.getWebviewJson(url, html => {
            return (html.match(new RegExp(">\\{.*?}<"))[0].replace(">", "").replace("<", ""))
        }).body
        // let userNovels = util.getAjaxJson(url).body
        // 获取对应的小说 该序列是按照id排序
        // 反转以按照更新时间排序
        novels = novels.concat(Object.values(userNovels).reverse())
    })

    util.debugFunc(() => {
        java.log(`获取用户搜索小说结束`)
    })
    return novels
}

function getSeries(){
    let MAXPAGES = 3, novels = []
    let seriesName = String(java.get("key"))
    java.log(util.urlSearchSeries(seriesName, 1))
    let resp = util.getAjaxJson(util.urlSearchSeries(seriesName, 1))
    if (resp.error === true) {
        return []
    }
    novels = novels.concat(resp.body.novel.data)
    for (let i = Number(java.get("page")) + 1; i < resp.body.novel.lastPage, i < MAXPAGES; i++) {
        java.log(`页面：${i}`)
        let resp = util.getAjaxJson(util.urlSearchSeries(seriesName, i))
        if (resp.error === true) {
            return []
        }
        novels = novels.concat(resp.body.novel.data)
    }
    return novels
}

function getNovels(){
    if (JSON.parse(result).error !== true){
        return JSON.parse(result).body.novel.data
    } else {
        return []
    }
}

function getLinkNovels() {
    try {
        return util.getNovelRes(String(java.get("key")))
    } catch (e) {
        return []
    }
}

(() => {
    let novels = []
    novels = novels.concat(getNovels())
    novels = novels.concat(getSeries())
    novels = novels.concat(getUserNovels())
    novels = novels.concat(getLinkNovels())
    // java.log(JSON.stringify(novels))
    // 返回空列表中止流程
    if (novels.length === 0) {
        return []
    }
    return util.formatNovels(util.handNovels(util.combineNovels(novels)))
})();