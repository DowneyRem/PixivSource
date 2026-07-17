function getWebViewUA() {
    let {java} = this
    let userAgent = String(java.getWebViewUA())
    return String(userAgent)
}

function sleep(seconds) {
    return Packages.java.lang.Thread.sleep(1000*seconds)
}

function sleepToast(text, second) {
    const {java} = this
    java.log(text)
    java.longToast(text)
    if (second === undefined) {second = 0.01}
    this.sleep(second)
}

function startBrowser(url, title) {
    const {java} = this
    let msg = "", headers = `{"headers": {"User-Agent":"${this.getWebViewUA()}"}}`
    if (url.includes("pixiv.net")) {
        msg += "\n\n即将打开 Pixiv\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("github")) {
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等"
    } else if (url.includes("https://t.me/")){
        msg += "\n\n即将打开 Telegram\n请确认已开启代理/梯子/VPN等"
    }
    if (msg) this.sleepToast(msg)
    java.startBrowser(`${url}, ${headers}`, title)
}

function startPixivSettings() {
    const {java} = this
    this.startBrowser("https://www.pixiv.net/settings/viewing", "账号设置")
}

function startGithubReadme() {
    const {java, source} = this
    if (source.sourceUrl.includes("pixiv.net")) {
        this.startBrowser("https://pixivsource.pages.dev/Pixiv", "书源指南")
    } else if (source.sourceUrl.includes("linpx.ink")) {
        this.startBrowser("https://pixivsource.pages.dev/Linpx", "书源指南")
    } else if (source.sourceUrl.includes("furrynovel.com")) {
        this.startBrowser("https://pixivsource.pages.dev/FurryNovel", "书源指南")
    }
}

function startGithubIssue() {
    const {java} = this
    this.startBrowser("https://github.com/DowneyRem/PixivSource/issues", "反馈问题")
}
function startGithub() {
    const {java} = this
    this.startBrowser("https://github.com/DowneyRem/PixivSource", "收藏项目")
}

function startGithubIntroduction() {
    const {java} = this
    this.startBrowser("https://pixivsource.pages.dev/BetterExperience", "使用指南")
}
function startGithubWebdavBackup() {
    const {java} = this
    this.startBrowser("https://pixivsource.pages.dev/WebdavBackup", "备份恢复")
}
function startGithubRemoteBooks() {
    const {java} = this
    this.startBrowser("https://pixivsource.pages.dev/RemoteBooks", "远程书籍")
}
function startGithubSponsor() {
    const {java} = this
    this.startBrowser("https://pixivsource.pages.dev/Sponsor", "支持开发")
}

function startTelegram() {
    const {java} = this
    this.startBrowser("https://t.me/PixivSource", "书源频道")
}
function startTelegramLegado() {
    const {java} = this
    this.startBrowser("https://t.me/ReadSigma", "阅读频道")
}
function startTelegramFurryReading() {
    const {java} = this
    this.startBrowser("https://t.me/FurryReadingRE", "兽人阅读频道")
}