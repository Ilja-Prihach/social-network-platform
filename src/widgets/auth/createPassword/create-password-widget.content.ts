import { t, type Dictionary } from 'intlayer';

const createPasswordWidgetContent = {
  key: 'create-password-widget',
  content: {
    modalTitle: t({
      en: 'Email sent',
      he: 'האימייל נשלח',
      fr: 'E-mail envoyé',
      es: 'Correo enviado',
      ru: 'Письмо отправлено',
      it: 'Email inviata',
    }),
    ok: t({
      en: 'OK',
      he: 'אישור',
      fr: 'OK',
      es: 'OK',
      ru: 'ОК',
      it: 'OK',
    }),
    errorTitle: t({
      en: 'Error',
      he: 'שגיאה',
      fr: 'Erreur',
      es: 'Error',
      ru: 'Ошибка',
      it: 'Errore',
    }),
    sentPrefix: t({
      en: 'We have sent a link to confirm your email to',
      he: 'שלחנו קישור לאישור האימייל שלך ל־',
      fr: 'Nous avons envoyé un lien de confirmation à',
      es: 'Hemos enviado un enlace de confirmación a',
      ru: 'Мы отправили ссылку для подтверждения вашего email на',
      it: 'Abbiamo inviato un link di conferma a',
    }),
  },
} satisfies Dictionary;

export default createPasswordWidgetContent;
