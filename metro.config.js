const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Добавляем поддержку монорепозиториев (опционально)
config.watchFolders = [__dirname];

// Настройка для работы с алиасами
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'svg', 'mjs'],
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
};

module.exports = config;