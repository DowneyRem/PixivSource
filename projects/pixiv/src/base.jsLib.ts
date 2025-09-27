/**
 * jsLib: 由App注入Runtime的脚本部分，被整个运行环境共享，存在一些用法限制
 * 导入此模块的方法将不会被打包进最终的js文件中
 *
 * 模块编写时需export对象，否则可能被打包器优化掉。
 */

export const cacheSaveSeconds = 7 * 24 * 60 * 60; // 缓存时间7天

export function cacheGetAndSet<T>(
    cache: CacheManager,
    key: string,
    supplyFunc: () => T,
): T {
    let v = cache.get(key);
    if (v === undefined || v === null) {
        v = JSON.stringify(supplyFunc());
        cache.put(key, v, cacheSaveSeconds);
    }
    return JSON.parse(v);
}

export function putInCache(
    objectName: string,
    object: any,
    saveSeconds?: number,
) {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;
    if (object === undefined) object = null;
    if (!saveSeconds) saveSeconds = 0;
    cache.put(objectName, JSON.stringify(object), saveSeconds);
}

export function getFromCache(objectName: string): any | null {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;
    let object = cache.get(objectName);
    if (object === undefined || object === null) return null; // 兼容源阅
    return JSON.parse(object);
}

export function isHtmlString(str: string): boolean {
    return str.startsWith("<!DOCTYPE html>");
}

export function isJsonString(str: string): boolean {
    try {
        if (typeof JSON.parse(str) === "object") {
            return true;
        }
    } catch (e) {}
    return false;
}

export function getWebViewUA(): string {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;
    let userAgent = String(java.getWebViewUA());
    if (userAgent.includes("Windows NT 10.0; Win64; x64")) {
        userAgent =
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36";
    }
    // java.log(`userAgent=${userAgent}`)
    cache.put("userAgent", userAgent);
    return String(userAgent);
}

export function isLogin(): boolean {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;
    let cookie = String(java.getCookie("https://www.pixiv.net/", null));
    return cookie.includes("first_visit_datetime");
}

export function getAjaxJson(url: string, forceUpdate: boolean = false): any {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;

    if (forceUpdate === true) {
        let result = JSON.parse(java.ajax(url));
        cache.put(url, JSON.stringify(result), cacheSaveSeconds);
        return result;
    }

    return cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url));
    });
}

export function getAjaxAllJson(
    urls: string[],
    forceUpdate: boolean = false,
): any[] {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;

    const cacheKey = urls.join(",");
    if (forceUpdate === true) {
        const result = java.ajaxAll(urls).map(resp => JSON.parse(resp.body()));
        cache.put(cacheKey, JSON.stringify(result), cacheSaveSeconds);
        for (const i in urls) {
            cache.put(urls[i]!, JSON.stringify(result[i]), cacheSaveSeconds);
        }

        return result;
    }

    return cacheGetAndSet(cache, cacheKey, () => {
        const result = java.ajaxAll(urls).map(resp => JSON.parse(resp.body()));
        cache.put(cacheKey, JSON.stringify(result), cacheSaveSeconds);
        for (const i in urls) {
            cache.put(urls[i]!, JSON.stringify(result[i]), cacheSaveSeconds);
        }
        return result;
    });
}

export function getWebviewJson(
    url: string,
    parseFunc: (html: string | null) => string,
): any {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;

    return cacheGetAndSet(cache, url, () => {
        let html = java.webView(undefined, url, undefined);
        return JSON.parse(parseFunc(html));
    });
}

export function urlNovelUrl(novelId: string | number): string {
    return `https://www.pixiv.net/novel/show.php?id=${novelId}`;
}

export function urlNovelDetailed(novelId: string | number): string {
    return `https://www.pixiv.net/ajax/novel/${novelId}`;
}

export function urlNovelsDetailed(
    userId: string | number,
    nidList: (string | number)[],
): string {
    return `https://www.pixiv.net/ajax/user/${userId}/novels?${nidList.map(v => "ids[]=" + v).join("&")}`;
}

export function urlNovelBookmarkData(novelId: string | number) {
    return `https://www.pixiv.net/ajax/novel/${novelId}/bookmarkData`;
}

export function urlNovelComments(
    novelId: string | number,
    offset: number,
    limit: number,
) {
    return `https://www.pixiv.net/ajax/novels/comments/roots?novel_id=${novelId}&offset=${offset}&limit=${limit}&lang=zh`;
}

