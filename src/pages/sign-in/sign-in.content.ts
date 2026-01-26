import { t, type Dictionary } from 'intlayer';

const signInContent = {
  key: 'sign-in',
  content: {
    title: t({
      en: 'Sign In',
      fr: 'Se connecter',
      es: 'Iniciar sesión',
      ru: 'Вход',
      it: 'Accedi',
    }),
    noAccount: t({
      en: "Don't have an account?",
      fr: "Vous n'avez pas de compte ?",
      es: '¿No tienes cuenta?',
      ru: 'Нет аккаунта?',
      it: 'Non hai un account?',
    }),
    signUp: t({
      en: 'Sign Up',
      fr: "S'inscrire",
      es: 'Registrarse',
      ru: 'Зарегистрироваться',
      it: 'Registrati',
    }),
  },
} satisfies Dictionary;

export default signInContent;
