const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver to exclude certain directories
config.resolver.blacklistRE = /(docs|coverage|\.git|\.expo|node_modules\/.*\/node_modules\/.*)/;

// Exclude certain extensions from being watched
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'md');

module.exports = config; 