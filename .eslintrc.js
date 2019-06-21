module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  rules: {
    'comma-dangle': 0,
    'react/forbid-prop-types': 0,
    'react/no-array-index-key': 0,
    'react/no-did-update-set-state': 0,
    'no-plusplus': 0,
    'react/require-default-props': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }]
  },
  parser: 'babel-eslint',
  env: {
    jest: true,
    browser: true
  }
};
