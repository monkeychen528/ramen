module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "import"],
  rules: {
    "linebreak-style": [
      "error",
      process.env.NODE_ENV === "prod" ? "unix" : "windows",
    ],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    quotes: [2, "single"],
  },
};