export function urlNovelCommentsReply(
    commentId: string | number,
    page: number,
) {
    return `https://www.pixiv.net/ajax/novels/comments/replies?comment_id=${commentId}&page=${page}&lang=zh`;
}

export function urlSeriesUrl(seriesId: string | number): string {
    return `https://www.pixiv.net/novel/series/${seriesId}`;
}

export function urlSeriesDetailed(seriesId: string | number): string {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}?lang=zh`;
}

export function urlSeriesNovelsTitles(seriesId: string | number): string {
    return `https://www.pixiv.net/ajax/novel/series/${seriesId}/content_titles`;
}

export function urlSeriesNovels(
    seriesId: string | number,
    limit: number,
    offset: number,
): string {
    if (limit > 30) limit = 30;
    if (limit < 10) limit = 10;
    return `https://www.pixiv.net/ajax/novel/series_content/${seriesId}?limit=${limit}&last_order=${offset}&order_by=asc&lang=zh`;
}

export function urlUserUrl(userID: string | number): string {
    return `https://www.pixiv.net/users/${userID}/novels`;
}

export function urlUserDetailed(userID: string | number): string {
    return `https://www.pixiv.net/ajax/user/${userID}`;
}

export function urlUserWorkLatest(userID: string | number): string {
    return `https://www.pixiv.net/ajax/user/${userID}/works/latest`;
}

export function urlUserAllWorks(userId: string | number): string {
    return `https://www.pixiv.net/ajax/user/${userId}/profile/all?lang=zh`;
}

export function urlSearchNovel(
    novelName: string,
    page: number | string,
): string {
    return `https://www.pixiv.net/ajax/search/novels/${encodeURI(novelName)}?word=${encodeURI(novelName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&lang=zh`;
}

export function urlSearchSeries(seriesName: string, page: number): string {
    return `https://www.pixiv.net/ajax/search/novels/${encodeURI(seriesName)}?word=${encodeURI(seriesName)}&order=date_d&mode=all&p=${page}&s_mode=s_tag&gs=1&lang=zh`;
}

// 不完全匹配用户名
export function urlSearchUser(userName: string, full?: boolean): string {
    if (full === undefined || full === false) {
        return `https://www.pixiv.net/search/users?nick=${userName}&s_mode=s_usr&nick_mf=1`;
    } else {
        return `https://www.pixiv.net/search/users?nick=${userName}&s_mode=s_usr_full&i=1`;
    }
}

export function urlCoverUrl(url: string): string {
    return `${url}, {"headers": {"Referer":"https://www.pixiv.net/"}}`;
}

export function urlIllustDetailed(illustId: string | number): string {
    return `https://www.pixiv.net/ajax/illust/${illustId}?lang=zh`;
}

export function urlIllustOriginal(
    illustId: string | number,
    order: number,
): string {
    // @ts-ignore
    const { java, cache }: { java: JavaExt; cache: CacheManager } = this;

    if (order <= 1) order = 1;
    let url = urlIllustDetailed(illustId);
    let illustOriginal = cacheGetAndSet(cache, url, () => {
        return JSON.parse(java.ajax(url));
    }).body.urls.original;
    return urlCoverUrl(illustOriginal.replace(`_p0`, `_p${order - 1}`));
}

export function urlEmojiUrl(emojiId: string | number) {
    return urlCoverUrl(
        `https://s.pximg.net/common/images/emoji/${emojiId}.png`,
    );
}

export function urlStampUrl(stampId: string | number) {
    return urlCoverUrl(
        `https://s.pximg.net/common/images/stamp/generated-stamps/${stampId}_s.jpg`,
    );
}

export function urlMessageThreadLatest(max: number): string {
    if (max === undefined || max <= 5) max = 5;
    return `https://www.pixiv.net/rpc/index.php?mode=latest_message_threads2&num=${max}&lang=zh`;
}

export function urlMessageThreadContents(
    threadId: string | number,
    max: number,
): string {
    return `https://www.pixiv.net/rpc/index.php?mode=message_thread_contents&thread_id=${threadId}&num=${max}`;
}

export function urlMessageThreadDetail(threadId: string | number): string {
    return `https://www.pixiv.net/rpc/index.php?mode=message_thread&thread_id=${threadId}`;
}

export function urlNotification() {
    return `https://www.pixiv.net/ajax/notification&lang=zh`;
}

export function dateFormat(str: string): string {
    let addZero = function (num: number): string {
        return num < 10 ? "0" + num.toString() : num.toString();
    };
    let time = new Date(str);
    let Y = time.getFullYear() + "年";
    let M = addZero(time.getMonth() + 1) + "月";
    let D = addZero(time.getDate()) + "日";
    return Y + M + D;
}

