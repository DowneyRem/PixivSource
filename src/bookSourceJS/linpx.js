/**
 * 书源配置。字段名与 BookSource 实体一致。
 * 常用可选字段包括 header（JSON 格式请求头）、loginUrl（登录页地址，WebView 登录）、
 * loginUi（表单登录，RowUi 数组，与顶层 login 函数成对）、concurrentRate、
 * enabledCookieJar 和 jsLib。enabled、customOrder 等用户态字段由应用维护。
 */
const config = {
    bookSourceUrl: "https://linpx.ink",
    bookSourceName: "🦊 Linpx JS",
    bookSourceType: 0,
    bookSourceGroup: "🔞 Pixiv,🐲 Furry",
    bookSourceComment: (() => { return `
🦊 Linpx JS 书源（单篇）（更新📆：2026/11/04）

书源版本：291
使用说明：📌阅读 T 3.26.0818 版本可用
可用功能：✅搜索✅发现✅添加网址✅订阅源
搜索小说：✅单篇❌系列✅作者✅标签
发现小说：✅推荐✅最新✅更新书源
添加网址：✅小说✅作者
订阅用法：点击订阅源打开小说，点击【添加到书架】按钮添加小说到书架
温馨提示：⚠️Linpx 搜索暂时不支持系列小说名称，添加系列小说后，无法再次通过搜索获取并更新目录

书源发布：Pixiv 书源频道 https://t.me/PixivSource
兽人阅读频道 https://t.me/FurryReading
项目地址：https://github.com/DowneyRem/PixivSource
使用教程：https://pixivsource.pages.dev/Linpx

⚙️ 书源设置：
设置：打开小说 - 菜单 - 登录 - 点击下方按钮
`.trim()
    })(),
    header: {"Referer":"https://linpx.ink/"},
    exploreUrl: (() => {
        const li = [
            {"💯 推荐": "https://api.linpx.ink/fav/user/cache"},
            {"🆕 最新": "https://api.linpx.ink/pixiv/novels/recent/cache?page={{page}}"},
            {"🔄 随便": "https://linpx.ink"},
            {"🆙 更新": "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json"},
            {"📙 书源相关 📙": ""},
            {"🏠 主页": "https://pixivsource.pages.dev"},
            {"🔰 指南": "https://pixivsource.pages.dev/Linpx"},
            {"🐞 反馈": "https://github.com/DowneyRem/PixivSource/issues"},
            {"💰 打赏": "https://pixivsource.pages.dev/Sponsor"},
        ]

        li.forEach(item => {
            item.title = Object.keys(item)[0]
            item.url = Object.values(item)[0]
            delete item[Object.keys(item)[0]]
            item.style = {
                layout_flexGrow: 1,
                layout_flexShrink: 1,
                layout_alignSelf: "auto",
                layout_wrapBefore: "false",
                layout_flexBasisPercent: item.url === "" ? 1 : -1,
            }
        })
        return li
    })(),
    bookUrlPattern: "(https?://)?(api\\.|www\\.)?(linpx\\.ink)/(pn|pu|pixiv/(novel|user))/\\d+(/cache)?",
    concurrentRate: "30/5000",
    loginUi: (() => {
        let source = [
            {"🆙 更新书源": "updateSource()" },
            {"🔰 使用指南": "startGithubReadme()" },
            {"🐞 反馈问题": "startGithubIssue()" },
        ]

        let novel = [
            {"章节名称": "" },
            {"⤴️ 分享章节": "shareFactory('novel')" },
            {"⤴️ 分享作者": "shareFactory('author')" },
            {"🅿️ 分享小说": "shareFactory('pixiv')" },
        ]

        let settings = [
            {"书源设置": "" },
            {"⚙️ 当前设置": "showSettings()" },
            {"🔧 默认设置": "setDefaultSettingsLoginUrl()" },
            {"👤 🚫 搜索作者": "editSettings('SEARCH_AUTHOR')" },

            {"🀄 🚫 繁简通搜": "editSettings('CONVERT_CHINESE')" },
            {"🚫 📖 更多简介": "editSettings('MORE_INFORMATION')" },
            {"🔗 🚫 原始链接": "editSettings('SHOW_ORIGINAL_LINK')" },

            {"📚 🚫 恢复《》": "editSettings('REPLACE_TITLE_MARKS')" },
            {"🖼️ 🚫 显示描述": "editSettings('SHOW_CAPTIONS')" },
            {"🐞 🚫 调试模式": "editSettings('DEBUG')" },

            // {"⏳ 图片解析": "editSettings('PIC_SOURCE')" },
            // {"🔗 图片链接": "editSettings('PIC_LINK')" },
            // {"↔️ 图片大小": "editSettings('PIC_SIZE')" },
        ]

        // 添加按钮
        let li = source
        // //  暂不支持或获取 book
        // try {
        //     if (book) li = li.concat(novel)
        // } catch (e) {}
        li = li.concat(novel)
        li = li.concat(settings)

        // 处理按钮
        li.forEach(item => {
            item.name = Object.keys(item)[0]
            let list = item.name.split(" ")
            if (list.length === 1 ) {
                item.type = "text"
            } else if (list.length === 2) {
                item.type = "button"
                item.action = Object.values(item)[0]
            } else {
                item.name = list[list.length - 1]
                item.type = "toggle"
                item.default = `${list[0]} `
                list.length = list.length - 1
                item.chars = list.map(char => `${char} `)
                item.action = Object.values(item)[0]
            }
            delete item[Object.keys(item)[0]]
            // 添加格式
            if (item.type === "button" || item.type === "toggle") {
                item.style = {}
                item.style.layout_flexGrow = 1
                item.style.layout_flexBasisPercent = -1
            }
        })
        return li
    })(),
    enabledCookieJar: true,
    lastUpdateTime: 0, // 版本时间戳（毫秒）；导入值较新时提示更新
};

