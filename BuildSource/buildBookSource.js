import fs from "fs"
import path from "path"

function readTextFile(filePath) {
    if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8").trim()
        return data.split("\r\n").join("\n")
    }
    return ""
}

function saveJsonFile(folder, fileName, data) {
    if (folder && !fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    const outputPath = path.join(folder, fileName)
    data = JSON.stringify(data, null, 4)
    fs.writeFileSync(outputPath, data, "utf-8",)
    console.log(`✅  ${outputPath} 生成成功`)
}

function buildBookSource(sourceName) {
    // 需要在 项目根目录下执行
    let sourcePath = `bookSource/${sourceName}`
    let templatePath = `BuildSource/${sourceName}.json`
    // console.log(sourcePath)
    // console.log(templatePath)

    // 读取基础模板
    const BookSource = JSON.parse(readTextFile(templatePath))[0]

    // 读取各个构建后文件内容
    const bookSourceComment = readTextFile(path.join(sourcePath, "ReadMe.txt"))
    const loginUrl = readTextFile(path.join(sourcePath, "base.loginUrl.js"))
    const loginUrlContent = readTextFile(path.join(sourcePath, "base.loginUrl.txt"))
    const loginUI = readTextFile(path.join(sourcePath, "base.loginUI.json"))
    const loginCheckJsContent = readTextFile(path.join(sourcePath, "base.loginCheckJS.js")) || readTextFile(path.join(sourcePath, "base.loginCheckJs.js"))

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

    // 更新书源
    BookSource.bookSourceComment = bookSourceComment
    BookSource.loginUrl = loginUrl? loginUrl : loginUrlContent
    BookSource.loginUi = loginUI
    BookSource.loginCheckJs = loginCheckJsContent

    BookSource.bookUrlPattern = bookUrlPattern.split("\r\n")[1]
    BookSource.header = header
    BookSource.variableComment = variableComment
    BookSource.concurrentRate = "3/2000"
    BookSource.jsLib = jsLibContent

    BookSource.searchUrl = `@js:\n${searchUrlContent}`
    BookSource.ruleSearch.bookList = `@js:\n${searchContent}`

    BookSource.exploreUrl = `@js:\n${discoverAddressContent}`
    BookSource.ruleExplore.bookList = `@js:\n${discoverContent}`

    BookSource.ruleBookInfo.init = `@js:\n${detailContent}`
    BookSource.ruleToc.chapterList = `@js:\n${catalogContent}`
    BookSource.ruleContent.content = `@js:\n${contentContent}`

    BookSource.lastUpdateTime = Number(`${String(Date.now()).slice(0, 10)}251`)
    // console.log(`${String(Date.now()).slice(0, 10)}251`)

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

function buildPixivSource() {
    // 组合 Pixiv 书源
    const pixivMain = buildBookSource("pixiv")
    const pixivBackup = buildBookSource("pixivBackup")
    const pixivIllust = buildBookSource("pixivIllust")
    const allSources = [pixivMain, pixivBackup, pixivIllust]
    // 写入最终的 JSON 文件
    saveJsonFile("", "pixiv.json", allSources)
}

function buildLinpxSource() {
    // 组合 Linpx 书源
    const linpx = buildBookSource("linpx")
    const furrynovel = buildBookSource("furryNovel")
    const allSources = [linpx, furrynovel]
    // 写入最终的 JSON 文件
    saveJsonFile("", "linpx.json", allSources)
}

function main() {
    buildPixivSource()
    buildLinpxSource()
}

main()