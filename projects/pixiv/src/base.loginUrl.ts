import {
    MAX_PAGE_CONFIG_NAME,
    MaxPageConfigKey,
    type Settings,
    SETTINGS_NAME,
} from "./settings";
import { getLikeAuthorsMap, saveLikeAuthorsMap } from "./base.jsLib";
import {
    cacheSaveSeconds,
    getAjaxJson,
    getFromCache,
    getFromCacheMap,
    getWebViewUA,
    isJsonString,
    isLogin,
    putInCache,
    putInCacheMap,
    sleep,
    sleepToast,
    urlNovelBookmarkData,
    urlNovelComments,
    urlNovelCommentsReply,
    urlNovelDetailed,
    urlNovelUrl,
    urlSearchNovel,
    urlSeriesDetailed,
    urlSeriesUrl,
    urlUserDetailed,
    urlUserUrl,
} from "./base.jsLib";

export function login(): boolean {
    sleepToast("🔄 正在检测登陆状态，请稍候");
    if (isLogin()) {
        sleepToast(
            "️🅿️ 登录账号\n✅ 已经登录过账号了\n\n可以点击【🔙 退出账号】来切换账号",
        );
        return false;
    }

    let resp = java.startBrowserAwait(
        `https://accounts.pixiv.net/login,
  {"headers": {"User-Agent": ${getWebViewUA()}}}`,
        "登录账号",
        false,
    );
    if (resp.code() === 200) {
        getCookie();
        getCsrfToken();
        return true;
    } else {
        java.log(resp.code());
        sleepToast("🅿️ 登录账号\n\n⚠️ 登录失败");
        return false;
    }
}

export function logout() {
    removeCookie();
    java.startBrowser("https://www.pixiv.net/logout.php", "退出账号");
    removeCookie();
    removeLikeDataCache();
    removeSettingsCache();
    sleepToast(
        `✅ 已退出当前账号\n\n退出后请点击右上角的 ✔️ 退出\n\n登录请点击【登录账号】进行登录`,
    );
}

export function removeCookie() {
    cookie.removeCookie("https://www.pixiv.net");
    cookie.removeCookie("https://accounts.pixiv.net");
    cookie.removeCookie("https://accounts.google.com");
    cookie.removeCookie("https://api.weibo.com");
    cache.delete("pixivCookie");
    cache.delete("pixiv:uid");
    cache.delete("csrfToken"); // 与登录设备有关
    cache.delete("headers");
}

export function removeCacheList(listName: string) {
    let list = getFromCache(listName);
    list.forEach((item: any) => cache.delete(`collect${item}`));
    if (listName !== "blockAuthorList") cache.delete(listName);
}

export function removeLikeDataCache() {
    // 删除 likeNovels 与 watchedSeries
    removeCacheList("likeNovels");
    removeCacheList("watchedSeries");
}

export function removeSettingsCache() {
    // 删除 自动翻页的最大页码
    cache.delete("maxPagesKey");
    cache.delete("novelsMaxPages");
    cache.delete("seriesMaxPages");

    // 删除 屏蔽作者名单
    // removeCacheList("blockAuthorList")
    // 删除  屏蔽关键词
    // cache.delete("tagsBlockWords")
    // cache.delete("captionBlockWords")
}

// 获取 Csrf Token，以便进行收藏等请求
// 获取方法来自脚本 Pixiv Previewer
// https://github.com/Ocrosoft/PixivPreviewer
// https://greasyfork.org/zh-CN/scripts/30766-pixiv-previewer/code
export function getCsrfToken(): string | null {
    let csrfToken;
    let html = java.webView(null, "https://www.pixiv.net/", undefined);
    try {
        csrfToken = html?.match(/token\\":\\"([a-z0-9]{32})/)?.[1] || null;
    } catch (e) {
        csrfToken = null;
    }
    // java.log(csrfToken)
    cache.put("csrfToken", csrfToken); // 与登录设备有关
    return csrfToken;
}

export function getCookie(): string | null {
    let pixivCookie = String(java.getCookie("https://www.pixiv.net/", null));
    if (pixivCookie.includes("first_visit_datetime")) {
        // java.log(pixivCookie)
        cache.put("pixivCookie", pixivCookie, 60 * 60);
        return pixivCookie;
    } else {
        cache.delete("pixivCookie");
        sleepToast("未登录账号(pixivCookie)");
        return null;
    }
}

export function getNovel() {
    let novel = source.getLoginInfoMap();
    if (!novel) novel = getFromCache("novel") as Record<string, any>;
    return novel;
}

export function getPostBody(
    url: string,
    body: any,
    headers: Record<string, string> = getFromCache("headers") || {},
): { error: boolean; [key: string]: any } {
    if (isJsonString(body)) {
        headers["content-type"] = "application/json; charset=utf-8";
    } else if (typeof body === "string") {
        headers["content-type"] =
            "application/x-www-form-urlencoded; charset=utf-8";
    }
    try {
        java.log(`getPostBody(${url}, ${body}, ${JSON.stringify(headers)})`);
        return JSON.parse(java.post(url, body, headers).body());
    } catch (e) {
        // sleepToast(JSON.stringify(headers))
        if (String(e).includes("400")) sleepToast(`⚠️ 缺少 headers ${JSON.stringify(headers)}`, 1);
        else if (String(e).includes("403"))
            sleepToast(`⚠️ 缺少 cookie 或 cookie 过期`, 1);
        else if (String(e).includes("404")) sleepToast(`⚠️ 404 | headers: ${JSON.stringify(headers)}`, 1);
        else if (String(e).includes("422")) sleepToast(`⚠️ 请求信息有误`, 1);
        else sleepToast(`⚠️ 错误：${e}`, 1)
        return { error: true };
    }
}

