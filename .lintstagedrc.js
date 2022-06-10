module.exports = {
  '*.{js,jsx}': ['eslint', 'prettier --loglevel warn --debug-check'],
  '*.{ts,tsx}': [
    'eslint',
    'prettier --loglevel warn --debug-check',
    // https://github.com/microsoft/TypeScript/issues/27379
    // it will check all files, not just git staged files
    () => 'tsc --skipLibCheck --noEmit',
  ],
};
