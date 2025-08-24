module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { root: ['./src'], alias: { '@': './src' }, extensions: ['.tsx','.ts','.js','.jsx','.json'] }],
      ['module:react-native-dotenv', { moduleName: '@env', path: '.env', safe: false, allowUndefined: true }],
      'react-native-reanimated/plugin', // 반드시 마지막
    ],
  };
};
