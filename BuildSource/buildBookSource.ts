import os from "os"
import fs from "fs"
import path from "path"
import { execSync } from 'node:child_process'

interface BookSource {
    bookSourceComment: string
    bookSourceGroup: string
    bookSourceName: string
    bookSourceType: number
    bookSourceUrl: string
    bookUrlPattern: string
    concurrentRate: string
    customButton: boolean
    customOrder: number
    enabled: boolean
    enabledCookieJar: boolean
    enabledExplore: boolean
    eventListener: boolean
    exploreUrl: string
    header: string
    jsLib: string
    lastUpdateTime: number
    loginCheckJs: string
    loginUi: string
    loginUrl: string
    respondTime: number
    ruleBookInfo: {
        author: string
        canReName: string
        coverUrl: string
        init: string
        intro: string
        kind: string
        lastChapter: string
        name: string
        tocUrl: string
        wordCount: string
    }
    ruleContent: {
        content: string
        imageStyle: string
        callBackJs: string
    }
    ruleExplore: {
        author: string
        bookList: string
        bookUrl: string
        coverUrl: string
        intro: string
        kind: string
        lastChapter: string
        name: string
        wordCount: string
    }
    ruleSearch: {
        author: string
        bookList: string
        bookUrl: string
        checkKeyWord: string
        coverUrl: string
        intro: string
        kind: string
        lastChapter: string
        name: string
        wordCount: string
    }
    ruleToc: {
        chapterList: string
        chapterName: string
        chapterUrl: string
        isPay: string
        isVip: string
        updateTime: string
    }
    searchUrl: string
    variableComment: string
    weight: number
}

function readTextFile(filePath: string): string {
    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8").trim()
        return data.split("\r\n").join("\n")
    }
    return ""
}

