const makeEslintConfig = require("share/src/makeEslintConfig.cjs");

const config = makeEslintConfig(__dirname);

module.exports = {
  ...config,
  ignorePatterns: ["cdk.out"],
};
