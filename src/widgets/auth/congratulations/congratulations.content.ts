import { t, type Dictionary } from 'intlayer';

const congratulationsContent = {
  key: 'congratulations',
  content: {
    title: t({
      en: 'Congratulations!',
      he: 'מזל טוב!',
      fr: 'Félicitations !',
      es: '¡Felicidades!',
      ru: 'Поздравляем!',
      it: 'Congratulazioni!',
    }),
    description: t({
      en: 'Your email has been confirmed',
      he: 'האימייל שלך אומת',
      fr: 'Votre e-mail a été confirmé',
      es: 'Tu correo ha sido confirmado',
      ru: 'Ваш email подтверждён',
      it: 'La tua email è stata confermata',
    }),
    signIn: t({
      en: 'Sign In',
      he: 'התחבר',
      fr: 'Se connecter',
      es: 'Iniciar sesión',
      ru: 'Войти',
      it: 'Accedi',
    }),
    imageAlt: t({
      en: 'Congratulations',
      he: 'מזל טוב',
      fr: 'Félicitations',
      es: 'Felicidades',
      ru: 'Поздравления',
      it: 'Congratulazioni',
    }),
  },
} satisfies Dictionary;

export default congratulationsContent;
