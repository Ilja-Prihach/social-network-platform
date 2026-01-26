import { t, type Dictionary } from 'intlayer';

const requestPasswordResetContent = {
  key: 'request-password-reset',
  content: {
    modalTitle: t({
      en: 'Email sent',
      fr: 'E-mail envoyé',
      es: 'Correo enviado',
      ru: 'Письмо отправлено',
      it: 'Email inviata',
    }),
    modalConfirm: t({
      en: 'OK',
      fr: 'OK',
      es: 'OK',
      ru: 'ОК',
      it: 'OK',
    }),
    errorTitle: t({
      en: 'Error',
      fr: 'Erreur',
      es: 'Error',
      ru: 'Ошибка',
      it: 'Errore',
    }),
    sentPrefix: t({
      en: 'We have sent a link to confirm your email to',
      fr: 'Nous avons envoyé un lien de confirmation à',
      es: 'Hemos enviado un enlace de confirmación a',
      ru: 'Мы отправили ссылку для подтверждения вашего email на',
      it: 'Abbiamo inviato un link di conferma a',
    }),
    title: t({
      en: 'Forgot Password',
      fr: 'Mot de passe oublié',
      es: 'Olvidé mi contraseña',
      ru: 'Забыли пароль',
      it: 'Password dimenticata',
    }),
    emailLabel: t({
      en: 'Email',
      fr: 'E-mail',
      es: 'Correo',
      ru: 'Email',
      it: 'Email',
    }),
    emailPlaceholder: t({
      en: 'Enter your email',
      fr: 'Entrez votre e-mail',
      es: 'Introduce tu correo',
      ru: 'Введите ваш email',
      it: 'Inserisci la tua email',
    }),
    description: t({
      en: 'Enter your email and we will send you further instruction',
      fr: "Entrez votre e-mail et nous vous enverrons des instructions",
      es: 'Introduce tu correo y te enviaremos instrucciones',
      ru: 'Введите email, и мы пришлём дальнейшие инструкции',
      it: 'Inserisci la tua email e ti invieremo le istruzioni',
    }),
    sendLink: t({
      en: 'Send link',
      fr: 'Envoyer le lien',
      es: 'Enviar enlace',
      ru: 'Отправить ссылку',
      it: 'Invia link',
    }),
    backToSignIn: t({
      en: 'Back to Sign In',
      fr: 'Retour à la connexion',
      es: 'Volver a iniciar sesión',
      ru: 'Назад ко входу',
      it: 'Torna al login',
    }),
  },
} satisfies Dictionary;

export default requestPasswordResetContent;
