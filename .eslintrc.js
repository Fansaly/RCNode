const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      'jsx': true,
    },
  },
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [
    'babel',
    'react',
    'jsx-a11y',
  ],
  rules: {
    'indent': OFF,
    'curly': WARN,
    'brace-style': [ERROR, '1tbs', {
      'allowSingleLine': true,
    }],

    'semi': [ERROR, 'always'],
    'semi-spacing': [ERROR, {
      'before': false,
      'after': true,
    }],
    'quotes': [ERROR, 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true,
    }],
    'jsx-quotes': [ERROR, 'prefer-double'],
    'no-dupe-keys': ERROR,
    'comma-dangle': [ERROR, 'always-multiline'],
    'dot-location': [ERROR, 'property'],
    'dot-notation': [ERROR, {
      'allowKeywords': true,
    }],

    'eqeqeq': [ERROR, 'allow-null'],
    'no-eq-null': ERROR,
    'valid-typeof': [ERROR, {
      'requireStringLiterals': true,
    }],

    // 'no-console': ERROR,
    'no-alert': ERROR,
    'eol-last': ERROR,
    'no-empty': ERROR,
    'no-shadow': ERROR,
    'no-extra-boolean-cast': OFF,
    'no-inner-declarations': ERROR,
    'block-scoped-var': ERROR,
    'default-case': ERROR,
    'guard-for-in': ERROR,
    'no-caller': ERROR,
    'no-else-return': ERROR,

    'comma-spacing': [ERROR, {
      'before': false,
      'after': true,
    }],
    'key-spacing': [ERROR, {
      'beforeColon': false,
      'afterColon': true,
    }],
    'no-multiple-empty-lines': [ERROR, {
      'max': ERROR,
    }],
    'no-spaced-func': ERROR,
    'keyword-spacing': [ERROR, {
      'after': true,
      'before': true,
    }],
    'space-before-blocks': ERROR,
    'space-before-function-paren': [ERROR, {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'space-infix-ops': ERROR,
    'spaced-comment': [ERROR, 'always',  {
      'markers': ['global', 'eslint'],
    }],

    'react/jsx-filename-extension': [WARN, {
      'extensions': ['.jsx'],
    }],
    'react/self-closing-comp': ERROR,
    'react/jsx-tag-spacing': [ERROR, {
      'closingSlash': 'never',
      'beforeSelfClosing': 'always',
    }],
    'react/jsx-wrap-multilines': ERROR,
    'react/jsx-handler-names': [ERROR, {
      'eventHandlerPrefix': 'handle',
      'eventHandlerPropPrefix': 'on',
    }],
    'react/no-danger': WARN,
    'react/jsx-no-target-blank': OFF,

    'jsx-a11y/no-autofocus': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
  },
  overrides: [
    {
      files: ['src/index.js'],
      rules: {
        'react/jsx-filename-extension': OFF,
      },
    },
  ],
};
