import RNFS from 'react-native-fs';
import { sha256, sha256Bytes } from 'react-native-sha256';

// 缓存目录（系统自动清理）
const CACHE_DIR = RNFS.CachesDirectoryPath + '/base64_images/';

// 初始化缓存目录
const initCacheDir = async () => {
    try {
        const exists = await RNFS.exists(CACHE_DIR);
        if (!exists) {
            await RNFS.mkdir(CACHE_DIR);
        }
    } catch (error) {
        throw error;
    }
};

const saveBase64ToFile = async (base64Data: string) => {
    try {
        await initCacheDir();

        // 生成唯一文件名（sha256哈希）
        const hash = await sha256(base64Data); // 避免重复存储相同图片
        const filename = `${hash}.jpg`;
        const filePath = `${CACHE_DIR}${filename}`;

        // 检查是否已缓存
        const exists = await RNFS.exists(filePath);
        if (exists) {
            return filePath; // 直接返回已有路径
        }

        // 去除 Base64 头部（如 "data:image/png;base64,"）
        const pureBase64 = base64Data.split(',')[1] || base64Data;

        // 解码Base64字符串为二进制数据
        // const binaryData = Buffer.from(pureBase64, 'base64');

        // 写入文件（注意 iOS 需要 URI 编码）
        await RNFS.writeFile(filePath, pureBase64, 'base64');

        return filePath;
    } catch (error) {
        throw error;
    }
};

// 清理过期缓存（按时间或数量）
const cleanImageCache = async (maxAgeDays = 7) => {
    try {
        const files = await RNFS.readDir(CACHE_DIR);
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

export { saveBase64ToFile, cleanImageCache };