export function novelBookmarkAdd(restrict = 0) {
    const novel = getNovel();
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/add",
        JSON.stringify({
            novel_id: novel.id,
            restrict: restrict,
            comment: "",
            tags: [],
        }),
    );
    if (resp.error === true)
        sleepToast(`❤️ 收藏小说\n\n⚠️ 收藏【${novel.title}】失败`);
    else if (resp.body === null)
        sleepToast(`❤️ 收藏小说\n\n✅ 已经收藏【${novel.title}】了`);
    else {
        cache.put(`collect${novel.id}`, resp.body);
        sleepToast(`❤️ 收藏小说\n\n✅ 已收藏【${novel.title}】`);

        let likeNovels = getFromCache("likeNovels");
        likeNovels.push(Number(novel.id));
        putInCache("likeNovels", likeNovels);

        let novelObj = getAjaxJson(urlNovelDetailed(novel.id));
        novelObj.body.isBookmark = true;
        putInCache(urlNovelDetailed(novel.id), novelObj, cacheSaveSeconds);
    }
}

export function getNovelBookmarkId(novelId: string | number): string | number {
    let bookmarkId = getFromCache(`collect${novelId}`);
    if (bookmarkId === null) {
        bookmarkId = getAjaxJson(urlNovelBookmarkData(novelId), true).body
            .bookmarkData.id;
    }
    return bookmarkId;
}

export function novelBookmarkDelete() {
    const novel = getNovel();
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/delete",
        `del=1&book_id=${getNovelBookmarkId(novel.id)}`,
    );
    if (resp.error === true)
        sleepToast(`❤️ 收藏小说\n\n⚠️ 取消收藏【${novel.title}】失败`);
    else {
        cache.delete(`collect${novel.id}`);
        sleepToast(`❤️ 收藏小说\n\n✅ 已取消收藏【${novel.title}】`);

        let likeNovels = getFromCache("likeNovels");
        likeNovels = likeNovels.filter(
            (item: any) => item !== Number(novel.id),
        );
        putInCache("likeNovels", likeNovels);

        let novelObj = getAjaxJson(urlNovelDetailed(novel.id));
        novelObj.body.isBookmark = false;
        putInCache(urlNovelDetailed(novel.id), novelObj, cacheSaveSeconds);
    }
}

export function novelsBookmarkDelete(novelIds: (string | number)[]) {
    let bookmarkIds: (string | number)[] = [];
    novelIds.forEach(novelId => {
        bookmarkIds.push(getNovelBookmarkId(novelId));
    });
    let resp = getPostBody(
        "https://www.pixiv.net/ajax/novels/bookmarks/remove",
        JSON.stringify({ bookmarkIds: bookmarkIds }),
    );
    if (resp.error === true)
        sleepToast("❤️ 收藏小说\n\n⚠️ 全部取消收藏失败", 1);
    else {
        sleepToast("✅ 已取消收藏");
        novelIds.forEach(novelId => {
            cache.delete(`collect${novelId}`);
        });

        let likeNovels = getFromCache("likeNovels");
        likeNovels = likeNovels.filter(
            (item: any) => !novelIds.includes(Number(item)),
        );
        putInCache("likeNovels", likeNovels);

        novelIds.forEach(novelId => {
            let novelObj = getAjaxJson(urlNovelDetailed(novelId));
            novelObj.body.isBookmark = false;
            putInCache(urlNovelDetailed(novelId), novelObj, cacheSaveSeconds);
        });
    }
}

export function novelsBookmarkAdd() {
    const novel = getNovel();
    if (!novel.seriesId) {
        sleepToast(
            `❤️ 收藏系列\n\n⚠️ 【${novel.title}】非系列小说，现已收藏本篇小说`,
        );
        return novelBookmarkAdd(0);
    } else {
        sleepToast(
            `❤️ 收藏系列\n\n🔄 正在收藏系列【${novel.seriesTitle}】，请稍后……`,
            2,
        );
    }

    let novelIds: (string | number)[] = getFromCache(
        `novelIds${novel.seriesId}`,
    );
    let likeNovels = getFromCache("likeNovels");
    novelIds.forEach(novelId => {
        if (!likeNovels.includes(Number(novelId))) {
            sleep(0.5 * 1000 * Math.random());
            let resp = getPostBody(
                "https://www.pixiv.net/ajax/novels/bookmarks/add",
                JSON.stringify({
                    novel_id: novelId,
                    restrict: 0,
                    comment: "",
                    tags: [],
                }),
            );

            if (resp.error === true)
                sleepToast(`❤️ 收藏系列\n\n⚠️ 收藏【${novelId}】失败`);
            else if (resp.body === null) {
            } else {
                cache.put(`collect${novelId}`, resp.body);
                likeNovels.push(Number(novelId));

                let novelObj = getAjaxJson(urlNovelDetailed(novelId));
                novelObj.body.isBookmark = true;
                putInCache(
                    urlNovelDetailed(novelId),
                    novelObj,
                    cacheSaveSeconds,
                );
            }
        }
    });
    putInCache("likeNovels", likeNovels);
    sleepToast(`❤️ 收藏系列\n\n✅ 已经收藏【${novel.seriesTitle}】全部章节`);
}

