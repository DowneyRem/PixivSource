import fs from "fs"
import path from "path"

interface RssSource {
    articleStyle: number
    concurrentRate: string
    contentBlacklist: string
    contentWhitelist: string
    coverDecodeJs: string
    customOrder: number
    enableJs: boolean
    enabled: boolean
    enabledCookieJar: boolean
    header: string
    injectJs: string
    jsLib: string
    lastUpdateTime: number
    loadWithBaseUrl: boolean
    loginCheckJs: string
    loginUi: string
    loginUrl: string
    preload: boolean
    ruleArticles: string
    ruleContent: string
    ruleDescription: string
    ruleImage: string
    ruleLink: string
    ruleNextPage: string
    rulePubDate :string
    ruleTitle :string
    searchUrl :string
    shouldOverrideUrlLoading: string
    showWebLog: boolean
    singleUrl: boolean
    sortUrl : string
    sourceComment: string
    sourceGroup: string
    sourceIcon: string
    sourceName: string
    sourceUrl: string
    startHtml: string
    startJs: string
    startStyle: string
    style: string
    type: number
    variableComment: string
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

function buildRssSource(sourceName:string): RssSource[] {
    // 需要在 项目根目录下执行
    let templatePath = `src/rssSource/${sourceName}.json`
    let defaultDataPath = `scripts/rssSource.json`

    // 读取基础模板
    let RssSources: RssSource[] = JSON.parse(readTextFile(templatePath))
    if (sourceName === "furry") RssSources = RssSources.slice(5, RssSources.length)
    const defaultData: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]

    // 填充默认数据
    RssSources.forEach(RssSource => {
        RssSource.lastUpdateTime = 1778342400251
        Object.keys(defaultData).forEach((key) => {
            if (RssSource[key] === undefined) RssSource[key] = defaultData[key]
        })
    })
    return cleanEmpty(RssSources)
}

const sourceNames = {
    pixiv : "Pixiv",
    linpx : "Linpx",
    furryNovel : "兽人小说站",
    repo : "Pixiv 书源",
    import2 : "一键导入",
}

function buildNovelSource(name:string): RssSource {
    // 需要在 项目根目录下执行
    let rssSourceFolder = `src/rssSource`
    let sourcePath = `src/rssSource/${name}`
    let templatePath = `src/rssSource/furry.json`
    let defaultDataPath = `scripts/rssSource.json`
    let sourceName = sourceNames[name]

    // 读取基础模板
    const RssSources: RssSource[] = JSON.parse(readTextFile(templatePath))
    const RssSource: RssSource = RssSources.find(item => item.sourceName === sourceName)
    const defaultData: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]

    // 读取各个构建后文件内容
    const sourceComment = readTextFile(path.join(sourcePath, "ReadMe.txt")) || ""
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js")) || ""
    const loginUI = readTextFile(path.join(sourcePath, "base.loginUI.json")) || ""

    const header = readTextFile(path.join(rssSourceFolder, "base.header.json")) || ""
    const jsLib = readTextFile(path.join(rssSourceFolder, "base.jsLib.js")) || ""
    const injectJs = readTextFile(path.join(rssSourceFolder, "webview.inject.js")) || ""

    // 填充默认数据
    Object.keys(defaultData).forEach((key) => {
        if (RssSource[key] === undefined) RssSource[key] = defaultData[key]
    })

    // 更新订阅
    RssSource.sourceComment = sourceComment
    RssSource.loginUrl = loginUrl
    RssSource.loginUi = loginUI

    if (name !== "repo" && name !== "import2" ) {
        RssSource.header = header
        RssSource.jsLib = jsLib
        RssSource.injectJs = injectJs
    }

    // 更新订阅更新时间
    let options = { year: "numeric", month: "2-digit", day: "2-digit"}
    let updateTimeNew = new Date(Date.now() + delayTime).toLocaleDateString("zh", options)
    RssSource.lastUpdateTime = Number(`${String(Date.parse(updateTimeNew)).slice(0, 10)}251`)

    // 去除空键
    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === false) delete RssSource[key]
        if (RssSource[key] === "") delete RssSource[key]
    })
    return RssSource
}

function buildBTSRKSource() {
    const pixiv = buildNovelSource("pixiv")
    const linpx = buildNovelSource("linpx")
    const furryNovel = buildNovelSource("furryNovel")
    const repo = buildNovelSource("repo")
    const import2 = buildNovelSource("import2")
    const furrySites = buildRssSource("furry")
    const allSources = [pixiv, linpx, furryNovel, repo, import2,  ...furrySites]
    saveTextFile("", "btsrk.json", allSources)
}

