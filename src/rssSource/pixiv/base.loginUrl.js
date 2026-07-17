function login() {
    let resp = java.startBrowserAwait(`https://accounts.pixiv.net/login,
    {"headers": {"User-Agent": ${getWebViewUA()}}}`, '登录账号', false)
    if (resp.code() === 200) {
        getCookie(); getCsrfToken()
        return true
    } else {
        java.log(resp.code()); sleepToast("🅿️ 登录账号\n\n⚠️ 登录失败")
        return false
    }
}

function logout() {
    removeCookie()
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号")
    removeCookie()
    sleepToast(`✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`)
}

function removeCookie() {
    cookie.removeCookie('https://www.pixiv.net')
    cookie.removeCookie('https://accounts.pixiv.net')
    cookie.removeCookie('https://accounts.google.com')
    cookie.removeCookie('https://api.weibo.com')
    cache.delete("pixivCookie")
    cache.delete("pixivCsrfToken")  // 与登录设备有关
    cache.delete("pixivHeaders")
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
function getCsrfToken() {
    let pixivCsrfToken
    let html = java.webView(null, "https://www.pixiv.net/", null)
    try {
        pixivCsrfToken = html.match(/token\\":\\"([a-z0-9]{32})/)[1]
    } catch (e) {
        pixivCsrfToken = null
    }
    // java.log(pixivCsrfToken)
    cache.put("pixivCsrfToken", pixivCsrfToken)  // 与登录设备有关
    return pixivCsrfToken
}

function getCookie() {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null))
    if (pixivCookie.includes("first_visit_datetime")) {
        // java.log(pixivCookie)
        cache.put("pixivCookie", pixivCookie, 60*60)
        return pixivCookie
    } else {
        cache.delete("pixivCookie")
        // sleepToast("未登录账号( pixivCookie)")
        return null
    }
}

function putInCacheObject(objectName, object, saveSeconds) {
    if (object === undefined) object = null
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(objectName, JSON.stringify(object), saveSeconds)
}

function getFromCacheObject(objectName) {
    let object = cache.get(objectName)
    if (object === undefined) return null  // 兼容源阅，避免 parse 报错
    return JSON.parse(object)
}

function statusMsg(status) {
    if (status === true) return "✅ 已开启"
    else if (status === false) return "🚫 已关闭"
    else if (status === undefined) return "🈚️ 未设置"
}

const settingsName = {
    "ADD_CHAPTER_INDEX": "🔢 章节编号",
    "AUTO_LIKE_NOVELS": "❤️ 自动收藏",
    "COMBINE_NOVELS": "📚 整合系列",
}

function editSettings(settingName) {
    let msg, status
    let settings = getFromCacheObject("pixivSettings")
    // if (!settings) settings = setDefaultSettings()
    if (!!settings[settingName]) {
        status = settings[settingName] = !settings[settingName]
    } else {
        status = settings[settingName] = true
    }
    putInCacheObject("pixivSettings", settings)
    msg = `\n\n${statusMsg(status)}　${settingsName[settingName]}`
    sleepToast(msg)
}