export function novelBookmarkFactory(code: number) {
    const novel = getNovel();
    let collectId = getFromCache(`collect${novel.id}`);
    if (collectId >= 1) code = 0;

    if (code === 0) novelBookmarkDelete();
    else if (code === 1) novelBookmarkAdd(0);
    else if (code === 2) novelBookmarkAdd(1);
}

export function novelMarker(page = 1) {
    const novel = getNovel();
    let lastMarker = getFromCache(`marker${novel.id}`);
    if (lastMarker === true) page = 0;

    let resp = getPostBody(
        "https://www.pixiv.net/novel/rpc_marker.php",
        `mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`,
    );
    java.log(
        `mode=save&i_id=${novel.id}&u_id=${getFromCache("pixiv:uid")}&page=${page}`,
    );
    if (resp.error === true) sleepToast("🏷️ 添加书签\n\n⚠️ 操作失败", 1);
    else if (lastMarker === true) {
        cache.put(`marker${novel.id}`, false);
        sleepToast(`🏷️ 添加书签\n\n✅ 已删除书签`);
    } else {
        cache.put(`marker${novel.id}`, true);
        sleepToast(`🏷️ 添加书签\n\n✅ 已加入书签`);
    }
}

export function seriesWatch() {
    const novel = getNovel();
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/watch`,
        "{}",
    );
    if (resp.error === true)
        sleepToast(`📃 追更系列\n\n⚠️ 追更【${novel.seriesTitle}】失败`, 1);
    else {
        cache.put(`watch${novel.seriesId}`, true);
        sleepToast(`📃 追更系列\n\n✅ 已追更【${novel.seriesTitle}】`);

        let watchedSeries = getFromCache("watchedSeries");
        watchedSeries.push(Number(novel.seriesId));
        putInCache("watchedSeries", watchedSeries);

        let novelObj = getAjaxJson(urlSeriesDetailed(novel.seriesId));
        novelObj.body.isWatched = true;
        putInCache(
            urlSeriesDetailed(novel.seriesId),
            novelObj,
            cacheSaveSeconds,
        );
    }
}

export function seriesUnWatch() {
    const novel = getNovel();
    let resp = getPostBody(
        `https://www.pixiv.net/ajax/novel/series/${novel.seriesId}/unwatch`,
        "{}",
    );
    if (resp.error === true)
        sleepToast(`📃 追更系列\n\n⚠️ 取消追更【${novel.seriesTitle}】失败`, 1);
    else {
        cache.delete(`watch${novel.seriesId}`);
        sleepToast(`📃 追更系列\n\n✅ 已取消追更【${novel.seriesTitle}】`);

        let watchedSeries = getFromCache("watchedSeries");
        watchedSeries = watchedSeries.filter(
            (item: any) => item !== Number(novel.seriesId),
        );
        putInCache("watchedSeries", watchedSeries);

        let novelObj = getAjaxJson(urlSeriesDetailed(novel.seriesId));
        novelObj.body.isWatched = false;
        putInCache(
            urlSeriesDetailed(novel.seriesId),
            novelObj,
            cacheSaveSeconds,
        );
    }
}

export function seriesWatchFactory(code = 1) {
    const novel = getNovel();
    if (!novel.seriesId) {
        return sleepToast(
            `📃 追更系列\n\n⚠️ 【${novel.title}】非系列小说，无法加入追更列表`,
        );
    }

    let lastStatus = getFromCache(`watch${novel.seriesId}`);
    if (lastStatus === true) code = 0;
    if (code === 0) seriesUnWatch();
    else if (code === 1) seriesWatch();
}

export function userFollow(restrict = 0) {
    const novel = getNovel();
    let resp = getPostBody(
        "https://www.pixiv.net/bookmark_add.php",
        `mode=add&type=user&user_id=${novel.userId}&tag=""&restrict=${restrict}&format=json`,
    );
    if (resp.error === true)
        sleepToast(`⭐️ 关注作者\n\n⚠️ 关注【${novel.userName}】失败`, 1);
    else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已关注【${novel.userName}】`);
        cache.put(`follow${novel.userId}`, true);
    }
}

export function userUnFollow() {
    const novel = getNovel();
    let resp = getPostBody(
        "https://www.pixiv.net/rpc_group_setting.php",
        `mode=del&type=bookuser&id=${novel.userId}`,
    );
    if (resp.error === true)
        sleepToast(`⭐️ 关注作者\n\n⚠️ 取消关注【${novel.userName}】失败`, 1);
    else {
        sleepToast(`⭐️ 关注作者\n\n✅ 已取消关注【${novel.userName}】`);
        cache.delete(`follow${novel.userId}`);
    }
}

export function userFollowFactory(code = 1) {
    const novel = getNovel();
    const lastStatus = getFromCache(`follow${novel.userId}`);
    if (lastStatus === true) code = 0;

    if (code === 0) userUnFollow();
    else if (code === 1) userFollow();
}

export function userBlackList() {
    let action = "block"; // 拉黑作者，非屏蔽作者作品
    const novel = getNovel();
    let lastStatus = getFromCache(`block${novel.userId}`);
    if (lastStatus === true) action = "unblock";

    let resp = getPostBody(
        `https://www.pixiv.net/ajax/block/save`,
        JSON.stringify({ user_id: novel.userId, action: action }),
    );
    // java.log(JSON.stringify({"user_id": novel.userId, "action": action}))
    if (resp.error === true) sleepToast("⚠️ 操作失败", 1);
    else if (lastStatus === true) {
        cache.put(`block${novel.userId}`, false);
        sleepToast(
            `✅ 已取消拉黑【${novel.userName}】\n\n已允许其点赞、评论、收藏、关注、私信等`,
        );
    } else {
        cache.put(`block${novel.userId}`, true);
        sleepToast(
            `✅ 已拉黑【${novel.userName}】(Pixiv)\n\n已禁止其点赞、评论、收藏、关注、私信等`,
        );
    }
}

