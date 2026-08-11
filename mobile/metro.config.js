const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Explicitly set the watchFolders to the current directory to prevent Metro from
// scanning the entire user directory on Windows when Watchman is not installed.
config.watchFolders = [__dirname];

// Optionally block AppData specifically
config.resolver.blockList = [
  /.*\\AppData\\.*/,
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : [config.resolver.blockList].filter(Boolean))
];

module.exports = config;
