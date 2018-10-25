module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "standard",
    "plugin:react/recommended"
  ],
  "globals": {
    "chrome": false,
    "document": false,
    "window": false,
  },
  "rules": {
    "semi": ["error", "always"]
  }
};