export function userBlock() {
    let authors: number[]  = getFromCache("blockAuthorList")
    let authorsMap: Map<String, String> = getFromCacheMap("blockAuthorMap")
    if (!authorsMap || authorsMap.size === 0) {
        authorsMap = new Map()
        authors.forEach(author => {
            authorsMap.set(author, getAjaxJson(urlUserDetailed(author)).body.name)
        })
    }

    let novel = getNovel()
    if (authorsMap.has(String(novel.userId))) {
        authorsMap.delete(String(novel.userId))
        sleepToast(`🚫 屏蔽作者\n\n✅ 已取消屏蔽【${novel.userName}】\n现已恢复显示其小说`)
    } else if (!!novel.userId) {
        authorsMap.set(String(novel.userId), novel.userName)
        sleepToast(`🚫 屏蔽作者\n\n✅ 本地已屏蔽【${novel.userName}】\n今后不再显示其小说`)
    }

    authors = Array.from(authorsMap.keys())
    putInCache("blockAuthorList", authors)
    putInCacheMap("blockAuthorMap", authorsMap)
    // source.setVariable(authors.toString())
    // sleepToast(JSON.stringify(authors))
}

export function novelCommentAdd() {
    let resp;
    const novel = getNovel();
    let userId = getFromCache("pixiv:uid");
    let comment = String(result.get("发送评论")).trim();
    if (comment === "") {
        return sleepToast(
            `✅ 发送评论\n⚠️ 请输入需要发送的评论\n\n输入【评论内容；评论ID】可回复该条评论，如【非常喜欢；123456】\n\n📌 当前章节：${novel.title}\n\n如非当前章节，请刷新正文`,
        );
    }

    let matched = comment.match(RegExp(/(；|;\s*)\d{8,}/));
    if (matched) {
        let commentId = comment.match(new RegExp(/；(\d{8,})/))![1];
        comment = comment.replace(new RegExp(`(；|;\s*)${commentId}`), "");
        resp = getPostBody(
            "https://www.pixiv.net/novel/rpc/post_comment.php",
            `type=comment&novel_id=${novel.id}&author_user_id=${userId}&comment=${encodeURI(comment)}&parent_id=${commentId}`,
        );
    } else {
        resp = getPostBody(
            "https://www.pixiv.net/novel/rpc/post_comment.php",
            `type=comment&novel_id=${novel.id}&author_user_id=${userId}&comment=${encodeURI(comment)}`,
        );
    }

    if (resp.error === true) sleepToast("✅ 发送评论\n\n⚠️ 评论失败", 1);
    else
        sleepToast(
            `✅ 发送评论\n\n✅ 已在【${novel.title}】发布评论：\n${comment}`,
        );
}

export function getNovelCommentID(
    novelId: string | number,
    commentText: string,
): string[] {
    let list: any[] = [];
    const uid = String(getFromCache("pixiv:uid"));
    let resp = getAjaxJson(urlNovelComments(novelId, 0, 50), true);
    resp.body.comments.forEach((comment: any) => {
        if (comment.userId === uid && comment.comment === commentText)
            list.push(comment.id);

        if (comment.hasReplies === true) {
            let resp = getAjaxJson(urlNovelCommentsReply(comment.id, 1), true);
            resp.body.comments.forEach((comment: any) => {
                if (comment.userId === uid && comment.comment === commentText)
                    list.push(comment.id);
            });
        }
    });
    // java.log(JSON.stringify(list))
    return list;
}

export function novelCommentDelete() {
    let commentIDs = [];
    const novel = getNovel();
    let comment = String(result.get("发送评论")).trim();
    if (comment === "") {
        return sleepToast(
            `🗑 删除评论\n⚠️ 请输入需要删除的【评论ID】\n或输入需要删除的【评论内容】\n\n📌 当前章节：${novel.title}\n\n如非当前章节，请刷新正文`,
        );
    }

    let matched = comment.match(RegExp(/\d{8,}/));
    if (matched) {
        commentIDs = [matched[0]];
    } else {
        commentIDs = getNovelCommentID(novel.id, comment);
        java.log(JSON.stringify(commentIDs));
        if (commentIDs.length === 0) {
            return sleepToast(
                `🗑 删除评论\n\n⚠️ 未能找到这条评论\n请检查是否有错别字或标点符号是否一致`,
            );
        }
    }

    commentIDs.forEach(commentID => {
        let resp = getPostBody(
            "https://www.pixiv.net/novel/rpc_delete_comment.php",
            `i_id=${novel.id}&del_id=${commentID}`,
        );
        // java.log(JSON.stringify(resp))
        if (resp.error === true)
            sleepToast("🗑 删除评论\n\n⚠️ 评论删除失败", 1);
        else
            sleepToast(
                `🗑 删除评论\n\n✅ 已在【${novel.title}】删除评论：\n${comment}`,
            );
    });
}