/**
 * 登录UI v2（可选）：声明顶层 loginUi(state) 与 loginAction(action, state, form) 即启用，
 * state 由应用持有，弹窗关闭即弃。loginAction 返回命令对象：{ state } 重渲染、
 * { error: {key: 消息} } 字段红字、{ login: {...} } 持久化凭据（重开按 key 回填）、{ close: true } 关窗。
 * 行类型 text/password/label/select（options 单选）/button（countdown 秒）。
 */


const Jsoup = org.jsoup.Jsoup
const isJSBookSource = true
const bookSourceName = "linpx"

// 存储已出现的 seriesId（跨页去重）
const seriesSet = {
    key: "Linpx:Search",
    // page === 1 时清空
    resetIfNeeded(page) {
        if (Number(page) === 1) {
            cache.deleteMemory(this.key)
        }
    },

    has(value) {
        let v = cache.getFromMemory(this.key)
        if (v === undefined || v === null) return false
        let set = new Set(JSON.parse(String(v)))
        return set.has(value)
    },

    add(value) {
        let v = cache.getFromMemory(this.key)
        let arr = []
        if (v !== undefined && v !== null) {
            arr = JSON.parse(String(v))
            if (!Array.isArray(arr)) arr = [arr]
        }
        arr.push(value)
        cache.putMemory(this.key, JSON.stringify(arr))
    },
}

function logSourceInformation() {
    java.log(`${source.bookSourceComment.split("\n")[0]}`)
    java.log(`📌 ${source.bookSourceComment.split("\n")[2]}`)
    java.log(`📆 更新时间：${java.timeFormat(source.lastUpdateTime)}`)
}

/**
 * 搜索书籍。
 * @param {string} key 搜索关键词
 * @param {number} page 页码，从 1 开始
 * @returns { [{name, bookUrl, author, kind, coverUrl, intro, wordCount, latestChapterTitle, tocUrl, type}] } 书籍数组或 JSON 字符串；name、bookUrl 必填，地址用绝对 URL
 */
function search(key, page) {
    logSourceInformation()
    let novels = []
    let settings = getFromCacheObject("linpxSettings")
    seriesSet.resetIfNeeded(page)   // 第 1 页清空旧记录

    if (key.startsWith("@")) {
        key = key.slice(1)
        java.log(`👤 搜索作者：${key}`)
        novels = novels.concat(findUserNovels(key, page))
    } else if (key.startsWith("#")) {
        key = key.slice(1)
        java.log(`#️⃣ 搜索标签：${key}`)
        novels = novels.concat(getNovels(key, page))
        if (settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels(key, page))
    } else {
        java.log(`🔍 搜索内容：${key}`)
        novels = novels.concat(getNovels(key, page))
        if (settings.SEARCH_AUTHOR) novels = novels.concat(findUserNovels(key, page))
        if (settings.CONVERT_CHINESE) novels = novels.concat(getConvertNovels(key, page))
    }
    if (novels.length === 0) return []
    return formatNovels(handNovels(combineNovels(novels)))
}

function getNovels(key, page) {
    let resp = getAjaxJson(urlSearchNovel(key, page))
    java.log(urlSearchNovel(key, page))
    if (resp.error || resp.total === 0) return []
    return resp.novels
}

function getConvertNovels(key, page=1) {
    let novels = []
    let key1 = String(java.s2t(key))
    let key2 = String(java.t2s(key))
    if (key1 !== key) novels = novels.concat(getNovels(key1, page))
    if (key2 !== key) novels = novels.concat(getNovels(key2, page))
    return novels
}

function getUser(username, exactMatch) {
    let resp = getAjaxJson(urlSearchUsers(String(username)))
    java.log(urlSearchUsers(String(username)))
    // java.log(JSON.stringify(resp))
    if (resp.error || resp.total === 0) {
        return []
    }

    // 去除无小说作者
    resp.users = resp.users.filter(user => user.novels.length >= 1)
    // java.log(JSON.stringify(resp))
    if (resp.total > resp.users.length) {
        java.log(`已经去除 ${resp.total - resp.users.length} 位无小说的作者`)
    }
    if (resp.users.length === 0) {
        return []
    }

    if (!exactMatch) {
        return resp.users
    }
    // 只返回用户名完全一样的用户
    return resp.users.filter(user => {
        return user.name === username
    })
}

function getUserNovels(nidList, page) {
    let list = nidList.slice((page - 1) * 20, page * 20)  // 分页
    if (list.length === 0) {
        return []
    }
    // java.log(`NIDURL:${urlNovelsDetailed(list)}`)
    return getWebviewJson(urlNovelsDetailed(list))
}

