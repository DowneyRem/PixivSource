@js:
li = [
    {
        "title": "推荐作者",
        "url": "https://api.furrynovel.ink/fav/user/cache"
    },
    {
        "title": "最新小说",
        "url": "https://api.furrynovel.ink/pixiv/novels/recent/cache?page={{page}}"
    }
]

li.forEach(item => {
    item.style = {}
    item.style.layout_flexGrow = 1
    item.style.layout_flexBasisPercent = 0.15
})
JSON.stringify(li)