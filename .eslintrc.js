module.exports = {
  extends: ["airbnb-base"],
  env: {
    browser: true
  },
  rules: {
    "no-restricted-globals": ["off", "self"],
    "no-restricted-syntax": ["warn"]
  }
};
