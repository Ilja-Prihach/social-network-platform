import { t, type Dictionary } from 'intlayer';

const createPasswordFormContent = {
  key: 'create-password-form',
  content: {
    errorTitle: t({
      en: 'Error',
      fr: 'Erreur',
      es: 'Error',
      ru: 'Ошибка',
      it: 'Errore',
    }),
    ok: t({
      en: 'OK',
      fr: 'OK',
      es: 'OK',
      ru: 'ОК',
      it: 'OK',
    }),
    mismatchError: t({
      en: 'Passwords must match',
      fr: 'Les mots de passe doivent correspondre',
      es: 'Las contraseñas deben coincidir',
      ru: 'Пароли должны совпадать',
      it: 'Le password devono coincidere',
    }),
    lengthError: t({
      en: 'Password must be between 6 and 20 characters',
      fr: 'Le mot de passe doit contenir 6 à 20 caractères',
      es: 'La contraseña debe tener 6 a 20 caracteres',
      ru: 'Пароль должен быть от 6 до 20 символов',
      it: 'La password deve avere 6-20 caratteri',
    }),
    title: t({
      en: 'Create New Password',
      fr: 'Créer un nouveau mot de passe',
      es: 'Crear nueva contraseña',
      ru: 'Создать новый пароль',
      it: 'Crea nuova password',
    }),
    newPasswordLabel: t({
      en: 'New password',
      fr: 'Nouveau mot de passe',
      es: 'Nueva contraseña',
      ru: 'Новый пароль',
      it: 'Nuova password',
    }),
    newPasswordPlaceholder: t({
      en: 'New Password',
      fr: 'Nouveau mot de passe',
      es: 'Nueva contraseña',
      ru: 'Новый пароль',
      it: 'Nuova password',
    }),
    confirmLabel: t({
      en: 'Confirm password',
      fr: 'Confirmer le mot de passe',
      es: 'Confirmar contraseña',
      ru: 'Подтвердите пароль',
      it: 'Conferma password',
    }),
    confirmPlaceholder: t({
      en: 'Password confirmation',
      fr: 'Confirmation du mot de passe',
      es: 'Confirmación de contraseña',
      ru: 'Подтверждение пароля',
      it: 'Conferma password',
    }),
    hint: t({
      en: 'Your password must be between 6 and 20 characters',
      fr: 'Votre mot de passe doit contenir 6 à 20 caractères',
      es: 'Tu contraseña debe tener 6 a 20 caracteres',
      ru: 'Пароль должен быть от 6 до 20 символов',
      it: 'La password deve avere 6-20 caratteri',
    }),
    submit: t({
      en: 'Create new password',
      fr: 'Créer un nouveau mot de passe',
      es: 'Crear nueva contraseña',
      ru: 'Создать новый пароль',
      it: 'Crea nuova password',
    }),
  },
} satisfies Dictionary;

export default createPasswordFormContent;
