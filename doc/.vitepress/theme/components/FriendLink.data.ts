import { createContentLoader } from 'vitepress'

export default createContentLoader('FriendLink.md', {
    transform(raw) {
        // 1. 找到对应的 FriendLink 页面
        const friendPage = raw.find(p => p.url.includes('FriendLink'))
        const groups = friendPage?.frontmatter?.friendGroups || []

        // 2. 深度过滤数据
        // 我们需要遍历每一个 group，并过滤掉 group.items 中标记为 hide: true 的项
        return groups.map((group: any) => {
            return {
                ...group,
                // 只保留没有 hide 属性，或者 hide 不为 true 的友链
                items: (group.items || []).filter((item: any) => item.hide !== true)
            }
        }).filter((group: any) => group.items.length > 0) // 如果某个分组过滤后变空了，也可以选择把整个分组删掉
    }
})