function buildSearchSource() {
    let sourcePath = `src/rssSource/search`
    let defaultDataPath = `scripts/rssSource.json`
    // 读取基础模板
    let RssSource: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]
    // 读取各个构建后文件内容
    const ruleArticles = readTextFile(path.join(sourcePath, "list.ruleArticles.json"))
    const injectJs = readTextFile(path.join(sourcePath, "webview.inject.js"))

    RssSource.sourceName = "聚合搜索"
    RssSource.sourceUrl = "https://www.baidu.com"
    RssSource.sourceIcon = "https://5b0988e595225.cdn.sohucs.com/q_70,c_zoom,w_640/images/20180118/22271e695f5f48a89795e2b9858f5008.jpeg"
    RssSource.sourceGroup = "🔍 搜索"
    RssSource.singleUrl = false
    RssSource.customOrder = 10

    RssSource.ruleArticles = `@js:\n${ruleArticles}`
    RssSource.ruleTitle = "name"
    RssSource.ruleLink = "url"
    RssSource.injectJs = injectJs

    RssSource.lastUpdateTime = 1778342400251
    // RssSource.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)
    // 去除空键
    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === false) delete RssSource[key]
        if (RssSource[key] === "") delete RssSource[key]
    })
    return RssSource
}

function buildBooksSources() {
    const books = buildRssSource("books")
    const search = buildSearchSource()
    const allSources = [...books, search]
    saveTextFile("", "books.json", allSources)
}

function buildImportSource() {
    // 需要在 项目根目录下执行
    let sourcePath = `src/rssSource/import`
    let defaultDataPath = `scripts/rssSource.json`

    // 读取基础模板
    let RssSource: RssSource = JSON.parse(readTextFile(defaultDataPath))[0]
    // 读取各个构建后文件内容
    const sourceComment = readTextFile(path.join(sourcePath, "base.sourceComment.txt"))
    const sortUrl  = readTextFile(path.join(sourcePath, "base.sortUrl.js"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const header = readTextFile(path.join(sourcePath, "base.header.json"))

    const ruleArticles = readTextFile(path.join(sourcePath, "list.ruleArticles.js"))
    const ruleNextPage = readTextFile(path.join(sourcePath, "list.ruleNextPage.js"))
    const ruleTitle = readTextFile(path.join(sourcePath, "list.ruleTitle.txt"))

    const rulePubDate = readTextFile(path.join(sourcePath, "list.rulePubDate.js"))
    const ruleDescription = readTextFile(path.join(sourcePath, "list.ruleDescription.js"))
    const ruleImage = readTextFile(path.join(sourcePath, "list.ruleImage.js"))
    const ruleLink = readTextFile(path.join(sourcePath, "list.ruleLink.js"))

    RssSource.sourceName = "书源订阅"
    RssSource.sourceUrl = "https://codeberg.org/DowneyRem/PixivSource"
    RssSource.sourceIcon = "https://cdn.jsdelivr.net/gh/DowneyRem/PixivSource@main/doc/pic/BookSourcePixiv.png"
    RssSource.sourceGroup = "🅿️ Pixiv,🐲 Furry,书源"
    RssSource.variableComment = "【刷新分类】【刷新分类】【刷新分类】"
    RssSource.singleUrl = false
    RssSource.lastUpdateTime = 1778342400251
    // RssSource.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)

    // 基本页面，按顺序排序
    RssSource.sourceComment = sourceComment
    RssSource.sortUrl = sortUrl
    RssSource.loginUrl = loginUrl
    RssSource.header = header

    // 列表页面，按顺序排序
    RssSource.ruleArticles = ruleArticles
    RssSource.ruleNextPage = ruleNextPage
    RssSource.ruleTitle = ruleTitle
    RssSource.rulePubDate = rulePubDate
    RssSource.ruleDescription = ruleDescription
    RssSource.ruleImage = ruleImage
    RssSource.ruleLink = ruleLink

    // 去除空键
    Object.keys(RssSource).forEach((key) => {
        if (RssSource[key] === false) delete RssSource[key]
        if (RssSource[key] === "") delete RssSource[key]
    })
    saveTextFile("", "import.json", [RssSource])
}

function main() {
    // 输出当前时间
    let options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"}
    console.log(new Date(Date.now()).toLocaleString("zh", options))
    console.log("——".repeat(11))
    let updateTimeNew = new Date(Date.now() + delayTime).toLocaleString("zh", options).slice(0, 10)
    console.log(`订阅更新时间：\n${updateTimeNew}`)
    buildBTSRKSource()
    // buildBooksSources()
    // buildImportSource()
}

let delayTime = 2 * 24 * 60 * 60 * 1000

main()