function saveTextFile(folder:string, fileName:string, data:any):void {
    if (folder && !fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    if (fileName.endsWith(".json")) {
        data = JSON.stringify(data, null, 4)
    }
    const outputPath = path.join(folder, fileName)
    fs.writeFileSync(outputPath, data, "utf-8",)

    if (fileName.endsWith(".json")) {
        console.log(`✅  ${outputPath} 生成成功`)
    }
}

function buildBookSource(sourceName:string, test:boolean|number =undefined): BookSource {
    // 需要在 项目根目录下执行
    let sourcePath = `bookSource/${sourceName}`
    let templatePath = `BuildSource/${sourceName}.json`
    // console.log(sourcePath)
    // console.log(templatePath)

    // 读取基础模板
    const BookSource: BookSource = JSON.parse(readTextFile(templatePath))[0]

    // 读取各个构建后文件内容
    let bookSourceComment = readTextFile(path.join(sourcePath, "ReadMe.txt"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const loginUI = readTextFile(path.join(sourcePath, "base.loginUI.json"))
    const loginUIJS = readTextFile(path.join(sourcePath, "base.loginUI.js"))
    const loginCheckJsContent = readTextFile(path.join(sourcePath, "base.loginCheckJs.js"))

    const bookUrlPattern = readTextFile(path.join(sourcePath, "base.bookUrlPattern.txt"))
    const header = readTextFile(path.join(sourcePath, "base.header.json"))
    const variableComment = readTextFile(path.join(sourcePath, "base.variableComment.txt"))
    const jsLibContent = readTextFile(path.join(sourcePath, "base.jsLib.js"))

    const searchUrlContent = readTextFile(path.join(sourcePath, "searchUrl.js"))
    const searchContent = readTextFile(path.join(sourcePath, "search.js"))

    const discoverAddressContent = readTextFile(path.join(sourcePath, "discoverUrl.js"))
    const discoverContent = readTextFile(path.join(sourcePath, "discover.js"))

    const detailContent = readTextFile(path.join(sourcePath, "detail.js"))
    const catalogContent = readTextFile(path.join(sourcePath, "catalog.js"))
    const contentContent = readTextFile(path.join(sourcePath, "content.js"))
    const callBackJS = readTextFile(path.join(sourcePath, "content.callBack.js"))

    // 更新书源更新时间
    let options = { year: "numeric", month: "2-digit", day: "2-digit"}

    let updateTimeNew = new Date(Date.now() + delayTime).toLocaleDateString("zh", options)
    let lastUpdateTime = Number(`${String(Date.parse(updateTimeNew)).slice(0, 10)}251`)
    if (!test) {
        let updateTimeOld = bookSourceComment.split("\n")[0].split("：")[1].replace("）", "")
        bookSourceComment = bookSourceComment.replace(updateTimeOld, updateTimeNew)

        let versionOld = bookSourceComment.split("\n")[2].split("：")[1]
        let versionNew = `${Number(versionOld) + 1}`
        bookSourceComment = bookSourceComment.replace(versionOld, versionNew)
        saveTextFile(sourcePath, "ReadMe.txt", bookSourceComment)
    }

    // 更新书源
    BookSource.bookSourceComment = bookSourceComment
    BookSource.loginUrl = loginUrl
    BookSource.loginUi = loginUI? loginUI: `@js:\n${loginUIJS}`
    BookSource.loginCheckJs = loginCheckJsContent

    BookSource.bookUrlPattern = bookUrlPattern.split("\n")[1]
    BookSource.header = header
    BookSource.variableComment = `${variableComment}\n\n`
    BookSource.concurrentRate = "3/2000"
    BookSource.jsLib = jsLibContent

    BookSource.searchUrl = `@js:\n${searchUrlContent}`
    BookSource.ruleSearch.bookList = `@js:\n${searchContent}`

    BookSource.exploreUrl = `@js:\n${discoverAddressContent}`
    BookSource.ruleExplore.bookList = `@js:\n${discoverContent}`

    BookSource.ruleBookInfo.init = `@js:\n${detailContent}`
    BookSource.ruleToc.chapterList = `@js:\n${catalogContent}`

    BookSource.ruleContent.content = `@js:\n${contentContent}`
    BookSource.ruleContent.callBackJs = callBackJS

    BookSource.lastUpdateTime = lastUpdateTime
    // console.log(lastUpdateTime)

    if (sourceName === "pixiv") {
        BookSource.customOrder = 0
    } else if (sourceName === "pixivBackup") {
        BookSource.customOrder = 1
    } else if (sourceName === "pixivIllust") {
        BookSource.customOrder = 2
    } else if (sourceName === "linpx") {
        BookSource.customOrder = 3
    } else if (sourceName === "furryNovel") {
        BookSource.customOrder = 4
    }

    return BookSource
}

function buildPixivSource(test:boolean|number =undefined) {
    // 组合 Pixiv 书源
    const pixivMain = buildBookSource("pixiv", test)
    const pixivBackup = buildBookSource("pixivBackup", test)
    const pixivIllust = buildBookSource("pixivIllust", test)
    const allSources = [pixivMain, pixivBackup, pixivIllust]
    // 写入最终的 JSON 文件
    saveTextFile("", "pixiv.json", allSources)
}

function buildLinpxSource(test:boolean|number =undefined) {
    // 组合 Linpx 书源
    const linpx = buildBookSource("linpx", test)
    const furryNovel = buildBookSource("furryNovel", test)
    const allSources = [linpx, furryNovel]
    // 写入最终的 JSON 文件
    saveTextFile("", "linpx.json", allSources)
}

function main(test:boolean|number =undefined) {
    // 输出当前时间
    let options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"}
    console.log(new Date(Date.now()).toLocaleString("zh", options))
    console.log("——".repeat(11))
    if (!test) {
        let updateTimeNew = new Date(Date.now() + delayTime).toLocaleDateString("zh", options).slice(0, 10)
        console.log(`书源更新时间：\n${updateTimeNew}`)
    }
    buildPixivSource(test)
    buildLinpxSource(test)
}

let delayTime = 2 * 24 * 60 * 60 * 1000
// 获取当前 Git 分支名称
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
if (os.platform() === "win32" && currentBranch === 'main') {
    main(0)
} else {
    main(1)
}