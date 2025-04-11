const {
    getDefaultConfig,
    mergeConfig,
} = require('@react-native/metro-config');

module.exports = function (baseConfig) {
    const defaultConfig = mergeConfig(
        baseConfig,
        getDefaultConfig(__dirname),
    );
    const {
        resolver: {assetExts, sourceExts},
    } = defaultConfig;

    return mergeConfig(defaultConfig, {
        resolver: {
            assetExts: [...assetExts],
            // assetExts: [...assetExts, 'js', 'css'],
            sourceExts: [...sourceExts],
            // sourceExts: sourceExts.filter(ext => ext !== 'js' && ext !== 'css'),
        },
    });
};
