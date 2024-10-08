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

(function (res) {
    res = JSON.parse(res)
    let content = res.content
    if (res.series !== null && res.desc !== undefined && res.desc !== "") {
        content = res.desc + "\n" + "——————————\n".repeat(2) + content
    }

    // 获取 [uploadedimage:] 的图片链接
    // 将存在的 pixiv 图片链接替换为可访问的直连
    if (res.images !== undefined && res.images !== null) {
        Object.keys(res.images).forEach((key) => {
            content = content.replace(`[uploadedimage:${key}]`, `<img src="${util.urlCoverUrl(res.images[key].origin)}">`)
        })
    }

    // 获取 [pixivimage:] 的图片链接 [pixivimage:1234] [pixivimage:1234-1]
    let matched = content.match(RegExp(/\[pixivimage:(\d+)-?(\d+)]/gm))
    if (matched) {
        for (let i in matched) {
            let illustId, order
            let matched2 = matched[i].match(RegExp("(\\d+)-?(\\d+)"))
            let temp = matched2[0].split("-")
            illustId = temp[0]
            if (temp.length >= 1) {
                order = temp[1]
            }
            content = content.replace(`${matched[i]}`, `<img src="${util.urlIllustOriginal(illustId, order)}">`)
        }
    }

    // 替换 Pixiv 分页标记符号 [newpage]
    matched = content.match(RegExp(/[ 　]*\[newpage][ 　]*/gm))
    if (matched) {
        for (let i in matched){
            java.log(matched[i])
            content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}`)
        }
    }

    // 替换 Pixiv 章节标记符号 [chapter:]
    matched = content.match(RegExp(/\[chapter:(.*?)]/gm))
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[chapter:(.*?)]/m)
            let chapter = matched2[1].trim()
            // content = content.replace(`${matched[i]}`, `${"<p>​<p/>".repeat(3)}${chapter}<p>​<p/>`)
            content = content.replace(`${matched[i]}`, `${chapter}<p>​<p/>`)
        }
    }

    // 替换 Pixiv 跳转页面标记符号 [[jump:]]
    matched = content.match(/\[jump:(\d+)]/gm)
    if (matched) {
        for (let i in matched) {
            let page = matched[i].match(/\d+/)
            content = content.replace(`${matched[i]}`, `\n\n跳转至第${page}节`)
        }
    }

    // 替换 Pixiv 链接标记符号 [[jumpuri: > ]]
    matched = content.match(/\[\[jumpuri:(.*?)>(.*?)]]/gm)
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[jumpuri:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let urlName = matched2[1].trim()
            let urlLink = matched2[2].trim()
            // 阅读不支持超链接
            //content = content.replace(`${matchedText}`, `<a href=${urlLink}>${urlName}</a>`)
            if (urlLink === urlName) {
                content = content.replace(`${matchedText}`, `${urlName}`)
            } else {
                content = content.replace(`${matchedText}`, `${urlName}: ${urlLink}`)
            }
        }
    }

    // 替换 Pixiv 注音标记符号 [[rb: > ]]
    matched = content.match(/\[\[rb:(.*?)>(.*?)]]/gm)
    if (matched) {
        for (let i in matched) {
            let matched2 = matched[i].match(/\[\[rb:(.*?)>(.*?)]]/m)
            let matchedText = matched2[0]
            let kanji = matched2[1].trim()
            let kana = matched2[2].trim()
            // kana为中文，则替换回《书名号》
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if (reg.test(kana)) {
                content = content.replace(`${matchedText}`, `${kanji}《${kana}》`)
            } else{
                // 阅读不支持 <ruby> <rt> 注音
                // content = content.replace(`${matchedText}`, `<ruby>${kanji}<rt>${kana}</rt></ruby>`)
                content = content.replace(`${matchedText}`, `${kanji}（${kana}）`)
            }
        }
    }

    return content
})(result)