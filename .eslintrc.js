module.exports = {
  root: true,
  env: {
    browser: false,
    node: true
  },
  extends: [
    'airbnb-base'
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-use-before-define': ["error", { "functions": false }],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-new': 'off',
    'arrow-body-style': 'off',
    'no-empty-function': 'off',
    'no-nested-ternary': 'off',
    'no-return-assign': 'off',
    'no-unused-vars': 'error',
    'global-require': 'off',
    'object-curly-spacing': 'off',
    'max-len': 'off',
    'comma-dangle': 'off',
    'prefer-destructuring': 'off',
    'class-methods-use-this': 'off',
    'eol-last': 'off',
    'eqeqeq': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-promise-reject-errors': 'off',
    'generator-star-spacing': 'off',
    'new-cap': 'off',
    "no-cond-assign": "off"
  }
};