export function timeFormat(value: number | string | Date): string {
    let addZero = function (num: number): string {
        return num < 10 ? "0" + num.toString() : num.toString();
    };
    let time = new Date(value);
    let YY = time.getFullYear();
    let MM = addZero(time.getMonth() + 1);
    let DD = addZero(time.getDate());
    let hh = addZero(time.getHours());
    let mm = addZero(time.getMinutes());
    let ss = addZero(time.getSeconds());
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}

export function timeTextFormat(text: string): string {
    return `${text.slice(0, 10)} ${text.slice(11, 19)}`;
}

export function sleep(time: number): void {
    let endTime = new Date().getTime() + time;
    while (true) {
        if (new Date().getTime() > endTime) {
            return;
        }
    }
}

export function sleepToast(text: string, second?: number): void {
    // @ts-ignore
    const { java }: { java: JavaExt } = this;

    java.log(text);
    java.longToast(text);
    if (second === undefined) second = 0.01;
    sleep(1000 * second);
}

export function updateSource() {
    // @ts-ignore
    const { java, source }: { java: JavaExt; source: BookSource } = this;

    java.longToast("🆙 更新书源\n\nJsdelivr CDN 更新有延迟\nGithub 更新需代理");
    let onlineSource: any,
        comment: string[],
        sourceName: string = "pixiv", // default pixiv
        sourceNameCapitalize: string,
        index = 0;
    if (source.bookSourceUrl.includes("pixiv")) sourceName = "pixiv";
    else if (source.bookSourceUrl.includes("furrynovel")) sourceName = "linpx";
    sourceNameCapitalize =
        sourceName[0].toUpperCase() + sourceName.substring(1);

    if (source.bookSourceName.includes("备用")) index = 1;
    else if (source.bookSourceName.includes("漫画")) index = 2;
    if (source.bookSourceUrl.includes("furrynovel.com")) {
        sourceNameCapitalize = "FurryNovel";
        index = 1;
    }

    try {
        let updateUrl = `https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/${sourceName}.json`;
        onlineSource = JSON.parse(
            java
                .get(updateUrl, {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 14)",
                    "X-Requested-With": "XMLHttpRequest",
                })
                .body(),
        )[index];
    } catch (e) {
        try {
            let updateUrl = `https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json`;
            onlineSource = JSON.parse(
                java
                    .get(updateUrl, {
                        "User-Agent": "Mozilla/5.0 (Linux; Android 14)",
                        "X-Requested-With": "XMLHttpRequest",
                    })
                    .body(),
            )[index];
        } catch (e) {
            onlineSource = {
                lastUpdateTime: new Date().getTime(),
                bookSourceComment: source.bookSourceComment,
            };
        }
    }
    comment = onlineSource.bookSourceComment.split("\n");
    // comment = source.bookSourceComment.split("\n")
    let htm = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>更新 ${source.bookSourceName} 书源</title>
    <style> 
    table { text-align: center; margin: 0 auto; } .ann { display: flex; justify-content: center; align-items: center; height: 5vh; } 
    button { background-color: rgb(76, 175, 80); color: white; border: none; border-radius: 4px; height: 6vh; width: 30vw; overflow: hidden; } 
    button span { cursor: pointer; display: inline-block; position: relative; transition: 0.4s; } 
    button span:after { content: '>'; position: absolute; opacity: 0; top: 0; right: 30px; transition: 0.2s; } 
    button:active span { padding-right: 20px; } 
    button:active span:after { opacity: 1; right: -40px; }
    </style>
</head>

