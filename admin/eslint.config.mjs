import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';
import boundaries from 'eslint-plugin-boundaries';

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      import: importPlugin,
      boundaries,
    },

    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
      'boundaries/elements': [
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
        { type: 'packages', pattern: '../packages/*' },
      ],
    },

    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared', 'packages'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared', 'packages'] },
            { from: 'features', allow: ['entities', 'shared', 'packages'] },
            { from: 'entities', allow: ['shared', 'packages'] },
            { from: 'shared', allow: ['shared', 'packages'] },
            { from: 'packages', allow: ['packages'] },
          ],
        },
      ],
    },
  },

  globalIgnores(['.next/**', '.intlayer/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
