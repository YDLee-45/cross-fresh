module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // reanimated 플러그인은 항상 마지막
      "react-native-reanimated/plugin"
    ]
  };
};
