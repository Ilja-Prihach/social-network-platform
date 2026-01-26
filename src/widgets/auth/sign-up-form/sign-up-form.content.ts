import { t, type Dictionary } from 'intlayer';

const signUpFormContent = {
  key: 'sign-up-form',
  content: {
    userName: t({
      en: 'Username',
      fr: "Nom d'utilisateur",
      es: 'Nombre de usuario',
      ru: 'Имя пользователя',
      it: 'Nome utente',
    }),
    email: t({
      en: 'Email',
      fr: 'E-mail',
      es: 'Correo',
      ru: 'Email',
      it: 'Email',
    }),
    password: t({
      en: 'Password',
      fr: 'Mot de passe',
      es: 'Contraseña',
      ru: 'Пароль',
      it: 'Password',
    }),
    passwordConfirm: t({
      en: 'Password confirmation',
      fr: 'Confirmation du mot de passe',
      es: 'Confirmación de contraseña',
      ru: 'Подтверждение пароля',
      it: 'Conferma password',
    }),
    agreePrefix: t({
      en: 'I agree to the',
      fr: "J'accepte les",
      es: 'Acepto los',
      ru: 'Я согласен(на) с',
      it: 'Accetto i',
    }),
    terms: t({
      en: 'Terms of Service',
      fr: "Conditions d'utilisation",
      es: 'Términos del servicio',
      ru: 'Условия использования',
      it: 'Termini di servizio',
    }),
    privacy: t({
      en: 'Privacy Policy',
      fr: 'Politique de confidentialité',
      es: 'Política de privacidad',
      ru: 'Политика конфиденциальности',
      it: 'Informativa sulla privacy',
    }),
    signUp: t({
      en: 'Sign Up',
      fr: "S'inscrire",
      es: 'Registrarse',
      ru: 'Зарегистрироваться',
      it: 'Registrati',
    }),
    userNameRequired: t({
      en: 'Username required',
      fr: "Nom d'utilisateur obligatoire",
      es: 'Se requiere nombre de usuario',
      ru: 'Имя пользователя обязательно',
      it: 'Nome utente obbligatorio',
    }),
    invalidEmail: t({
      en: 'Invalid email',
      fr: 'E-mail invalide',
      es: 'Correo inválido',
      ru: 'Некорректный email',
      it: 'Email non valida',
    }),
    passwordMin: t({
      en: 'Min 6 chars',
      fr: 'Min 6 caractères',
      es: 'Mínimo 6 caracteres',
      ru: 'Минимум 6 символов',
      it: 'Minimo 6 caratteri',
    }),
    passwordMismatch: t({
      en: 'Passwords do not match',
      fr: 'Les mots de passe ne correspondent pas',
      es: 'Las contraseñas no coinciden',
      ru: 'Пароли не совпадают',
      it: 'Le password non coincidono',
    }),
  },
} satisfies Dictionary;

export default signUpFormContent;