const wordsType = {
    caption: "📃 简介屏蔽列表",
    tags: "#️ 标签屏蔽列表",
};

type WordsTypeKey = keyof typeof wordsType;

export function blockWordShow() {
    const keys = Object.keys(wordsType) as WordsTypeKey[];
    let key = getFromCache("wordsType") as WordsTypeKey;
    if (!key) key = keys[0];
    if (key === keys[0]) key = keys[1];
    else if (key === keys[1]) key = keys[0];
    putInCache("wordsType", key);

    let words = getFromCache(`${key}BlockWords`);
    if (words === undefined) words = [];
    sleepToast(`👀 查看屏蔽\n${wordsType[key]}\n\n${words.join("\n")}`, 5);
}

export function blockWordAdd() {
    let method = getFromCache("wordsType") as WordsTypeKey;
    let blockWords = getFromCache(`${method}BlockWords`);
    if (blockWords === null) blockWords = [];

    let word = String(result.get("输入内容")).trim();
    if (word === "") {
        sleepToast(`🚫 添加屏蔽\n${wordsType[method]}\n\n⚠️ 输入内容不能为空`);
    } else if (blockWords.includes(word)) {
        sleepToast(
            `🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 【${word}】已经加入屏蔽列表了`,
        );
    } else {
        blockWords.push(word);
        putInCache(`${method}BlockWords`, blockWords);
        sleepToast(
            `🚫 添加屏蔽\n${wordsType[method]}\n\n✅ 已将【${word}】加入屏蔽列表中`,
        );
    }
}

export function blockWordDelete() {
    let method = getFromCache("wordsType") as WordsTypeKey;
    let blockWords = getFromCache(`${method}BlockWords`);
    if (blockWords === null) blockWords = [];

    let word = String(result.get("输入内容")).trim();
    if (word === "") {
        sleepToast(`⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 输入内容不能为空`);
    } else if (!blockWords.includes(word)) {
        sleepToast(
            `⭕️ 删除屏蔽\n${wordsType[method]}\n\n⚠️ 【${word}】不在屏蔽列表\n请检查是否有错别字或标点符号是否一致`,
        );
    } else {
        blockWords = blockWords.filter((item: any) => item !== word);
        putInCache(`${method}BlockWords`, blockWords);
        sleepToast(
            `⭕️ 删除屏蔽\n${wordsType[method]}\n\n✅ 已删除屏蔽词【${word}】`,
        );
    }
}

export function likeTagsShow() {
    let likeTags = getFromCache(`likeTags`);
    if (likeTags === null) likeTags = [];
    sleepToast(`👀 查看标签\n📌 喜欢标签\n\n${likeTags.join("、")}`, 5);
}

export function likeTagsAdd() {
    let likeTags = getFromCache(`likeTags`);
    if (likeTags === null) likeTags = [];

    let word = String(result.get("输入内容")).trim();
    if (word === "") {
        sleepToast(
            `📌 添加标签\n📌 喜欢标签\n\n⚠️ 输入内容不能为空\n请直接输入标签内容`,
        );
    } else if (word.startsWith("@") || word.startsWith("＠")) {
        sleepToast(
            `📌 添加标签\n📌 喜欢标签\n\n⚠️ 仅支持添加【标签】\n不支持添加 @作者名称`,
        );
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        sleepToast(
            `📌 添加标签\n📌 喜欢标签\n\n⚠️ 仅支持添加【标签】\n不支持添加 #标签名称`,
        );
    } else if (likeTags.includes(word)) {
        sleepToast(
            `📌 添加标签\n📌 喜欢标签\n\n✅ 【${word}】已经加入喜欢标签了\n请于发现页刷新后查看`,
        );
    } else {
        likeTags.push(word);
        putInCache(`likeTags`, likeTags);
        sleepToast(
            `📌 添加标签\n📌 喜欢标签\n\n✅ 已将【${word}】加入喜欢标签了\n请于发现页刷新后查看`,
        );
    }
}

export function likeTagsDelete() {
    let likeTags = getFromCache(`likeTags`);
    if (likeTags === null) likeTags = [];

    let word = String(result.get("输入内容")).trim();
    if (word === "") {
        sleepToast(`🗑 删除标签\n\n⚠️ 输入内容不能为空`);
    } else if (!likeTags.includes(word)) {
        sleepToast(
            `🗑 删除标签\n\n⚠️ 【${word}】不在喜欢标签\n请检查是否有错别字`,
        );
    } else {
        likeTags = likeTags.filter((item: any) => item !== word);
        putInCache(`likeTags`, likeTags);
        sleepToast(`🗑 删除标签\n\n✅ 已删除该标签【${word}】`);
    }
}

export function likeAuthorsShow() {
    const likeAuthors = getLikeAuthorsMap();
    let text = "";
    likeAuthors.forEach((userName, userId) => {
        text += `@${userName} ${userId}\n`;
    });
    sleepToast(`👀 查看收藏\n❤️ 他人收藏\n\n${text.trim()}`, 5);
}

