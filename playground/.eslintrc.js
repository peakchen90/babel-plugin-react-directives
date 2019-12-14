module.exports = {
  env: {
    browser: true
  },
  globals: {
    monaco: 'readonly',
    MonacoThemes: 'readonly',
    Babel: 'readonly',
    React: 'readonly',
    ReactDOM: 'readonly'
  },
  rules: {
    'import/no-unresolved': 'off'
  }
};
