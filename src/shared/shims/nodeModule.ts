export const createRequire = () => {
  return () => {
    throw new Error('createRequire is unavailable in browser bundles');
  };
};