<body>
    <table border="1" cellspacing="0">
        <th colspan="2"> ${source.bookSourceName} 书源 <a href="https://github.com/windyhusky/PixivSource/blob/main/doc/${sourceNameCapitalize}.md">🔰 使用指南</a></th>
        <tr>
            <td>☁️ 远程版本：${onlineSource.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(onlineSource.lastUpdateTime)}</td>
        </tr>
        <tr>
            <td>📥 本地版本：${source.bookSourceComment.split("\n")[2].replace("书源版本：", "")}</td>
            <td>📆 更新：${timeFormat(source.lastUpdateTime)}</td>
        </tr> 
        <tr><td colspan="2" style="text-align: left;">${comment.slice(3, 10).join("<br>")}</td></tr>
        <tr><td colspan="2" style="text-align: left;">${comment.slice(comment.length - 15, comment.length).join("<br>")}</td></tr>
    </table>
    
    <table border="0" cellspacing="20">
        <th colspan="2"> 更新 ${source.bookSourceName} 书源 </th>
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/${sourceName}.json">
            <button><span>更新书源<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://cdn.jsdelivr.net/gh/windyhusky/PixivSource@main/btsrk.json">
            <button><span>更新订阅<br>(Jsdelivr CDN)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/${sourceName}.json">
            <button><span>书源链接<br>(GitHub)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://raw.githubusercontent.com/windyhusky/PixivSource/main/btsrk.json">
            <button><span>订阅链接<br>(GitHub)</span></button>
            </a></div></td>
        </tr>
        
        <tr><td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/${sourceName}.json">
            <button><span>备用书源链接<br>(Codeberg)</span></button>
            </a></div></td>
            
            <td><div class="ann">
            <a href="legado://import/importonline?src=https://codeberg.org/DowneyRem/PixivSource/raw/branch/main/btsrk.json">
            <button><span>备用订阅链接<br>(Codeberg)</span></button>
            </a></div></td>
        </tr>
    </table>
</body>
</html>`;
    java.startBrowser(
        `data:text/html;charset=utf-8;base64, ${java.base64Encode(htm)}`,
        "更新书源",
    );
    return [];
}

/**
 * 从缓存获取 likeAuthors 数据并转换为有序的 Map
 * @returns Map<string, string> 用户ID到用户名的映射
 */
export function getLikeAuthorsMap(): Map<string, string> {
    // @ts-ignore
    const { cache }: { cache: CacheManager } = this;

    const cached = cache.get("likeAuthors");
    const likeAuthorsMap = new Map<string, string>();

    if (cached === null || cached === undefined) {
        return likeAuthorsMap;
    }

    let parsedData: any;
    try {
        parsedData = JSON.parse(cached);
    } catch (e) {
        return likeAuthorsMap;
    }

    // 处理新格式：数组形式 [{'key1': 'value1'}, {'key2': 'value2'}]
    if (Array.isArray(parsedData)) {
        parsedData.forEach((item: any) => {
            for (const key in item) {
                likeAuthorsMap.set(key, item[key]);
            }
        });
    } else {
        // 兼容旧格式：对象形式 {'key1': 'value1', 'key2': 'value2'}
        for (const key in parsedData) {
            likeAuthorsMap.set(key, parsedData[key]);
        }
    }

    return likeAuthorsMap;
}

/**
 * 将 Map 转换为有序数组格式并保存到缓存
 * @param likeAuthorsMap 用户ID到用户名的映射
 */
export function saveLikeAuthorsMap(likeAuthorsMap: Map<string, string>): void {
    // @ts-ignore
    const { cache }: { cache: CacheManager } = this;

    const orderedArray: Array<Record<string, string>> = [];

    likeAuthorsMap.forEach((userName, userId) => {
        const item: Record<string, string> = {};
        item[userId] = userName;
        orderedArray.push(item);
    });

    cache.put("likeAuthors", JSON.stringify(orderedArray));
}

/**
 * 将 Map 转换为有序数组格式并保存到缓存
 * @param mapName map name
 * @param mapObject map 用户ID到用户名的映射
 * @param saveSeconds 缓存时间
 */
export function putInCacheMap(mapName:String, mapObject: Map<string, string>, saveSeconds?: Number) {
    // @ts-ignore
    const { cache }: { cache: CacheManager } = this
    let orderedArray: Array<Record<string, string>> = [];
    mapObject.forEach((value, key) => {
        const item = {}
        item[key] = value
        orderedArray.push(item)
    })
    // [{'key1': 'value1'}, {'key2': 'value2'}]
    if (saveSeconds === undefined) saveSeconds = 0
    cache.put(mapName, JSON.stringify(orderedArray), saveSeconds)
}

/**
 * 将 Map 转换为有序数组格式并保存到缓存
 * @param mapName 用户ID到用户名的映射
 */
export function getFromCacheMap(mapName: String) {
    // @ts-ignore
    const { cache }: { cache: CacheManager } = this
    let cached = cache.get(mapName)
    let newMap = new Map()
    if (cached === null || cached === undefined) {
        return newMap
    }
    
    let parsedData
    try {
        parsedData = JSON.parse(cached)
    } catch (e) {
        return newMap
    }
    
    if (Array.isArray(parsedData)) {
        parsedData.forEach(item => {
            for (let key in item) {
                newMap.set(key, item[key])
            }
        })
    } else {
        for (let key in parsedData) {
            newMap.set(key, parsedData[key])
        }
    }
    return newMap
}