function findUserNovels(username, page) {
    let novelList = []
    let userArr = getUser(username, false)
    // 获取用户所有小说
    let uidList = userArr.filter(user => {
        return user.novels.length > 0
    }).map(user => user.id)
    // java.log(JSON.stringify(uidList))

    if (uidList.length > 0) {
        let list = getWebviewJson(urlUsersDetailed(uidList))  // 包含所有小说数据
        // java.log(JSON.stringify(list))
        let nidList = []
        // 从两层数组中提取novelsId
        list.forEach(user => {
            // 按id降序排序-相当于按时间降序排序
            user.novels.reverse().forEach(nid => nidList.push(nid))
            // 优化 未缓存系列目录的情况：series 数据写入缓存
            user.series.forEach(series => {
                series.novels = []
                putInCacheObject(`LSeries${series.id}`, series)
            })
        })
        // java.log(JSON.stringify(nidList))
        getUserNovels(nidList, page).forEach(novel => {
            novelList.push(novel)
        })
    }

    // 优化 未缓存系列目录的情况：series 数据写入缓存
    novelList.forEach(novel =>{
        if (novel.seriesId) {
            let series = getFromCacheObject(`LSeries${novel.seriesId}`)
            series.novels.push(novel)
            putInCacheObject(`LSeries${novel.seriesId}`, series)
        }
    })
    return novelList.reverse()  // 新小说前置
}


/**
 * 获取发现页书籍，与 config.exploreUrl 成对使用。
 * @param {string} url exploreUrl 中的分类地址，原样传入
 * @param {number} page 页码，从 1 开始
 * @returns 同 search
 */
function explore(url, page) {
    seriesSet.resetIfNeeded(page)   // 第 1 页清空旧记录
    if (url.includes("cdn.jsdelivr.net" || "raw.githubusercontent.com")) {
        updateSource(); return []
    }
    if (url.includes("/fav/user")) {
        return handlerRecommendUsers()
    }
    if (url.includes("/pixiv/novels/recent")) {
        return handlerFollowLatest(url, page)
    }
    if (url === "https://linpx.ink") {
        return handlerRegexNovels()
    }
    else {
        startBrowser(url, ""); return []
    }
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
    const MAX_FETCH_USER_NUMBER = 2
    let userIds = getAjaxJson(urlUserFavorite()).map(i => i.id)
    // java.log(`用户id个数:${userIds.length}`)
    if (userIds.length > MAX_FETCH_USER_NUMBER) {
        userIds = randomChoseArrayItem(userIds, MAX_FETCH_USER_NUMBER)
    }
    // java.log(`查询的用户Ids:${userIds}`)
    let usersInfo = getAjaxJson(urlUsersDetailed(userIds))
    // java.log(`返回的${JSON.stringify(usersInfo)}`)
    let queryNovelIds = []
    // java.log(`${JSON.stringify(usersInfo)}`)

    usersInfo.filter(user => user.novels && user.novels.length > 0)
        .forEach(user => {
            user.novels.forEach(novel => queryNovelIds.push(novel))
        })

    // 暂时限制最大获取数量
    if (queryNovelIds.length > 10) {
        queryNovelIds = randomChoseArrayItem(queryNovelIds, 10)
    }

    let novelList = getAjaxJson(urlNovelsDetailed(queryNovelIds))
    return formatNovels(handNovels(combineNovels(novelList)))
}

function handlerFollowLatest(url, page) {
    let resp = getAjaxJson(url.replace("{{page}}", page))
    return formatNovels(handNovels(combineNovels(resp)))
}

function handlerRegexNovels() {
    let result = java.webView(null, "https://linpx.ink", null)
    let match = result.match(RegExp('<div class="font-serif text-lg font-bold">(.*?)</div>'))
    if (!match) return []

    let name = match[1]
    let resp = getAjaxJson(urlSearchNovel(name, 1))
    if (resp.total !== undefined) {
        return formatNovels(handNovels(combineNovels(resp.novels)))
    }
    return []
}


/**
 * 获取书籍详情。可选；仅写出的字段覆盖原值。
 * @param {Object} book 搜索结果中的书籍对象
 * @returns { {name, author, intro, coverUrl, kind, wordCount, latestChapterTitle, tocUrl, type, variable} } 字段补丁对象或 JSON 字符串
 */
function getBookInfo(book) {
    logSourceInformation()
    let novelId = book.bookUrl.match(new RegExp("\\d+"))[0]
    let novel = getAjaxJson(urlNovelDetailed(novelId))
    book = novel = formatNovels(handNovels([novel], true))[0]
    let result = getAjaxJson(urlSeriesDetailed(novel.seriesId))
    if (!novel.seriesId || novel.seriesId && result.error) {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlNovelDetailed(novel.id)
    } else {
        book.bookUrl = novel.detailedUrl = urlNovelUrl(novel.id)
        book.tocUrl = novel.catalogUrl = urlSeriesDetailed(novel.seriesId)
    }
    return book
}


/**
 * 获取目录。
 * @param {Object} book 书籍对象
 * @returns { [{title, url, isVolume, isVip, isPay, wordCount, tag, resourceUrl}] } 目录数组或 JSON 字符串；title、url 必填，数组序即目录序
 */
function getChapters(book) {
    let novelId = book.bookUrl.match(new RegExp("\\d+"))[0]
    let novel = getAjaxJson(urlNovelDetailed(novelId))
    novel = handNovels([novel], true)[0]
    let result = getAjaxJson(urlSeriesDetailed(novel.seriesId))
    if (result.novels) return seriesHandler(result)
    // else if (result.series) return seriesContentHandler(novel)
    else return oneShotHandler(novel)
}

function urlNovel(novelId) {
    let settings = getFromCacheObject("linpxSettings")
    if (settings.SHOW_ORIGINAL_LINK) {
        return urlNovelUrl(novelId)
    } else {
        return urlNovelDetailed(novelId)
    }
}

function oneShotHandler(resp) {
    resp.textCount = resp.content.length
    resp.updateDate = timeTextFormat(resp.createDate)
    return [{
        title: resp.title.trim(),
        url: urlNovel(resp.id),
        tag: resp.tag,
        wordCount: resp.content.length,
        chapterInfo:`${resp.updateDate}　　${resp.textCount}字`
    }]
}