export function likeAuthorsAdd() {
    const likeAuthors = getLikeAuthorsMap();

    let word = String(result.get("输入内容")).trim();
    if (word.startsWith("@") || word.startsWith("＠")) {
        return sleepToast(
            `❤️ 添加收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID】关注\n不支持添加 @作者名称`,
        );
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        return sleepToast(
            `❤️ 添加收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID】关注\n不支持添加 #标签名称`,
        );
    }

    if (word === "") {
        // 无输入内容，添加当前小说的作者
        let novel = getNovel();
        likeAuthors.set(novel.userId, novel.userName);
        word = `@${novel.userName} ${novel.userId}`;
        sleepToast(
            `❤️ 添加收藏\n❤️ 他人收藏\n\n✅ 已将【${word}】加入收藏列表了，请于发现页刷新后查看\n\n⚠️ 输入【用户ID】可关注其他用户的收藏\n默认关注当前作者(用户)`,
            2,
        );
    } else {
        // 显式转换为数字并校验是否为正整数
        const userId = Number(word);
        if (Number.isInteger(userId) && userId > 0) {
            // 输入纯数字，添加对应ID的作者
            let user = getAjaxJson(urlUserDetailed(userId)).body;
            likeAuthors.set(user.userId, user.name);
            word = `@${user.name} ${user.userId}`;
            sleepToast(
                `❤️ 添加收藏\n❤️ 他人收藏\n\n✅ 已将【${word}】加入收藏列表了，请于发现页刷新后查看`,
            );
        } else {
            sleepToast(
                `❤️ 添加收藏\n❤️ 他人收藏\n\n⚠️ 输入【用户ID】可关注其他用户的收藏`,
                2,
            );
        }
    }
    saveLikeAuthorsMap(likeAuthors);
}

