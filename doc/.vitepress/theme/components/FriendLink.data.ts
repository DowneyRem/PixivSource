// .vitepress/theme/FriendLink.data.ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('FriendLink.md', {
    transform(raw): any[] {
        // 这里的 raw 是获取到的页面对象，我们只需要提取 frontmatter 里的 friendGroups
        return raw[0]?.frontmatter?.friendGroups || []
    }
})