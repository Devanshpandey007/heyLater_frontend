module.exports = {
  extends: ['@react-native'],
  parserOptions: {
    babelOptions: {
      presets: ['@react-native/babel-preset'],
    },
  },
  env: {
    browser: true,
    node: true,
  },
};