var util = objParse(String(java.get("util")))
var seriesSet = new Set();  // 存储seriesID

function isFunctionString(v) {
    return typeof v == "string" && (
        v.trim().startsWith("function") ||
        RegExp(/^\s*(\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/).test(v)
    )
}

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

/**
 * @params arr 传入的源数组
 * @params length 需要获取的元素的个数
 */
function randomChoseArrayItem(arr, length) {
    let copyArr = JSON.parse(JSON.stringify(arr))
    let newArr = [];
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * copyArr.length);
        let item = copyArr[index];
        newArr.push(item)
        copyArr.splice(index, 1)
    }
    return newArr.reverse()
}


function handlerRecommendUsers() {
    const MAX_FETCH_USER_NUMBER = 2;

    return () => {
        let userIds = JSON.parse(result).map(i => i.id)
        // java.log(`用户id个数:${userIds.length}`)
        if (userIds.length > MAX_FETCH_USER_NUMBER) {
            userIds = randomChoseArrayItem(userIds, MAX_FETCH_USER_NUMBER);
        }
        // java.log(`查询的用户Ids:${userIds}`)
        let usersInfo = getWebviewJson(urlUsersDetailed(userIds))
        // java.log(`返回的${JSON.stringify(usersInfo)}`)
        let queryNovelIds = []
        // java.log(`${JSON.stringify(usersInfo)}`)
        usersInfo.filter(user => user.novels && user.novels.length > 0)
            .map(user => user.novels)
            // 将list展平[1,2,3]变为1,2,3 添加到novelList中
            .forEach(novels => {
                novels.forEach(novel => {
                    queryNovelIds.push(novel)
                })
            })
        // 暂时限制最大获取数量
        if (queryNovelIds.length > 10) {
            queryNovelIds = randomChoseArrayItem(queryNovelIds, 10)
        }
        novelList = getWebviewJson(urlNovelsDetailed(queryNovelIds))
        return util.formatNovels(util.handNovels(util.combineNovels(novelList)))
    }
}

function handlerFollowLatest() {
    return () => {
        let resp = JSON.parse(result)
        return util.formatNovels(util.handNovels(util.combineNovels(resp)))
    }
}

function handlerRegexNovels() {
    return () => {
        let result = java.webView(null, "https://furrynovel.ink", null)
        let name = result.match(RegExp('<div class=" font-bold text-xl line-clamp-1">(.*?)</div>'))[1]
        let resp = getAjaxJson(urlSearchNovel(name))
        if (resp.total !== undefined) {
            return util.formatNovels(util.handNovels(util.combineNovels(resp.novels)))
        }
        return []
    }
}

function handlerFactory() {
    if (baseUrl.includes("https://cdn.jsdelivr.net")) {
        return () => {updateSource(); return []}
    }
    if (baseUrl.includes("/fav/user")) {
        return handlerRecommendUsers()
    }
    if (baseUrl.includes("/pixiv/novels/recent")) {
        return handlerFollowLatest()
    }
    if (baseUrl.includes("https://furrynovel.ink")) {
        return handlerRegexNovels()
    }
    else {
        return () => {startBrowser(baseUrl, ""); return []}
    }
}

(() => {
    return handlerFactory()()
})()