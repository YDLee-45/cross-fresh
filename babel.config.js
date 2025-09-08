﻿module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: { "@": "./src" },
          extensions: [".tsx", ".ts", ".js", ".jsx", ".json"]
        }
      ],
      "react-native-reanimated/plugin" // 항상 마지막
    ]
  };
};
