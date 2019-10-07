module.exports = {
  env: {
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-directives/recommended'
  ],
  rules: {
    'react/prop-types': 'off',
    'max-classes-per-file': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
  }
};
