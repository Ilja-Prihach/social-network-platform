import { t, type Dictionary } from 'intlayer';

const signUpContent = {
  key: 'sign-up',
  content: {
    title: t({
      en: 'Sign Up',
      he: 'הירשם',
      fr: "S'inscrire",
      es: 'Registrarse',
      ru: 'Регистрация',
      it: 'Registrati',
    }),
    hasAccount: t({
      en: 'Do you have an account?',
      he: 'יש לך חשבון?',
      fr: 'Vous avez déjà un compte ?',
      es: '¿Ya tienes una cuenta?',
      ru: 'У вас уже есть аккаунт?',
      it: 'Hai già un account?',
    }),
    signIn: t({
      en: 'Sign In',
      he: 'התחבר',
      fr: 'Se connecter',
      es: 'Iniciar sesión',
      ru: 'Войти',
      it: 'Accedi',
    }),
  },
} satisfies Dictionary;

export default signUpContent;
