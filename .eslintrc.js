module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true,
        "jest/globals": true,
        "cypress/globals": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:cypress/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
    },
    "plugins": ["jest", "cypress"]
};
