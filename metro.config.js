const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

// Add alias resolution for the @ symbol
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

module.exports = withNativeWind(config, { input: "./global.css" });