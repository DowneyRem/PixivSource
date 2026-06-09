var util = objParse(String(java.get("util")))
let emoji = {
    "normal": 101, "surprise": 102, "series": 103, "heaven": 104, "happy": 105,
    "excited": 106, "sing": 107, "cry": 108, "normal2": 201, "shame2": 202,
    "love2": 203, "interesting2": 204, "blush2": 205, "fire2": 206, "angry2": 207,
    "shine2": 208, "panic2": 209, "normal3": 301, "satisfaction3": 302, "surprise3": 303,
    "smile3": 304, "shock3": 305, "gaze3": 306, "wink3": 307, "happy3": 308,
    "excited3": 309, "love3": 310, "normal4": 401, "surprise4": 402, "series4": 403,
    "love4": 404, "shine4": 405, "sweet4": 406, "shame4": 407, "sleep4": 408,
    "heart": 501, "teardrop": 502, "star": 503
}

function objParse(obj) {
    return JSON.parse(obj, (n, v) => {
        if (isFunctionString(v)) {
            return eval(`(${v})`)
        }
        return v;
    })
}

function getNovelInfo(resp) {
    if (resp && resp.error === true) return

    let novel = resp.body
    novel.id = Number(novel.id)
    if (novel.bookmarkData) {
        novel.isBookmark = true
        putInCache(`collect${novel.id}`, novel.bookmarkData.id)
        util.saveNovels("likeNovels", [Number(novel.id)])
    } else {
        novel.isBookmark = false
    }

    if (novel.seriesNavData) {
        novel.seriesId = Number(novel.seriesNavData.seriesId)
        novel.seriesTitle = novel.seriesNavData.title
        novel.isWatched = novel.seriesNavData.isWatched
        util.saveNovels("watchedSeries", [Number(novel.seriesId)])
    } else {
        novel.seriesId = null
        novel.seriesTitle = ""
        novel.isWatched = false
    }

    // 系列 + 阅读，使用当前章节名称
    if (novel.seriesId && globalThis.environment.IS_LEGADO) {
        novel.title = book.durChapterTitle
        try{
            let novelIds = getFromCacheObject(`novelIds${novel.seriesId}`)
            novel.id = novelIds[book.durChapterIndex]
        } catch(e) {
            let novelIds = getAjaxJson(urlIP(urlSeriesNovelsTitles(novel.seriesId)), true).body
            novel.id = novelIds[book.durChapterIndex].id
        }
    }

    // 添加投票信息
    if (novel.pollData) {
        novel.question = novel.pollData.question
    } else {
        novel.question = ""
    }

    // 登录界面显示信息
    novel["章节名称"] = novel.title
    novel["问卷调查"] = novel.question || ""
    source.putLoginInfo(JSON.stringify(novel))

    // 写入缓存
    resp.body = novel
    putInCacheObject("novel", resp)
    putInCacheObject(urlNovelDetailed(novel.id), resp)
}

// 在正文内部添加小说描述
function getCaptions(resp, content)　{
    if (globalThis.settings.SHOW_CAPTIONS && resp.description !== "") {
        content = resp.description + "\n" + "——————————\n".repeat(2) + content
    }
    return content
}

// 获取 [uploadedimage:] 的图片链接
function replaceUploadedImage(resp, content) {
    if (globalThis.settings.SHOW_PICTURES && resp.textEmbeddedImages) {
        Object.keys(resp.textEmbeddedImages).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${urlCoverUrl(resp.textEmbeddedImages[key].urls.original)}">`)
        })
    }
    return content
}

// 获取 [pixivimage:] 的图片链接 [pixivimage:1234] [pixivimage:1234-1]
function replacePixivImage(content) {
    if (!globalThis.settings.SHOW_PICTURES) return content

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
            if (urlIllustOriginal(illustId, order)) {
                content = content.replace(`${pixivimage}`, `<img src="${urlIllustOriginal(illustId, order)}">`)
            } else {
                content = content.replace(`${pixivimage}`, ``)
            }
        })
    }
    return content
}

