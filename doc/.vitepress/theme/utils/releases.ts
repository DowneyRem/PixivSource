import { renderMarkdown } from './renderMarkdown'

// ── 类型定义 ──
type Platform = 'github' | 'gitee' | string;

interface PlatformConfig {
    apiBase: string;
    webBase: string;
    cacheTTL: number;

    // 仓库路径解析
    normalizeRepoPath: (url: string) => string | null;

    // 构建翻页 URL（可自定义）
    buildFetchUrl: (repoPath: string, page: number, perPage: number) => string;

    // 转换单个 release（各平台字段差异在这里处理）
    transformRelease: (item: any, repoWebUrl: string) => any;

    // 是否需要反转数组（gitee 历史数据是倒序）
    shouldReverse?: boolean;
}

// ── 平台配置表 ──
const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
    github: {
        apiBase: 'https://api.github.com/repos/',
        webBase: 'https://github.com/',
        cacheTTL: 60 * 60 * 1000,

        normalizeRepoPath: (url) => url.match(/github\.com\/([^/]+\/[^/]+)/)?.[1] || null,

        buildFetchUrl: (repoPath, page, perPage) =>
            `https://legado-repo.tnt-wwxs-tz.workers.dev?platform=github&repo=${encodeURIComponent(repoPath)}&per_page=${perPage}&page=${page}`,

        transformRelease: (item, repoWebUrl) => {
            const isPrerelease = isPrereleaseRelease(item);

            return {
                tag_name: item.tag_name,
                prerelease: isPrerelease,
                published_at: item.published_at,
                body: renderMarkdown(item.body || ''),
                html_url: item.html_url,
                assets: (item.assets || [])
                    .filter((a: any) => {
                        const name = (a.name || '').toLowerCase();
                        return !name.endsWith('.zip') && !name.endsWith('.tar.gz');
                    })
                    .map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        browser_download_url: a.browser_download_url,
                        size: a.size,
                    })),
            };
        },
    },

    gitee: {
        apiBase: 'https://gitee.com/api/v5/repos/',
        webBase: 'https://gitee.com/',
        cacheTTL: 30 * 60 * 1000,
        shouldReverse: true,

        normalizeRepoPath: (url) => url.match(/gitee\.com\/([^/]+\/[^/]+)/)?.[1] || null,

        buildFetchUrl: (repoPath, page, perPage) =>
            `https://legado-repo.tnt-wwxs-tz.workers.dev?platform=gitee&repo=${encodeURIComponent(repoPath)}&per_page=${perPage}&page=${page}`,

        transformRelease: (item, repoWebUrl) => {
            const rawAssets = item.assets || [];
            const filteredAssets = rawAssets.filter((asset: any) => {
                const name = (asset.name || '').toLowerCase();
                return !name.endsWith('.zip') && !name.endsWith('.tar.gz');
            });

            const isPrerelease = isPrereleaseRelease(item);

            const tagName = String(item.tag_name).toLowerCase() === 'beta' && item.name
                ? item.name.replace(/^legado_app_/, '')
                : item.tag_name;

            const latestAssetDate = rawAssets.length
                ? rawAssets.reduce((latest: string, a: any) => a.updated_at > latest ? a.updated_at : latest, rawAssets[0].updated_at)
                : null;

            return {
                tag_name: tagName,
                prerelease: isPrerelease,
                published_at: latestAssetDate || item.created_at,
                body: renderMarkdown(item.body || ''),
                html_url: `${repoWebUrl}/releases/tag/${encodeURIComponent(tagName)}`,
                assets: filteredAssets.map((asset: any) => ({
                    id: asset.browser_download_url,
                    name: asset.name,
                    browser_download_url: asset.browser_download_url,
                    size: null,
                })),
            };
        },
    },
};

const PRERELEASE_KEYWORDS = ['beta', 'alpha', 'pre', 'preview', 'rc', 'canary', 'nightly'];

const isPrereleaseRelease = (item: any) => {
    if (item?.prerelease) return true;

    const text = [item?.tag_name, item?.name]
        .filter(Boolean)
        .map(value => String(value).toLowerCase())
        .join(' ');

    return PRERELEASE_KEYWORDS.some(keyword => text.includes(keyword));
};

// ── 缓存工具 ──
const CACHE_PREFIX = 'release-cache:';

export const readCache = (key: string) => { /* ... 保持不变 */ };
export const readStaleCache = (key: string) => { /* ... 保持不变 */ };
export const writeCache = (key: string, data: any, ttl: number) => { /* ... 保持不变 */ };