function seriesHandler(resp) {
    let novelUrls = resp.novels.map(item => urlNovelDetailed(item.id))
    let novels = getAjaxAllJson(novelUrls)

    novels.forEach(novel => {
        if (!novel.title) novel.title = novel.detail.title
        novel.title = novel.title.trim()
        novel.url = urlNovel(novel.id)
        if (novel.content) novel.wordCount = novel.content.length
        novel.updateDate = timeTextFormat(novel.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.wordCount}字`
        if (novel.content) delete novel.content
        debugFunc(() => {
            java.log(`${novel.title}`)
        })
    })
    return novels
}

// 优化 未缓存系列目录的情况：从章节数据中，获取系列目录
function seriesContentHandler(resp) {
    let novels = [], prevNovels = [], nextNovels = []
    while (resp.series.prev !== null && resp.series.prev !== undefined) {
        prevNovels.push(resp.series.prev)
        resp = getAjaxJson(urlNovelDetailed(resp.series.prev.id))
    }
    nextNovels.push({id: resp.id, order: resp.series.order, title: resp.title})
    while (resp.series.next !== null && resp.series.prev !== undefined) {
        nextNovels.push(resp.series.next)
        resp = getAjaxJson(urlNovelDetailed(resp.series.next.id))
    }
    novels = novels.concat(prevNovels.reverse())
    novels = novels.concat(nextNovels)
    novels.forEach(novel => {
        novel.title = novel.title.trim()
        novel.url = urlNovel(novel.id)
        novel.detail = getAjaxJson(urlNovelDetailed(novel.id))
        novel.wordCount = novel.detail.content.length
        novel.updateDate = timeTextFormat(novel.detail.createDate)
        novel.chapterInfo = `${novel.updateDate}　　${novel.wordCount}字`
        delete novel.detail
    })
    // java.log(JSON.stringify(novels))
    return novels
}


/**
 * 获取正文。运行时额外提供 nextChapterUrl，表示下一章地址，可能为 null。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns {string} 正文文本；返回空字符串视为失败。纯文本段落用 \n 分隔；
 *   也可将正文 HTML 传入 java.htmlFormat(html, chapter.url) 转换为文本并保留插图
 */
function getContent(chapter, book) {
    let novelId = chapter.url.match(new RegExp("\\d+"))[0]
    let resp = getAjaxJson(urlNovelDetailed(novelId))
    let content = resp.content

    // java.upLoginData({"章节名称": resp.title})
    // source.putLoginInfo(JSON.stringify({"章节名称": resp.title}))

    // 替换 Pixiv 标记符
    content = getCaptions(resp, content)
    content = replaceUploadedImage(resp, content)
    content = replacePixivImage(content)
    content = replaceNewPage(content)
    content = replaceChapter(content)
    content = replaceJumpPage(content)
    content = replaceJumpUrl(content)
    content = replaceRb(content)
    return content
}
// 获取并处理 Captions
function getCaptions(resp, content) {
    let settings = getFromCacheObject("linpxSettings")
    if (settings.SHOW_CAPTIONS === true && resp.desc !== "") {
        resp.desc = resp.desc.replace(/<br\s*\/?>/gi, "\n")
        content = resp.desc + "\n" + "——————————\n".repeat(2) + content
    }
    return content
}
// 获取 [uploadedimage:] 的图片链接
function replaceUploadedImage(resp, content) {
    if (resp.images !== undefined && resp.images !== null) {
        Object.keys(resp.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${urlCoverUrl(resp.images[key].origin)}">`)
        })
    }
    return content
}
// 获取 [pixivimage:] 的图片链接 [pixivimage:1234] [pixivimage:1234-1]
function replacePixivImage(content) {
    let matched = content.match(RegExp(/\[pixivimage:(\d+)-?(\d+)]/gm))
    if (matched) {
        matched.forEach(pixivimage => {
            let matched2, illustId, order = 0
            if (pixivimage.includes("-")) {
                matched2 = pixivimage.match(RegExp("(\\d+)-(\\d+)"))
                illustId = matched2[1]; order = matched2[2]
            } else {
                matched2 = pixivimage.match(RegExp("\\d+"))
                illustId = matched2[0];
            }
            let link = urlIllustOriginal(illustId, order)
            if (link) {
                content = content.replace(`${pixivimage}`, `<img src="${link}">`)
            } else {
                content = content.replace(`${pixivimage}`, ``)
            }
        })
    }
    return content
}
// 替换 Pixiv 分页标记符号 [newpage]
function replaceNewPage(content) {
    // if (!util.environment.IS_LYC_BRUNCH) {
        let matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
        if (matched) {
            for (let i in matched) {
                content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}`)
            }
        }
    // }
    return content
}
// 替换 Pixiv 章节标记符号 [chapter:]
function replaceChapter(content) {
    let matched = content.match(RegExp(/\[chapter:(.*?)]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[chapter:(.*?)]/m)
            let chapter = matched2[1].trim()
            // 替换 Pixiv 分页标记符号 [newpage]
            // if (util.environment.IS_LYC_BRUNCH) {
            //     content = content.replace(`${matched[i]}`, `<usehtml><h3>${chapter}</h3></usehtml>`)
            // } else {
                content = content.replace(`${matched[i]}`, `${chapter}<p>​<p/>`)
            // }
        }
    }
    return content
}
// 替换 Pixiv 跳转页面标记符号 [[jump:]]
function replaceJumpPage(content) {
    let matched = content.match(RegExp(/\[jump:(\d+)]/gm))
    if (matched) {
        for (let i in matched) {
            let page = matched[i].match(/\d+/)
            content = content.replace(`${matched[i]}`, `\n\n跳转至第${page}节`)
        }
    }
    return content
}
// 替换 Pixiv 链接标记符号 [[jumpuri: > ]]
function replaceJumpUrl(content) {
    let matched = content.match(RegExp(/\[\[jumpuri:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[jumpuri:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let urlName = matched2[1].trim()
            let urlLink = matched2[2].trim()

            // if (util.environment.IS_LYC_BRUNCH) {
            //     content = content.replace(`${matchedText}`, `<usehtml><p>　　<a href=${urlLink}>${urlName}</a></p></usehtml>`)
            // } else {
                if (urlLink === urlName) {
                    content = content.replace(`${matchedText}`, `${urlName}`)
                } else {
                    content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
                }
            // }
        }
    }
    return content
}
// 替换 Pixiv 注音标记符号 [[rb: > ]]
function replaceRb(content) {
    let settings = getFromCacheObject("linpxSettings")
    let matched = content.match(RegExp(/\[\[rb:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[rb:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let kanji = matched2[1].trim()
            let kana = matched2[2].trim()

            // 默认替换成（括号）
            if (!settings.REPLACE_TITLE_MARKS) {
                content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
            } else {
                let reg = RegExp("[\\u4E00-\\u9FFF]+", "g");
                if (reg.test(kana)) {
                    // kana为中文，则替换回《书名号》
                    content = content.replace(`${matchedText}`, `${kanji}《${kana}》`)
                } else {
                    // 阅读不支持 <ruby> <rt> 注音
                    // content = content.replace(`${matchedText}`, `<ruby>${kanji}<rt>${kana}</rt></ruby>`)
                    content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
                }
            }
        }
    }
    return content
}


/**
 * 段评统计，与 getReviewDetail 成对使用。章节加载后调用，返回各段落的评论数。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @returns { [{paraIndex, count, paraData}] } 数组或 JSON 字符串；paraIndex 段落序号（从 1 起），count 评论数（≤0 忽略），paraData 可选，传给 getReviewDetail
 */
function getReviewSummary(chapter, book) {
    const html = java.ajax(
        `${config.bookSourceUrl}/review/summary?cid=${chapter.url}`,
    );
    const list = [];
    // list.push({ paraIndex: 1, count: 5, paraData: "token" })
    return list;
}

/**
 * 段评详情，与 getReviewSummary 成对使用。点击段评图标时调用，支持翻页。
 * @param {Object} chapter 章节对象
 * @param {Object} book 书籍对象
 * @param {number} paraIndex 段落序号
 * @param {string} paraData getReviewSummary 返回的附加数据，可能为空字符串
 * @param {number} page 页码，从 1 开始
 * @returns { {items: [{content, id, name, avatar, badge, replies}], nextPageUrl} } content 必填，replies 为同结构子评论数组；nextPageUrl 非空则可继续翻页，翻页由 page 递增自行拼接
 */
function getReviewDetail(chapter, book, paraIndex, paraData, page) {
    const html = java.ajax(
        `${config.bookSourceUrl}/review/detail?para=${paraIndex}&page=${page}`,
    );
    const items = [];
    // items.push({ content: "评论内容", name: "用户名", replies: [{ content: "回复内容" }] })
    return { items, nextPageUrl: null };
}

// util 工具
function debugFunc(func) {
    let settings = getFromCacheObject("linpxSettings")
    if (settings.DEBUG) {
        func()
    }
}

function combineNovels(novels) {
    return novels.filter(novel => {
        // 单本直接保留
        if (novel.seriesId === undefined || novel.seriesId === null) {
            return true
        }
        // 该系列还没出现过 → 保留，并记录
        if (!seriesSet.has(novel.seriesId)) {
            seriesSet.add(novel.seriesId)
            return true
        }
        return false
    })
}

function handNovels(novels, isDetail) {
    novels.forEach(novel => {
        if (!novel.id) novel.id = novel._id
        // novel.title = novel.title
        // novel.userName = novel.userName
        // novel.userId = novel.userId
        // novel.tags = novel.tags
        if (novel.tags === undefined) {
            novel.tags = []
        }
        // novel.textCount = novel.length
        novel.description = novel.desc
        // novel.coverUrl = novel.coverUrl
        // novel.createDate = novel.createDate
        // novel.seriesId = novel.seriesId
        // novel.seriesTitle = novel.seriesTitle

        // 兼容详情页
        if (novel.content) {
            if (novel.series) {
                novel.seriesId = novel.series.id
                novel.seriesTitle = novel.series.title
            }
            novel.textCount = novel.length = novel.content.length
        }

        // 单篇添加更多信息
        if (!novel.seriesId) {
            novel.tags.unshift("单本")
            novel.textCount = novel.length
            novel.latestChapter = novel.title
            novel.detailedUrl = urlNovelDetailed(novel.id)
        }

        // 搜索、详情：系列添加更多信息
        if (novel.seriesId) {
            novel.title = novel.seriesTitle
            novel.tags.unshift("系列")
            novel.detailedUrl = urlNovelDetailed(novel.id)
        }

        // 详情：兼容无法从 Pixiv 获取系列详情的系列小说
        let series
        if (novel.seriesId && isDetail) {
            series = getAjaxJson(urlSeriesDetailed(novel.seriesId))
            // novel.detailedUrl = urlNovelDetailed(novel.id)
        }

        // 详情：系列添加更多信息
        if (novel.seriesId && isDetail && !series.error) {
            java.log(`正在获取系列小说：${novel.seriesId}`)
            novel.id = series.novels[0].id
            // novel.title = novel.seriesTitle
            if (series.tags) novel.tags = novel.tags.concat(series.tags)
            novel.latestChapter = series.novels.reverse()[0].title
            novel.description = series.caption
            // 后端目前没有系列的 coverUrl 字段
            // novel.coverUrl = series.coverUrl
            // novel.coverUrl = series.novels[0].coverUrl
            novel.detailedUrl = urlSeriesDetailed(novel.seriesId)

            let firstNovel = getAjaxJson(urlNovelDetailed(novel.id))
            if (firstNovel.error !== true) {
                novel.tags = novel.tags.concat(firstNovel.tags)
                novel.createDate = firstNovel.createDate
                if (novel.description === "") {
                    novel.description = firstNovel.desc
                }
            }
        }
    })
    return novels
}

function formatNovels(novels) {
    let settings = getFromCacheObject("linpxSettings")
    novels.forEach(novel => {
        novel.title = novel.title.trim()
        if (!novel.userName.startsWith("@")) novel.userName = `@${novel.userName}`
        novel.coverUrl = urlCoverUrl(novel.coverUrl)
        novel.createDate = dateFormat(novel.createDate)

        novel.tags2 = []
        for (let i in novel.tags) {
            let tag = novel.tags[i]
            if (tag.includes("/")) {
                let tags = tag.split("/")
                novel.tags2 = novel.tags2.concat(tags)
            } else {
                novel.tags2.push(tag)
            }
        }
        novel.tags = Array.from(new Set(novel.tags2))
        novel.tags = novel.tags.map(item => `#${item}`)
        novel.tags = novel.tags.join(",")

        if (settings.MORE_INFORMATION) {
            novel.description = `\n书名：${novel.title}\n作者：${novel.userName}\n标签：${novel.tags}\n上传：${novel.createDate}\n简介：${novel.description}`
        } else {
            novel.description = `\n${novel.description}\n上传时间：${novel.createDate}`
        }

        novel.name = novel.title
        novel.bookUrl = novel.detailedUrl
        novel.author = novel.userName
        novel.kind = novel.tags
        // novel.coverUrl = novel.coverUrl
        novel.intro = novel.description
        novel.wordCount = novel.textCount
        novel.latestChapterTitle = novel.latestChapter
        novel.tocUrl = novel.catalogUrl
    })
    return novels
}


