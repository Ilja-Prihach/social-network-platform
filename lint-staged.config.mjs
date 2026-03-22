export default {
  'web/**/*.{ts,tsx,js,jsx}': ['eslint --config web/eslint.config.mjs --fix', 'prettier --write'],
  'admin/**/*.{ts,tsx,js,jsx}': [
    'eslint --config admin/eslint.config.mjs --fix',
    'prettier --write',
  ],
  'packages/**/*.{ts,tsx,js,jsx}': [
    'eslint --config packages/eslint.config.mjs --fix',
    'prettier --write',
  ],
  '**/*.{json,md,yml,yaml,mjs}': ['prettier --write'],
  '{web,packages}/**/*.scss': ['stylelint --config web/stylelint.config.js', 'prettier --write'],
};
