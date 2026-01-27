export const requestPasswordResetMock = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'not-exist@mail.com') {
        reject(new Error("User with this email doesn't exist"));
      } else {
        resolve();
      }
    }, 800);
  });
};
