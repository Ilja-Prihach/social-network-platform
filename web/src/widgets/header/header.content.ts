import { t, type Dictionary } from 'intlayer';

const headerContent = {
  key: 'header',
  content: {
    logIn: t({
      en: 'Log in',
      he: 'התחבר',
      fr: 'Se connecter',
      es: 'Iniciar sesión',
      ru: 'Войти',
      it: 'Accedi',
    }),
    signUp: t({
      en: 'Sign up',
      he: 'הירשם',
      fr: "S'inscrire",
      es: 'Registrarse',
      ru: 'Зарегистрироваться',
      it: 'Registrati',
    }),
  },
} satisfies Dictionary;

export default headerContent;
