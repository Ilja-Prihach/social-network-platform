import { t, type Dictionary } from 'intlayer';

const createPasswordWidgetContent = {
  key: 'create-password-widget',
  content: {
    modalTitle: t({
      en: 'Email sent',
      fr: 'E-mail envoyé',
      es: 'Correo enviado',
      ru: 'Письмо отправлено',
      it: 'Email inviata',
    }),
    ok: t({
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
  },
} satisfies Dictionary;

export default createPasswordWidgetContent;
