import RNFS from 'react-native-fs';
import { sha256 } from 'react-native-sha256';

// 缓存分组配置
const CACHE_GROUPS = {
    POSTS: 'posts',      // 帖子图片
    AVATARS: 'avatars',  // 用户头像
    CHAT: 'chat',        // 聊天图片
} as const;

type CacheGroup = keyof typeof CACHE_GROUPS;

// 获取缓存目录路径
const getCacheDir = (group: CacheGroup) =>
    `${RNFS.CachesDirectoryPath}/images/${CACHE_GROUPS[group]}/`;

// 初始化缓存目录
const initCacheDir = async (dirPath: string) => {
    const exists = await RNFS.exists(dirPath);
    if (!exists) {
        await RNFS.mkdir(dirPath);
    }
};

// 分组保存图片
const saveImageToFile = async (
    base64Data: string,
    group: CacheGroup = 'POSTS' // 默认分组
) => {
    try {
        if (!base64Data) {
            return '';
        }

        const cacheDir = getCacheDir(group);

        if (group === 'POSTS') {
            await initCacheDir(cacheDir);
        }

        const hash = await sha256(base64Data);
        const filename = `${hash}.jpg`;
        const filePath = `${cacheDir}${filename}`;

        if (await RNFS.exists(filePath)) {
            return filePath;
        }

        const pureBase64 = base64Data.split(',')[1] || base64Data;
        await RNFS.writeFile(filePath, pureBase64, 'base64');

        return filePath;
    } catch (error) {
        throw error;
    }
};

// 清理过期缓存（按时间或数量）
const cleanImageCacheByAge = async (
    group: CacheGroup,
    maxAgeDays = 7
) => {
    try {
        const cacheDir = getCacheDir(group);
        const files = await RNFS.readDir(cacheDir);
        const now = new Date();
        const maxAgeMs = maxAgeDays * 24 * 3600 * 1000;

        for (const file of files) {
            const { mtime } = file;
            if (!mtime || now.getTime() - mtime.getTime() >= maxAgeMs) {
                await RNFS.unlink(file.path);
            }
        }
    } catch(error) {
        throw error;
    }
};

const cleanAllImageCache = async (
    group: CacheGroup,
    maxAgeDays = 7
) => {
    try {
        const cacheDir = getCacheDir(group);
        const files = await RNFS.readDir(cacheDir);

        for (const file of files) {
            await RNFS.unlink(file.path);
        }
    } catch(error) {
        throw error;
    }
};

export { saveImageToFile, cleanImageCacheByAge, cleanAllImageCache };
