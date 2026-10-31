## 添加网址 {#AddUrl}
> [!NOTE]
> **书架 - 菜单 - 添加网址 - 粘贴小说链接 - 添加小说到书架**


### 🔗 支持链接 {#SupportedLinks}
<div v-if="pagePath.includes('Pixiv')">

> [!TIP]
> **可以同时添加多个小说的链接，支持：**
> - ✅ **Pixiv 单篇小说链接**
>   - `https://www.pixiv.net/novel/show.php?id=26200191`
> - ✅ **Pixiv 系列小说链接**
>   - `https://www.pixiv.net/novel/series/8054073`
> - ✅ **Pixiv 作者链接（添加近期1本小说）** 
>   - `https://www.pixiv.net/users/16721009`
> - ☑️ **Pixiv App 小说分享链接（删掉#号即可正常添加）** 
>   - `测试页面 | 唐尼瑞姆 #pixiv https://www.pixiv.net/novel/show.php?id=26200191`
</div>


<div v-if="pagePath.includes('Linpx')">

> [!TIP]
> **可以同时添加多个小说的链接，支持：**
> - ✅ **Linpx 小说链接**
>   - `https://linpx.ink/pixiv/novel/26200191`
> - ✅ **Linpx 分享链接**
>   - `我正在看唐尼瑞姆创作的《测试页面》一起来看吧！https://linpx.ink/pn/26200191`
> - ✅ **Linpx 作者链接**
>   - `https://linpx.ink/pixiv/user/119908520`
</div>


<div v-if="pagePath.includes('FurryNovel')">

> [!TIP]
> **可以同时添加多个小说的链接，支持：**
> - ✅ **兽人控小说站 目录链接**
>   - `https://furrynovel.com/zh/novel/8312`
> - ✅ **兽人控小说站 章节链接**
>   - `https://furrynovel.com/zh/novel/8312/chapter/33116`
</div>


### ⏺️ 实际操作 {#Operation}
![img](./pic/AddBookViaUrl1.png)
![img](./pic/AddBookViaUrl2.png)
![img](./pic/AddBookViaUrl3.png)
