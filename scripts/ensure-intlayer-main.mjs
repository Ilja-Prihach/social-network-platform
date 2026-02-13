import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const mainDir = join(root, '.intlayer', 'main');

const files = {
  'dictionaries.cjs': 'module.exports = {};\n',
  'unmerged_dictionaries.cjs': 'module.exports = {};\n',
  'dictionaries.mjs':
    'const dictionaries = {};\nexport { dictionaries };\nexport default dictionaries;\n',
  'unmerged_dictionaries.mjs':
    'const unmergedDictionaries = {};\nexport { unmergedDictionaries };\nexport default unmergedDictionaries;\n',
};

mkdirSync(mainDir, { recursive: true });

for (const [filename, content] of Object.entries(files)) {
  const fullPath = join(mainDir, filename);
  if (!existsSync(fullPath)) {
    writeFileSync(fullPath, content, 'utf8');
  }
}