function login() {}

function getNovel() {
    let novel = {}
    novel.id = chapter.url.match(/\d+/)[0]
    novel.title = chapter.title
    novel.userName = book.author.replace("@", "")
    if (book.tocUrl.includes("series")) {
        novel.seriesId = book.tocUrl.match(/\d+/)[0]
        novel.seriesTitle = book.name
    } else {
        novel.seriesId = 0
        novel.seriesTitle = ""
    }

    let resp = getAjaxJson(urlNovelDetailed(novel.id))
    novel.userId = resp.userId
    if (!novel.seriesId && resp.series) {
        novel.seriesId = resp.series.id
        novel.seriesTitle = resp.series.title
    }
    return novel
}

function shareFactory(type) {
    let novel = getNovel()
    if (!novel) return sleepToast("🔰 功能提示\n\n⚠️ 请在小说阅读页面，使用本功能")
    if (type.includes("author")) {
        sleepToast("\n\n已复制当前作者链接", 1)
        java.copyText(urlUserUrl(novel.userId))
        // startBrowser(urlUserUrl(novel.userId), novel.userName)
    }
    else if (type.includes("novel")) {
        sleepToast("\n\n已复制当前小说链接", 1)
        java.copyText(urlNovelUrl(novel.id))
        // startBrowser(urlNovelUrl(novel.id), novel.title)
    }
    else if (type.includes("pixiv") && !novel.seriesId) {
        sleepToast("\n\n已复制当前小说系列 Pixiv 链接", 1)
        java.copyText(urlSourceUrl(novel.id))
        // startBrowser(urlSourceUrl(novel.id), novel.title)
    }
    else if (type.includes("pixiv") && novel.seriesId) {
        sleepToast("\n\n已复制当前小说系列 Pixiv 链接", 1)
        java.copyText(urlSeriesUrl(novel.seriesId))
        // startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle)
    }
}

