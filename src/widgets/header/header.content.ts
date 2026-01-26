import { t, type Dictionary } from 'intlayer';

const headerContent = {
  key: 'header',
  content: {
    logIn: t({
      en: 'Log in',
      fr: 'Se connecter',
      es: 'Iniciar sesión',
      ru: 'Войти',
      it: 'Accedi',
    }),
    signUp: t({
      en: 'Sign up',
      fr: "S'inscrire",
      es: 'Registrarse',
      ru: 'Зарегистрироваться',
      it: 'Registrati',
    }),
  },
} satisfies Dictionary;

export default headerContent;
