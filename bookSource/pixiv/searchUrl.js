java.put("key", key)
java.put("page", page)
let keyword = key.split(" ")
let limitedTextCount
if (key.includes("字数") || key.includes("字數") ) {
    limitedTextCount = keyword.pop()
    keyword = keyword.join(" ")
} else {
    limitedTextCount = ""
    keyword = key
}
java.put("keyword", keyword)
java.put("limitedTextCount", limitedTextCount)

if (keyword.startsWith("@") || keyword.startsWith("＠")) {
    keyword = keyword.slice(1)
    if (keyword.includes("#") || keyword.includes("＃")) {
        let author = keyword.split(" ")[0]
        let tags = keyword.replace(author, "").trim().slice(1)
        java.put("keyword", `@${author}`)
        java.put("inputTags", tags)
        java.log(`👤 搜索作者：${author} #️⃣ 过滤标签：${tags.replace(" ", "、")}`)
    } else {
        java.put("keyword", `@${keyword}`)
        java.log(`👤 搜索作者：${keyword.slice(1)}`)
    }

} else if (keyword.startsWith("#") || keyword.startsWith("＃")) {
    keyword = keyword.slice(1)
    java.log(`#️⃣ 搜索标签：${keyword}`)
    java.put("keyword", `#${keyword}`)

} else {
    java.log(`🔍 搜索内容：${keyword}`)
}
urlIP(urlSearchSeries(keyword, page))