function startGithubReadme() {
    startBrowser("https://pixivsource.pages.dev/Linpx", "使用指南")
}
function startGithubIssue() {
    startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}

function checkStatus(status) {
    if (eval(String(status)) === true) return "❤️"
    else return "🖤"
}

let settingsNames = {
    "SEARCH_AUTHOR": "🔍 搜索作者",
    "CONVERT_CHINESE": "🀄️ 繁简通搜",
    "MORE_INFORMATION": "📖 更多简介",
    "SHOW_ORIGINAL_LINK": "🔗 原始链接",
    "REPLACE_TITLE_MARKS": "📚 恢复《》",
    "SHOW_CAPTIONS": "📑 显示描述",
    "DEBUG": "🐞 调试模式",
    "PIC_SOURCE": "⏳ 图片解析",
    "PIC_LINK": "🔗 图片链接",
    "PIC_SIZE": "↔️ 图片大小",
}
let settingsOptionsNames = {
    "PIC_SOURCE": {
        "PixivShojo": "📄 PixivShojo",
        "PixivCat": "🐱 PixivCat",
    },
    "PIC_LINK": {
        "PixivShojo": "📄 PixivShojo",
        "Linpx": "🦊 Linpx 网站",
        "PixivCat": "🐱 PixivCat",
    },
    "PIC_SIZE": {
        "original": "🔶 大 Original",
        "regular": "🀄️ 中 Regular",
        "small": "🔸 小 Small",
    }
}

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else if (status === undefined) return "🈚️ 未设置"
    else return status
}

