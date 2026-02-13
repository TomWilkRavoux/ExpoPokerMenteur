const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Config pour éviter les problèmes d'import.meta
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];

// Transformer pour gérer les modules ESM
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
