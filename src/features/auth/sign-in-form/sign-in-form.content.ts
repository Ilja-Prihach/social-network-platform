import { t, type Dictionary } from 'intlayer';

const signInFormContent = {
  key: 'sign-in-form',
  content: {
    emailLabel: t({
      en: 'Email',
      he: 'אימייל',
      fr: 'E-mail',
      es: 'Correo',
      ru: 'Email',
      it: 'Email',
    }),
    emailPlaceholder: t({
      en: 'Email',
      he: 'אימייל',
      fr: 'E-mail',
      es: 'Correo',
      ru: 'Email',
      it: 'Email',
    }),
    emailRequired: t({
      en: 'Email is required',
      he: 'נדרש אימייל',
      fr: "L'e-mail est obligatoire",
      es: 'El correo es obligatorio',
      ru: 'Email обязателен',
      it: "L'email è obbligatoria",
    }),
    emailInvalid: t({
      en: 'Invalid email',
      he: 'אימייל לא תקין',
      fr: 'E-mail invalide',
      es: 'Correo inválido',
      ru: 'Некорректный email',
      it: 'Email non valida',
    }),
    passwordLabel: t({
      en: 'Password',
      he: 'סיסמה',
      fr: 'Mot de passe',
      es: 'Contraseña',
      ru: 'Пароль',
      it: 'Password',
    }),
    passwordPlaceholder: t({
      en: 'Password',
      he: 'סיסמה',
      fr: 'Mot de passe',
      es: 'Contraseña',
      ru: 'Пароль',
      it: 'Password',
    }),
    passwordRequired: t({
      en: 'Password is required',
      he: 'נדרשת סיסמה',
      fr: 'Le mot de passe est obligatoire',
      es: 'La contraseña es obligatoria',
      ru: 'Пароль обязателен',
      it: 'La password è obbligatoria',
    }),
    passwordMin: t({
      en: 'Minimum 6 characters',
      he: 'מינימום 6 תווים',
      fr: 'Minimum 6 caractères',
      es: 'Mínimo 6 caracteres',
      ru: 'Минимум 6 символов',
      it: 'Minimo 6 caratteri',
    }),
    forgotPassword: t({
      en: 'Forgot Password',
      he: 'שכחת סיסמה',
      fr: 'Mot de passe oublié',
      es: 'Olvidé mi contraseña',
      ru: 'Забыли пароль',
      it: 'Password dimenticata',
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

export default signInFormContent;