// 检测快速模式修改的4个设置
function getSettingStatus(mode) {
    if (mode === undefined) mode = ""
    let msgList = []
    let settings = getFromCacheObject("linpxSettings")
    Object.keys(settingsNames).forEach(key => {
        if (key.startsWith("PIC")) {
            let settingsValue = settings[key]
            let settingsValueName = settingsOptionsNames[key][settingsValue]
            msgList.push(`${settingsNames[key]}　${statusMsg(settingsValueName)}`)
        } else {
            msgList.push(`${settingsNames[key]}　${statusMsg(settings[key])}`)
        }
    })
    return msgList.join("\n").trim()
}

function showSettings() {
    sleepToast(`\n⚙️ 当前设置\n\n${getSettingStatus()}`)
}

function setDefaultSettingsLoginUrl() {
    setDefaultSettings()
    sleepToast(`\n🔧 默认设置　✅ 已恢复\n\n${getSettingStatus()}`)
}

function setDefaultSettings() {
    let settings = {}
    settings.SEARCH_AUTHOR = false      // 搜索：默认搜索作者名称
    settings.CONVERT_CHINESE = true     // 搜索：搜索时进行繁简转换

    settings.MORE_INFORMATION = false   // 详情：书籍简介显示更多信息
    settings.SHOW_ORIGINAL_LINK = true  // 目录：显示原始链接，但会增加大量请求

    settings.REPLACE_TITLE_MARKS = true // 正文：注音内容为汉字时，替换为书名号
    settings.SHOW_CAPTIONS = true       // 正文：章首显示描述
    settings.DEBUG = false              // 全局：调试模式

    settings.PIC_SOURCE = "PixivShojo"  // 正文：图片解析
    settings.PIC_LINK = "PixivShojo"    // 正文：图片链接
    settings.PIC_SIZE = "original"      // 正文：图片大小

    putInCacheObject("linpxSettings", settings)
    return settings
}

function editSettings(settingKey) {
    let msg, status
    let settings = getFromCacheObject("linpxSettings")
    if (!settings) settings = setDefaultSettings()

    if (settingKey.startsWith("PIC")) {
        let settingName = settingsNames[settingKey]
        let optionsKeys = Object.keys(settingsOptionsNames[settingKey])

        let current = settings[settingKey]
        let currentIndex = optionsKeys.indexOf(current) || 0
        if (currentIndex === -1) currentIndex = 0
        let nextIndex =  (currentIndex + 1) % optionsKeys.length
        let nextKey = settings[settingKey] = optionsKeys[nextIndex]
        let nextValue = settingsOptionsNames[settingKey][nextKey]
        msg = `\n${settingName}\n\n${nextValue}`

    } else {
        if (!!settings[settingKey]) {
            status = settings[settingKey] = !settings[settingKey]
        } else {
            status = settings[settingKey] = true
        }
        msg = `\n\n${settingsNames[settingKey]}　${statusMsg(status)}`
    }

    putInCacheObject("linpxSettings", settings)
    sleepToast(msg)
}


// JSLib cache
var cacheSaveSeconds = 30*24*60*60  // 长期缓存 30 天
var cacheTempSeconds = 10*60*1000   // 冷却时间 10 分钟
function cacheGetAndSet(key, supplyFunc, requestUpdate) {
    const {java, cache} = this
    let timestamp = 0
    let v = getFromCacheObject(key)
    if (Array.isArray(v)) {
        try {
            timestamp = v[0].timestamp
        } catch (e) {
            timestamp = 0
        }
    } else if (v) {
        timestamp = v.timestamp
    }

    const isExpired = v && (new Date().getTime() >= timestamp + cacheTempSeconds)
    const isError = v && (v.error === true) && isExpired
    requestUpdate = requestUpdate && isExpired

    if (!v || requestUpdate || isError) {
        v = supplyFunc()
        let now = new Date().getTime()
        // getAjaxJson getWebviewJson 时间戳写入对象本身
        if (!Array.isArray(v)) {
            v = Object.assign({timestamp: now}, v)
        }
        // else {
        //     // getAjaxAllJson 时间戳写入第一个元素（读取时 v[0].timestamp）// 不重复写入
        //     if (v.length > 0) v[0] = Object.assign({timestamp: now}, v[0])
        // }
        putInCacheObject(key, v, cacheSaveSeconds)
    }
    return v
}

function putInCache(name, object, saveSeconds) {
    if (saveSeconds === undefined) saveSeconds = 0
    if (object) cache.put(name, object, saveSeconds)
}
function getFromCache(name) {
    let object = cache.get(name)
    if (object === undefined) return null  // 兼容源阅
    return object
}

function putInCacheObject(objectName, object, saveSeconds) {
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(objectName, JSON.stringify(object), saveSeconds)
}
function getFromCacheObject(objectName) {
    let object = cache.get(objectName)
    if (object === undefined) return null  // 兼容源阅
    return JSON.parse(object)
}