// 替换 Pixiv 分页标记符号 [newpage]
function replaceNewPage(content) {
    if (!globalThis.environment.IS_LEGADO_SIGMA) {
        let matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
        if (matched) {
            for (let i in matched) {
                content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}`)
            }
        }
    }
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
            if (globalThis.environment.IS_LEGADO_SIGMA) {
                content = content.replace(`${matched[i]}`, `<usehtml><h3>${chapter}</h3></usehtml>`)
            } else {
                content = content.replace(`${matched[i]}`, `${chapter}<p>​<p/>`)
            }
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

            if (globalThis.environment.IS_LEGADO_SIGMA) {
                content = content.replace(`${matchedText}`, `<usehtml><p>　　<a href=${urlLink}>${urlName}</a></p></usehtml>`)
            } else {
                if (urlLink === urlName) {
                    content = content.replace(`${matchedText}`, `${urlName}`)
                } else {
                    content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
                }
            }
        }
    }
    return content
}

// 替换 Pixiv 注音标记符号 [[rb: > ]]
function replaceRb(content) {
    let matched = content.match(RegExp(/\[\[rb:(.*?)>(.*?)]]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[rb:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let kanji = matched2[1].trim()
            let kana = matched2[2].trim()

            if (!globalThis.settings.REPLACE_TITLE_MARKS) {
                // 默认替换成（括号）
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

// 添加投票信息
function getPollData(resp, content) {
    if (!globalThis.settings.SHOW_QUESTION || !resp.pollData) return content

    // resp.pollData.selectedValue = 0
    if (resp.pollData) {
        let text = ""
        if (!resp.pollData.selectedValue) text = "，⚠️当前未投)\n(点击【Pixiv 小说】，打开登录界面，点击投票选项，即可参与投票"
        let poll = `📃 问卷调查(✅${resp.pollData.total}已投${text})`
        poll += `\n\n🔠 投票：\n${resp.pollData.question}\n`

        resp.pollData.choices.forEach((choice, i) => {
            if ( i+1 === Number(resp.pollData.selectedValue)) {
                poll += `✅选项${choice.id}：${choice.text}(✅${choice.count})\n`
            } else {
                poll += `☑️选项${choice.id}：${choice.text}(✅${choice.count})\n`
            }
        })
        content += "\n" + "——————————\n".repeat(2) + poll
    }
    return content
}

function processComment(item) {
    let text = item.comment || ""
    if (text === "" && item.stampId) {
        return `<img src="${urlStampUrl(item.stampId)}">`
    }
    return text.replace(/\(([^)]+)\)/g, (match, key) => {
        if (emoji.hasOwnProperty(key)) {
            return `<img src="${urlEmojiUrl(emoji[key])}" >`
        }
        return match
    })
}

function formatComment(item, replyToName = null) {
    const content = processComment(item)
    const isMyComment = item.userId === String(getFromCache("pixivUid"))
    const commentId = isMyComment ? `(${item.id})` : ""
    const name = replyToName ? `@${item.userName}(⤴️@${replyToName})` : `@${item.userName}`
    return `${name}：${content}(${item.commentDate})${commentId}\n`
}

function getComment(resp, content) {
    if (!globalThis.settings.SHOW_COMMENTS || resp.commentCount === 0) return content

    const limit = 50
    let comments = [], commentUrls = [];
    let maxPage = Math.ceil(resp.commentCount / limit)
    if (maxPage >= 2 && globalThis.environment.IS_LEGADO) {
        for (let i = 0; i < maxPage; i++) {
            commentUrls.push(urlIP(urlNovelComments(resp.id, i * limit, limit)))
        }
        comments = getAjaxAllJson(commentUrls).map(resp => resp.body.comments).flat()
    } else {
        for (let i = 0; i < maxPage; i++) {
            let result = getAjaxJson(urlIP(urlNovelComments(resp.id, i * limit, limit)), true)
            if (result && !result.error && result.body && result.body.comments) {
                comments = comments.concat(result.body.comments)
            }
        }
    }

    let commentText = `💬 评论(共计${comments.length}条)：\n`
    comments.forEach(comment => {
        commentText += formatComment(comment)
        if (comment.hasReplies) {
            let resp = getAjaxJson(urlIP(urlNovelCommentsReply(comment.id, 1)), true)
            if (resp && !resp.error && resp.body && resp.body.comments) {
                resp.body.comments.reverse().forEach(reply => {
                    commentText += formatComment(reply, reply.replyToUserName)
                })
            }
            commentText += "——————————\n"
        }
    })
    return content + "\n" + "——————————\n".repeat(2) + commentText
}

function getContent(resp) {
    getNovelInfo(resp)  // 放入信息以便登陆界面使用
    let content = String(resp.body.content)
    // let content = "undefined"
    if (content.includes("undefined")) {
        return checkContent()
    }

    content = getCaptions(resp.body, content)
    content = replaceUploadedImage(resp.body, content)
    content = replacePixivImage(content)
    content = replaceNewPage(content)
    content = replaceChapter(content)
    content = replaceJumpPage(content)
    content = replaceJumpUrl(content)
    content = replaceRb(content)
    content = getPollData(resp.body, content)
    content = getComment(resp.body, content)
    return content
}

function checkContent() {
    let latestMsg = getAjaxJson(urlMessageThreadLatest(5))
    if (latestMsg.error === true) {
        java.log(JSON.stringify(latestMsg))

    } else if (latestMsg.body.total >= 1) {
        let msg = latestMsg.body.message_threads.filter(item => item.thread_name === "pixiv事務局")[0]
        if (msg === undefined) {
            sleepToast(`您于 ${java.timeFormat(new Date().getTime())} 触发 Pixiv 【请求限制】，建议稍候/重新登录再继续`, 3)
            // java.startBrowser("https://www.pixiv.net", '退出登录')
            // java.startBrowser("https://www.pixiv.net/logout.php",'退出登录')  // 不清除 WebView 缓存无法重新登录

        } else if (new Date().getTime()- 1000*msg.modified_at <= 3*24*60*60*1000) { // 3*24h内提醒
            sleepToast(`您于 ${java.timeFormat(1000*msg.modified_at)} 触发 Pixiv 【过度访问】，请修改密码并重新登录`, 3)
            sleepToast(`${msg.latest_content}`, 5)
            java.startBrowser("https://accounts.pixiv.net/password/change",'修改密码')
        }
    }
}

(() => {
    return getContent(util.getNovelRespFirst(result))
})()