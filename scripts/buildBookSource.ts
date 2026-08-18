import os from "os"
import fs from "fs"
import path from "path"
import { execSync } from 'node:child_process'

interface BookSource {
    bookSourceType: number
    enabled: boolean
    enabledExplore: boolean
    enabledCookieJar: boolean
    eventListener: boolean
    customButton: boolean

    bookSourceUrl: string
    bookSourceName: string
    bookSourceGroup: string
    bookSourceComment: string

    loginUrl: string
    loginUi: string
    loginCheckJs: string

    bookUrlPattern: string
    header: string
    variableComment: string
    concurrentRate: string
    jsLib: string

    searchUrl: string
    ruleSearch: {
        checkKeyWord: string
        bookList: string
        name: string
        author: string
        kind: string
        wordCount: string
        lastChapter: string
        intro: string
        coverUrl: string
        bookUrl: string
    }

    exploreUrl: string
    ruleExplore: {
        bookList: string
        name: string
        author: string
        kind: string
        wordCount: string
        lastChapter: string
        intro: string
        coverUrl: string
        bookUrl: string
    }

    ruleBookInfo: {
        init: string
        name: string
        author: string
        kind: string
        wordCount: string
        lastChapter: string
        intro: string
        coverUrl: string
        bookUrl: string
        canReName: string
        downloadUrls: string
    }

    ruleToc: {
        preUpdateJs: string
        chapterList: string
        chapterName: string
        chapterUrl: string
        formatJs: string
        isVolume: string
        updateTime: string
        isPay: string
        isVip: string
        nextTocUrl: string
    }

    ruleContent: {
        content: string
        subContent: string
        title: string
        nextContentUrl: string
        webJs: string
        sourceRegex: string
        replaceRegex: string
        imageStyle: string
        imageDecode: string
        payAction: string
        callBackJs: string
    }

    customOrder: number
    lastUpdateTime: number
    respondTime: number
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

function cleanEmpty(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj

    if (Array.isArray(obj)) {
        return obj.map(cleanEmpty)
    }

    const result: any = {}
    for (const key in obj) {
        const value = cleanEmpty(obj[key])
        if (value === false || value === "") continue
        result[key] = value
    }
    return result
}

function buildBookSource(sourceName:string, test:boolean|number =undefined): BookSource {
    // 需要在 项目根目录下执行
    let sourcePath = `src/bookSource/${sourceName}`
    let templatePath = `scripts/bookSource.json`
    let defaultDataPath = `src/bookSource/sourceData.json`
    // console.log(sourcePath)

    // 读取基础模板
    const BookSource: BookSource = JSON.parse(readTextFile(templatePath))[0]
    const sourceData = JSON.parse(readTextFile(defaultDataPath))

    // 读取基础构建文件
    let bookSourceComment = readTextFile(path.join(sourcePath, "ReadMe.txt"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const loginUI = readTextFile(path.join(sourcePath, "base.loginUI.json"))
    const loginUIJS = readTextFile(path.join(sourcePath, "base.loginUI.js"))
    const loginCheckJsContent = readTextFile(path.join(sourcePath, "base.loginCheckJS.js"))

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
    BookSource.bookSourceType = sourceData[sourceName].bookSourceType
    BookSource.enabled = sourceData[sourceName].enabled
    BookSource.enabledExplore = sourceData[sourceName].enabledExplore
    BookSource.customOrder = sourceData[sourceName].customOrder

    BookSource.bookSourceUrl = sourceData[sourceName].bookSourceUrl
    BookSource.bookSourceName = sourceData[sourceName].bookSourceName
    BookSource.bookSourceGroup = sourceData[sourceName].bookSourceGroup
    BookSource.bookSourceComment = bookSourceComment

    BookSource.loginUrl = loginUrl
    BookSource.loginUi = loginUI? loginUI: `@js:\n${loginUIJS}`
    BookSource.loginCheckJs = loginCheckJsContent

    BookSource.bookUrlPattern = bookUrlPattern.split("\n")[1]
    BookSource.header = header
    BookSource.variableComment = `${variableComment}\n\n`
    BookSource.concurrentRate = "30/5000"
    BookSource.jsLib = jsLibContent

    BookSource.searchUrl = `@js:\n${searchUrlContent}`
    BookSource.ruleSearch.bookList = `@js:\n${searchContent}`
    BookSource.ruleSearch.checkKeyWord = sourceData[sourceName].checkKeyWord

    BookSource.exploreUrl = `@js:\n${discoverAddressContent}`
    BookSource.ruleExplore.bookList = `@js:\n${discoverContent}`

    BookSource.ruleBookInfo.init = `@js:\n${detailContent}`
    BookSource.ruleToc.chapterList = `@js:\n${catalogContent}`

    BookSource.ruleContent.content = `@js:\n${contentContent}`
    BookSource.ruleContent.callBackJs = callBackJS

    BookSource.lastUpdateTime = lastUpdateTime
    // console.log(lastUpdateTime)

    // 去除空键
    return cleanEmpty(BookSource)
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
// 获取当前分支
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

// 从命令行参数判断模式
const args = process.argv.slice(2)
const isDevMode = args.includes('--dev')
const isReleaseMode = args.includes('--release')

let isRelease = false
if (isDevMode) {
    isRelease = false
} else if (isReleaseMode) {
    isRelease = true
} else if (currentBranch === "main") {
    isRelease = true
}

console.log(`📍 当前分支: ${currentBranch}`)
console.log(`🔧 构建模式: ${isRelease ? '正式发布 (Release)' : '开发测试 (Dev)'}`)

if (isRelease) {
    main(0)
} else {
    main(1)
}