function getAjaxJson(url, requestUpdate) {
    return cacheGetAndSet(url, () => {
        return JSON.parse(java.ajax(url))
    }, requestUpdate)
}
function getAjaxAllJson(urls, requestUpdate) {
    let batchKey = JSON.stringify(urls)
    return cacheGetAndSet(batchKey, () => {
        let results = []
        let now = new Date().getTime()
        let responses = java.ajaxAll(urls)
        for (let i in urls) {
            let data = JSON.parse(responses[i].body())
            data = Object.assign({timestamp: now}, data)
            results.push(data)
            putInCacheObject(urls[i], data, cacheSaveSeconds)
        }
        return results
    }, requestUpdate)
}
function getWebviewJson(url) {
    return cacheGetAndSet(url, () => {
        let html = java.webView(null, url, null)
        return JSON.parse((html.match(new RegExp(">\\[{.*?}]<"))[0].replace(">", "").replace("<", "")))
    })
}
function getWebViewUA() {
    let userAgent = getFromCache("userAgent")
    if (userAgent) return String(userAgent)

    userAgent = String(java.getWebViewUA())
    // java.log(`userAgent=${userAgent}`)
    putInCache("userAgent", userAgent, cacheSaveSeconds/4)
    return String(userAgent)
}

function startBrowser(url, title) {
    if (!title) title = url
    let msg = "", headers = {}
    headers["User-Agent"] = getWebViewUA()
    headers["Referer"] = "https://linpx.ink/"

    if (url.includes("github.com") || url.includes("github.io")) {
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    }
    sleepToast(msg, 0.01)
    java.startBrowser(`${url}, ${JSON.stringify({headers: headers})}`, title)
}

// JSLib url
function urlNovelUrl(novelId) {
    return `https://linpx.ink/pixiv/novel/${novelId}`
}
function urlNovelDetailed(novelId) {
    return `https://api.linpx.ink/pixiv/novel/${novelId}/cache`
}
function urlNovelsDetailed(nidList) {
    return `https://api.linpx.ink/pixiv/novels/cache?${nidList.map(v => "ids[]=" + v).join("&")}`
}

function urlSourceUrl(novelId) {
    return `https://www.pixiv.net/novel/show.php?id=${novelId}`
}

function urlSeriesUrl(seriesId) {
    return `https://www.pixiv.net/novel/series/${seriesId}`
}
function urlSeriesDetailed(seriesId) {
    return `https://api.linpx.ink/pixiv/series/${seriesId}/cache`
}

function urlUserUrl(userId) {
    return `https://linpx.ink/pixiv/user/${userId}`
}
function urlUserDetailed(userId) {
    return `https://api.linpx.ink/pixiv/user/${userId}/cache`
}
function urlUsersDetailed(uidList) {
    return `https://api.linpx.ink/pixiv/users/cache?${uidList.map(v => "ids[]=" + v).join("&")}`
}
function urlUserFavorite() {
    return "https://api.linpx.ink/fav/user/cache"
}

function urlSearchNovel(novelName, page) {
    return `https://api.linpx.ink/pixiv/search/novel/${novelName}/cache?page=${page}`
}
function urlSearchUsers(userName) {
    return `https://api.linpx.ink/pixiv/search/user/${userName}/cache`
}

function urlCoverUrl(pxImgUrl) {
    return urlPxImgUrlLinpx(pxImgUrl)
}
function urlPxImgUrlLinpx(pxImgUrl) {
    if (!pxImgUrl.trim()) return ""
    let url = `https://pximg.linpx.ink/?url=${pxImgUrl}&w=800`
    let headers = {"Referer": "https://linpx.ink/"}
    return `${url}, ${JSON.stringify({headers: headers})}`
}

function urlIllustUrl(illustId) {
    return `https://www.pixiv.net/artworks/${illustId}`
}
function urlIllustDetailed(illustId) {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`
}

function urlIllustOriginal(illustId) {
    let targetUrl = `https://pixiv.shojo.cn/${illustId}`
    let headers = {
        "User-Agent": getWebViewUA(),
        "Referer": "https://pixiv.shojo.cn/",
    }
    try {
        let resHeaders = java.head(targetUrl, headers).headers()
        let originalUrl = resHeaders["Location"] || resHeaders["location"]
        // originalUrl = originalUrl.replace("proxy.pixiv.shojo.cn", "i.pximg.net")
        return originalUrl ? originalUrl : ""
    } catch (e) {
        // java.log("请求失败: " + e)
        return ""
    }
}


// JSLib date
function addZero(num) {
    return String(num).padStart(2, '0')
}
function dateFormat(str) {
    let time = new Date(str);
    let Y = time.getFullYear() + "年";
    let M = addZero(time.getMonth() + 1) + "月";
    let D = addZero(time.getDate()) + "日";
    return Y + M + D;
}
function timeFormat(str) {
    let time = new Date(str);
    let YY = time.getFullYear()
    let MM = addZero(time.getMonth() + 1)
    let DD = addZero(time.getDate())
    let hh = addZero(time.getHours())
    let mm = addZero(time.getMinutes())
    let ss = addZero(time.getSeconds())
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
function timeTextFormat(text) {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`
}

function sleep(seconds) {
    return Packages.java.lang.Thread.sleep(1000*seconds)
}
function sleepToast(text, seconds) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (seconds === undefined) {seconds = 0.01}
    sleep(seconds)
}

function updateSource() {
    return updateSourceLink()
}

function updateSourceLink(){
    if (isJSBookSource) {
        try {
            java.openUrl(`legado://import/bookSource?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/src/bookSourceJS/${bookSourceName}.js`)
        } catch (e) {
            java.openUrl(`legado://import/bookSource?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/src/bookSourceJS/${bookSourceName}.js`)
        }
    } else {
        try {
            java.openUrl(`legado://import/bookSource?src=https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/linpx.json`)
        } catch (e) {
            java.openUrl(`legado://import/bookSource?src=https://raw.githubusercontent.com/DowneyRem/PixivSource/main/linpx.json`)
        }
    }
}