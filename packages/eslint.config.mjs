import { defineConfig, globalIgnores } from 'eslint/config';
import nextTs from 'eslint-config-next/typescript';
import importPlugin from 'eslint-plugin-import';
import boundaries from 'eslint-plugin-boundaries';

export default defineConfig([
  ...nextTs,

  {
    files: ['packages/**/*.ts', 'packages/**/*.tsx'],

    plugins: {
      import: importPlugin,
      boundaries,
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './packages/auth-core/tsconfig.json',
            './packages/auth-ui/tsconfig.json',
            './packages/layout-ui/tsconfig.json',
          ],
        },
      },
      'boundaries/elements': [{ type: 'packages', pattern: 'packages/*' }],
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
          rules: [{ from: 'packages', allow: ['packages'] }],
        },
      ],
    },
  },

  globalIgnores(['**/node_modules/**', '**/.next/**', '**/out/**', '**/build/**']),
]);
