import { renderMarkdown } from './renderMarkdown'

const stripReleasePath = (path: string) => path
    .replace(/\/releases(?:\/.*)?$/, '')
    .replace(/\/$/, '')

const normalizeRepoWebUrl = (repoPath: string, platform: 'gitee' | 'github') => {
    const host = platform === 'gitee' ? 'gitee.com' : 'github.com'
    return `https://${host}/${repoPath}`
}

export const resolveRepoMeta = (urlField?: string | null) => {
    if (!urlField) return null

    const url = urlField.trim()

    if (url.includes('gitee.com/')) {
        const path = stripReleasePath(url.split('gitee.com/')[1])
        return {
            platform: 'gitee' as const,
            apiUrl: `https://gitee.com/api/v5/repos/${path}/releases`,
            webUrl: normalizeRepoWebUrl(path, 'gitee'),
        }
    }

    if (url.includes('github.com/')) {
        const path = stripReleasePath(url.split('github.com/')[1])
        return {
            platform: 'github' as const,
            apiUrl: `https://api.github.com/repos/${path}/releases`,
            webUrl: normalizeRepoWebUrl(path, 'github'),
        }
    }

    return null
}

const getGiteeReleaseUrl = (repoWebUrl: string | undefined, tagName: string, item: any) => {
    if (repoWebUrl && tagName) {
        return `${repoWebUrl}/releases/tag/${encodeURIComponent(tagName)}`
    }

    return item.html_url || item.url || ''
}

export const transformReleases = (rawData: any, platform: 'gitee' | 'github', repoWebUrl?: string) => {
    if (!Array.isArray(rawData)) return []

    const normalizedRawData = platform === 'gitee' ? [...rawData].reverse() : rawData

    return normalizedRawData.map(item => {
        const rawAssets = item.assets || []
        const filteredAssets = rawAssets.filter((asset: any) => {
            const assetName = (asset.name || '').toLowerCase()
            return !assetName.endsWith('.zip') && !assetName.endsWith('.tar.gz')
        })

        const isPrerelease = platform === 'gitee'
            ? (item.prerelease || ['beta', 'alpha', 'pre'].some(keyword => String(item.tag_name).toLowerCase().includes(keyword)))
            : item.prerelease

        const tagName = String(item.tag_name).toLowerCase() === 'beta' && item.name
            ? item.name.replace(/^legado_app_/, '')
            : item.tag_name

        return {
            tag_name: tagName,
            prerelease: isPrerelease,
            published_at: platform === 'gitee' ? item.created_at : item.published_at,
            body: renderMarkdown(item.body || ''),
            html_url: platform === 'gitee'
                ? getGiteeReleaseUrl(repoWebUrl, tagName, item)
                : item.html_url,
            assets: filteredAssets.map((asset: any) => ({
                id: platform === 'gitee' ? asset.browser_download_url : asset.id,
                name: asset.name,
                browser_download_url: asset.browser_download_url,
                size: platform === 'gitee' ? null : asset.size,
            })),
        }
    })
}
