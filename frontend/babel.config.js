module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin pour supporter import.meta
      ['@babel/plugin-transform-modules-commonjs', {
        allowTopLevelThis: true,
        loose: true,
        strictMode: false
      }],
      // Plugin pour remplacer import.meta
      function replaceImportMeta() {
        return {
          visitor: {
            MetaProperty(path) {
              path.replaceWithSourceString('({})');
            }
          }
        };
      }
    ]
  };
};