export function likeAuthorsDelete() {
    const likeAuthors = getLikeAuthorsMap();

    let word = String(result.get("输入内容")).trim();
    if (word.startsWith("@") || word.startsWith("＠")) {
        return sleepToast(
            `🖤 取消收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID】取关\n不支持输入 @作者名称`,
        );
    } else if (word.startsWith("#") || word.startsWith("＃")) {
        return sleepToast(
            `🖤 取消收藏\n❤️ 他人收藏\n\n⚠️ 仅支持通过【作者ID】取关\n不支持输入 #标签名称`,
        );
    }

    if (word === "") {
        let novel = getNovel();
        likeAuthors.delete(novel.userId);
        word = `@${novel.userName} ${novel.userId}`;
        sleepToast(
            `🖤 取消收藏\n❤️ 他人收藏\n\n✅ 已取关【${word}】\n\n输入【用户ID】可取关其他用户\n默认取关当前作者(用户)`,
        );
    } else {
        // 显式转换为数字并校验是否为正整数
        const userId = Number(word);

        if (
            Number.isInteger(userId) &&
            userId > 0 &&
            likeAuthors.has(userId.toString())
        ) {
            // 输入纯数字且存在于收藏中
            let user = getAjaxJson(urlUserDetailed(userId)).body;
            likeAuthors.delete(userId.toString());
            word = `@${user.name} ${user.userId}`;
            sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n✅ 已取关【${word}】`);
        } else {
            // 检查是否输入的是作者名称
            let foundUserId: string | null = null;
            likeAuthors.forEach((userName, userId) => {
                if (userName === word) {
                    foundUserId = userId;
                }
            });

            if (foundUserId) {
                let user = getAjaxJson(urlUserDetailed(foundUserId)).body;
                likeAuthors.delete(foundUserId);
                word = `@${user.name} ${user.userId}`;
                sleepToast(`🖤 取消收藏\n❤️ 他人收藏\n\n✅ 已取关【${word}】`);
            } else {
                sleepToast(
                    `🖤 取消收藏\n❤️ 他人收藏\n\n⚠️ 未找到匹配的用户ID或作者名称`,
                );
            }
        }
    }
    saveLikeAuthorsMap(likeAuthors);
}

export function startBrowser(url: string, title: string) {
    let msg = "",
        headers = `{"headers": {"User-Agent":"${getWebViewUA()}"}}`;
    if (url.includes("https://www.pixiv.net")) {
        if (url.includes("settings")) msg += "⚙️ 账号设置";
        else msg += "⤴️ 分享小说";
        msg += "\n\n即将打开 Pixiv\n请确认已开启代理/梯子/VPN等";
    } else if (url.includes("https://github.com")) {
        if (url.includes("issues")) msg += "🐞 反馈问题";
        else if (url.includes("doc")) msg += "🔰 使用指南";
        else msg += "⭐️ 收藏项目";
        msg += "\n\n即将打开 Github\n请确认已开启代理/梯子/VPN等";
    }
    sleepToast(msg, 0.01);
    java.startBrowser(`${url}, ${headers}`, title);
}

export function shareFactory(type: string) {
    const novel = getNovel();
    if (novel === undefined || novel === null)
        return sleepToast("⚠️ 请在小说阅读页面，使用本功能");
    if (type.includes("author")) {
        startBrowser(urlUserUrl(novel.userId), novel.userName);
    } else if (type.includes("novel") || !novel.seriesId) {
        startBrowser(urlNovelUrl(novel.id), novel.title);
    } else if (type.includes("series") && novel.seriesId) {
        startBrowser(urlSeriesUrl(novel.seriesId), novel.seriesTitle);
    }
}

export function startPixivSettings() {
    startBrowser("https://www.pixiv.net/settings/viewing", "账号设置");
}
export function startGithubIssue() {
    startBrowser(
        "https://github.com/windyhusky/PixivSource/issues",
        "反馈问题",
    );
}
export function startGithubReadme() {
    startBrowser(
        "https://github.com/windyhusky/PixivSource/blob/main/doc/Pixiv.md",
        "使用指南",
    );
}
export function checkStatus(status: any) {
    if (eval(String(status)) === true) return "❤️";
    else return "🖤";
}

export function charpterReading() {
    const novel = getNovel();
    // let novel = source.getLoginInfoMap()
    let msg = `📌 当前章节\n\n${checkStatus(novel.isWatched)} 系列：${novel.seriesTitle}\n${checkStatus(novel.isBookmark)} 章节：${novel.title}\n👤 作者：${novel.userName}\n\n如非当前章节，请刷新正文`;
    msg = msg.replace("🖤 系列：\n", "");
    sleepToast(msg, 2);
}

export function readMeLogin() {
    return sleepToast(
        `🅿️ 登录界面功能\n
    使用收藏、追更、关注作者、评论等功能时，需要登录
    使用前请先刷新正文，获取当前章节信息\n
    点击【📌 当前章节】查看书源内部章节信息`.replace("    ", ""),
        5,
    );
}

export function readMeSearch() {
    return sleepToast(
        `🔍 搜索说明\n
    标签之间需要以【空格】间隔
    ➖ 排除标签：#标签1 -标签2
    👤 作者专搜：@搜索作者名称
    #️ 标签专搜：#标签1 标签2 
    ⏬ 字数筛选1：#标签1 标签2 字数3k5
    ⏬ 字数筛选2：@作者的名称 字数3w5`.replace("    ", ""),
        5,
    );
}

// TODO
// export function getPixivSettings() {
//   const settings: PixivSettings = getFromCache("pixivSettings");
//   const resp = getAjaxJson("https://www.pixiv.net/ajax/settings/self");
//   if (resp.error !== true) {
//     let siteSettings = resp.body.user_status;
//     settings.HIDE_AI_WORKS = siteSettings.hide_ai_works;
//     settings.SENSITIVE_VIEW = siteSettings.sensitive_view_setting;
//     settings.USER_X_RESTRICT = siteSettings.user_x_restrict;
//     settings.READING_STATUS = siteSettings.reading_status_enabled;
//   } else {
//     settings.HIDE_AI_WORKS = false;
//     settings.SENSITIVE_VIEW = 0;
//     settings.USER_X_RESTRICT = 0;
//     settings.READING_STATUS = false;
//   }
//   putInCache("pixivSettings", settings);
//   return settings;
// }

// export function editPixivSettingsHideAI() {
//   let settings = getPixivSettings();
//   // let settings = getFromCache("pixivSettings")
//   let hideAiWorks = Number(!settings.HIDE_AI_WORKS);
//   let resp = getPostBody("https://www.pixiv.net/ajax/settings/self?lang=zh", {
//     hideAiWorks: hideAiWorks,
//   });

//   if (resp.error === true) sleepToast(`⚠️ 隐藏AI作品 失败`, 1);
//   else if (hideAiWorks === 1) sleepToast(`⚠️ 隐藏AI作品\n\n✅ 已 隐藏AI作品`);
//   else sleepToast(`⚠️ 隐藏AI作品\n\n✅ 已取消 隐藏AI作品`);
//   settings.HIDE_AI_WORKS = Boolean(hideAiWorks);
//   putInCache("pixivSettings", settings);
// }

// export function editPixivSettingsXRestrict() {
//   let settings = getPixivSettings();
//   // let settings = getFromCache("pixivSettings")
//   let userXRestrict = settings.USER_X_RESTRICT + 1;
//   if (userXRestrict === 3) userXRestrict = 0;
//   let resp = getPostBody("https://www.pixiv.net/ajax/settings/user_x_restrict", {
//     userXRestrict: userXRestrict,
//   });

//   if (resp.error === true) sleepToast(`⚠️ 成人作品 失败`, 1);
//   else if (userXRestrict === 0) sleepToast(`⚠️ 成人作品\n\n✅ 已关闭 成人作品`);
//   else if (userXRestrict === 1) sleepToast(`⚠️ 成人作品\n\n✅ 已开启 R-18作品`);
//   else sleepToast(`⚠️ 成人作品\n\n✅ 已开启 R-18G作品`);
//   settings.USER_X_RESTRICT = userXRestrict;
//   putInCache("pixivSettings", settings);
// }

// export function editPixivSettingsSensitiveView() {
//   let settings = getPixivSettings();
//   // let settings = getFromCache("pixivSettings")
//   let sensitiveView = Number(!settings.SENSITIVE_VIEW);
//   let resp = getPostBody("https://www.pixiv.net/ajax/settings/sensitive_view_setting", {
//     sensitiveViewSetting: sensitiveView,
//   });

//   if (resp.error === true) sleepToast(`⚠️ 敏感作品 失败`, 1);
//   else if (sensitiveView === 0) {
//     sleepToast(`⚠️ 敏感作品\n\n✅ 已隐藏 敏感作品`);
//   } else sleepToast(`⚠️ 敏感作品\n\n✅ 已显示 敏感作品`);
//   settings.SENSITIVE_VIEW = sensitiveView;
//   putInCache("pixivSettings", settings);
// }

export function statusMsg(status?: boolean): string {
    if (status === true) return "✅ 已开启";
    else if (status === false) return "🚫 已关闭";
    else return "🈚️ 未设置";
}

// 检测快速模式修改的4个设置
export function getSettingStatus(mode = ""): string {
    let keys = [];
    const msgList = [];
    let settings = getFromCache("pixivSettings");
    if (mode !== "FAST") keys = Object.keys(SETTINGS_NAME);
    else keys = Object.keys(SETTINGS_NAME).slice(0, 5);
    for (let i in keys) {
        msgList.push(
            `${statusMsg(settings[keys[i]])}　${SETTINGS_NAME[keys[i]]}`,
        );
    }
    return msgList.join("\n").trim();
}

export function showSettings() {
    sleepToast(`⚙️ 当前设置\n\n${getSettingStatus()}`);
}

// TODO
export function editSettings<K extends keyof Settings>(settingsKey: K) {
    let msg = "";
    let settings = getFromCache("pixivSettings") as Settings;
    let status: boolean;
    try {
        status = !settings[settingsKey];
        settings[settingsKey] = status;
    } catch (e) {
        status = true;
        settings[settingsKey] = status;
    }

    if (settingsKey !== "FAST") {
        msg = `${statusMsg(status)}　${SETTINGS_NAME[settingsKey]}`;
    } else {
        if (settings[settingsKey] === true) {
            cache.put("pixivLastSettings", JSON.stringify(settings));
            settings.CONVERT_CHINESE = false; // 搜索：繁简通搜
            settings.SEARCH_AUTHOR = false; // 搜索：默认搜索作者
            settings.SHOW_UPDATE_TIME = false; // 目录：显示章节更新时间
            settings.SHOW_ORIGINAL_LINK = false; // 目录：显示章节源链接
            settings.SHOW_COMMENTS = false; // 正文：显示评论
            cache.put("pixivSettings", JSON.stringify(settings));
            let message = getSettingStatus("FAST");
            msg = `\n${statusMsg(status)}　${SETTINGS_NAME[settingsKey]}\n\n${message}`;
        } else {
            settings = getFromCache("pixivLastSettings") as Settings;
            settings.SEARCH_AUTHOR = true;
            settings.FAST = false;
            cache.put("pixivSettings", JSON.stringify(settings));
            let message = getSettingStatus("FAST");
            msg = `已恢复原有设置\n\n${statusMsg(status)}　${SETTINGS_NAME[settingsKey]}\n${message}`;
        }
    }
    sleepToast(msg);
    cache.put("pixivSettings", JSON.stringify(settings));
}

export function cleanCache() {
    const novel = getNovel();
    if (!novel) {
        return sleepToast("⚠️ 无法获取小说信息");
    }

    cache.delete(`${urlNovelUrl(novel["id"]!)}`);
    cache.delete(`${urlNovelDetailed(novel["id"]!)}`);
    cache.delete(`${urlSearchNovel(novel["title"]!, 1)}`);
    sleepToast(`🧹 清除缓存\n\n已清除本章正文缓存，刷新正文以更新`, 5);
}

export function showMaxPages() {
    let key: MaxPageConfigKey | null = getFromCache("maxPagesKey");
    // 交换key
    switch (key) {
        case MaxPageConfigKey.SERIES_MAX_PAGES:
            key = MaxPageConfigKey.NOVELS_MAX_PAGES;
            break;
        case MaxPageConfigKey.NOVELS_MAX_PAGES:
            key = MaxPageConfigKey.SERIES_MAX_PAGES;
            break;
        default:
            key = MaxPageConfigKey.SERIES_MAX_PAGES;
            break;
    }
    putInCache("maxPagesKey", key);
    return sleepToast(
        `📄 搜索页码\n设置 #️⃣ 搜索标签的最大页码数\n
    当前系列最大页码：${getFromCache(MaxPageConfigKey.SERIES_MAX_PAGES)}\n当前单篇最大页码：${getFromCache(MaxPageConfigKey.NOVELS_MAX_PAGES)}\n
    点击 ⏫ 增加页码/ ⏬ 减少页码\n调整【${MAX_PAGE_CONFIG_NAME[key]}】\n
    📌 页码越多，小说越多，速度越慢`.replace("    ", ""),
    );
}

export function editMaxPages(method: string) {
    let msg = "";
    let key: MaxPageConfigKey = getFromCache("maxPagesKey");
    if (!key) {
        key = MaxPageConfigKey.SERIES_MAX_PAGES;
    }
    let maxPages = getFromCache(key);
    if (!maxPages) maxPages = 1;
    if (method.includes("add")) maxPages += 1;
    if (method.includes("min")) maxPages -= 1;

    if (maxPages <= 1) {
        maxPages = 1;
        msg += "⚠️ 搜索页码不能再减小了\n";
    }
    if (maxPages >= 3) {
        msg += "⚠️ 搜索页码越多，搜索速度越慢\n";
    }
    if (maxPages >= 10) {
        maxPages = 10;
        msg += "⚠️ 搜索页码不能再增大了\n";
    }
    putInCache(`${key}`, maxPages);
    sleepToast(
        `📄 搜索页码\n\n当前搜索【${MAX_PAGE_CONFIG_NAME[key]}】：${maxPages}\n\n${msg}`.trim(),
    );
    return maxPages;
}