// ── 翻页请求 ──
export const fetchAllReleases = async (
    platformOrUrl: Platform | string,
    repoPathInput?: string
): Promise<any[]> => {

    let platform: Platform = 'github';
    let repoPath = repoPathInput || '';

    if (typeof platformOrUrl === 'string') {
        if (platformOrUrl.includes('gitee')) platform = 'gitee';
        const match = platformOrUrl.match(/repos\/([^/]+\/[^/]+)/i);
        if (match) repoPath = match[1];
    } else {
        platform = platformOrUrl as Platform;
    }

    if (!repoPath) throw new Error('仓库路径解析失败');

    const config = PLATFORM_CONFIGS[platform];
    if (!config) throw new Error(`Unsupported platform`);

    let attempts: string[] = [];

    if (platform === 'gitee') {
        attempts = [`https://gitee.com/api/v5/repos/${repoPath}/releases?per_page=100`];
    } else {
        attempts = [
            `https://githubdl.furry.pub/https://api.github.com/repos/${repoPath}/releases?per_page=100`,

            `https://legado-repo.tnt-wwxs-tz.workers.dev/?platform=github&repo=${encodeURIComponent(repoPath)}&per_page=100`,

            `https://api.github.com/repos/${repoPath}/releases?per_page=100`
        ];
    }

    for (const url of attempts) {
        try {
            console.log(`[尝试 ${platform}] ${url.substring(0, 75)}...`);

            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Legado-Download-Page',
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(12000)
            });

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    console.log(`[成功 ${platform}] 使用: ${url.substring(0, 60)}...`);
                    return config.shouldReverse ? data.reverse() : data;
                }
            }
        } catch (e) {
            console.warn(`[失败 ${platform}]`, url.substring(0, 60), e?.message);
        }
    }

    throw new Error(`所有通道均失败: ${platform}/${repoPath}`);
};

// ── 带缓存的请求 ──
export const fetchReleasesWithCache = async (
    meta: { apiUrl: string; platform: Platform; webUrl: string },
    item: { prerelease?: boolean }
) => {
    const config = PLATFORM_CONFIGS[meta.platform];
    if (!config) throw new Error(`Unsupported platform: ${meta.platform}`);

    const cacheKey = meta.apiUrl;
    const cached = readCache(cacheKey);
    if (cached) return getTargetRelease(cached, item);

    // 提取 repoPath
    const repoPath = config.normalizeRepoPath(meta.apiUrl) || config.normalizeRepoPath(meta.webUrl);
    if (!repoPath) throw new Error('Cannot resolve repo path');

    const rawData = await fetchAllReleases(meta.platform, repoPath);
    const releases = rawData.map(r => config.transformRelease(r, meta.webUrl));

    writeCache(cacheKey, releases, config.cacheTTL);
    return getTargetRelease(releases, item);
};

// ── 其他函数保持不变 ──
export const getTargetRelease = (releases: any[], item: { prerelease?: boolean }) => {
    if (!releases?.length) return null;

    if (item.prerelease) return releases[0];

    return releases.find(r => !isPrereleaseRelease(r)) || null;
};

export const resolveRepoMeta = (urlField?: string | null) => {
    if (!urlField) return null;
    const url = urlField.trim().toLowerCase();

    for (const [plat, config] of Object.entries(PLATFORM_CONFIGS)) {
        const repoPath = config.normalizeRepoPath(url);
        if (repoPath) {
            return {
                platform: plat as Platform,
                apiUrl: `${config.apiBase}${repoPath}/releases`,
                webUrl: `${config.webBase}${repoPath}`,
            };
        }
    }
    return null;
};

// ==================== 兼容旧代码导出 ====================

// 保留 CACHE_TTL 导出，供 DownloadCard.vue 等旧代码使用
export const CACHE_TTL = {
    github: PLATFORM_CONFIGS.github.cacheTTL,
    gitee: PLATFORM_CONFIGS.gitee.cacheTTL,
} as const;

// 兼容 transformReleases（很多地方可能还在使用）
export const transformReleases = (rawData: any, platform: Platform, repoWebUrl?: string) => {
    const config = PLATFORM_CONFIGS[platform];
    if (!config) {
        console.warn(`[transformReleases] Unsupported platform: ${platform}`);
        return [];
    }
    return rawData.map((item: any) => config.transformRelease(item, repoWebUrl || ''));
};
