export const mkdir = async () => undefined;
export const rm = async () => undefined;
export const writeFile = async () => undefined;
export const readFile = async () => '';
export const readdir = async () => [];
export const stat = async () => ({ isDirectory: () => false, isFile: () => false });
