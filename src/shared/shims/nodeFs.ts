export const existsSync = () => false;
export const mkdirSync = () => undefined;
export const rmSync = () => undefined;
export const writeFileSync = () => undefined;
export const readFileSync = () => '';
export const readdirSync = () => [];
export const statSync = () => ({ isDirectory: () => false, isFile: () => false });
