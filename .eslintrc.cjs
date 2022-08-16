// module.exports = {
//   root: true,
//   env: {
//     node: true,
//   },
//   extends: [
//     "plugin:vue/vue3-essential",
//     "eslint:recommended",
//     "plugin:prettier/recommended",
//   ],
//   rules: {
//     "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
//     "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
//   },
// };
// module.exports = {
//   root: true,
//   extends: [
//     'eslint:recommended',
//     'plugin:vue/vue3-recommended',
//     // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
//   ],
//   rules: {
//     // override/add rules settings here, such as:
//     'vue/no-unused-vars': 'warn',
//     "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
//     "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
//     "indent": ["error", 2],
//   }
// }

module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    // 'plugin:vue/essential',
    // '@vue/airbnb',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
     "plugin:import/recommended",
  ],
  rules: {
    // 'no-console': 'warn',
    // 'no-debugger': 'warn',
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'camelcase': 'warn',
    'no-param-reassign': 'warn',
    'no-unused-vars': 'warn',
    'linebreak-style': 0,
    'comma-dangle': 'warn',
    'no-multi-spaces': 'warn',
    'no-empty-function': 'warn',
    'no-multiple-empty-lines': 'warn',
    "spaced-comment": 'warn',
    "import/no-cycle": "warn",
    'max-len': [
      'warn',
      { code: 200 },
    ],
    "import/extensions": ["warn", "always", {
      "js": "never",
      "vue": "never"
    }]
  },

  // parserOptions: {
  //   parser: 'babel-eslint',
  // },
  //
  // overrides: [
  //   {
  //     files: [
  //       '**/__tests__/*.{j,t}s?(x)',
  //       '**/tests/unit/**/*.spec.{j,t}s?(x)',
  //     ],
  //     env: {
  //       jest: true,
  //     },
  //   },
  // ],
};