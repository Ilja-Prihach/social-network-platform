import { t, type Dictionary } from 'intlayer';

const emailVerificationExpiredContent = {
  key: 'email-verification-expired',
  content: {
    title: t({
      en: 'Email verification link expired',
      fr: 'Le lien de vérification a expiré',
      es: 'El enlace de verificación ha caducado',
      ru: 'Ссылка подтверждения устарела',
      it: 'Il link di verifica è scaduto',
    }),
    description: t({
      en: 'Looks like the verification link has expired. Not to worry, we can send the link again',
      fr: "Le lien de vérification a expiré. Pas d'inquiétude, nous pouvons l'envoyer à nouveau",
      es: 'Parece que el enlace de verificación expiró. Podemos enviarlo de nuevo',
      ru: 'Похоже, ссылка подтверждения истекла. Мы можем отправить её снова',
      it: 'Sembra che il link di verifica sia scaduto. Possiamo inviarlo di nuovo',
    }),
    resend: t({
      en: 'Resend link',
      fr: 'Renvoyer le lien',
      es: 'Reenviar enlace',
      ru: 'Отправить ссылку снова',
      it: 'Reinvia link',
    }),
    imagePlaceholder: t({
      en: 'Image 473x352',
      fr: 'Image 473x352',
      es: 'Imagen 473x352',
      ru: 'Изображение 473x352',
      it: 'Immagine 473x352',
    }),
  },
} satisfies Dictionary;

export default emailVerificationExpiredContent;
