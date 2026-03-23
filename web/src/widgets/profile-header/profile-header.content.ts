import { t, type Dictionary } from 'intlayer';

const profileHeaderContent = {
  key: 'profile-header',
  content: {
    profileSettings: t({
      en: 'Profile Settings',
      ru: 'Настройки профиля',
      it: 'Impostazioni profilo',
      es: 'Configuracion del perfil',
      fr: 'Parametres du profil',
      he: 'הגדרות פרופיל',
    }),
    following: t({
      en: 'Following',
      ru: 'Подписки',
      it: 'Seguiti',
      es: 'Siguiendo',
      fr: 'Abonnements',
      he: 'עוקב',
    }),
    followers: t({
      en: 'Followers',
      ru: 'Подписчики',
      it: 'Follower',
      es: 'Seguidores',
      fr: 'Abonnes',
      he: 'עוקבים',
    }),
    publications: t({
      en: 'Publications',
      ru: 'Публикации',
      it: 'Pubblicazioni',
      es: 'Publicaciones',
      fr: 'Publications',
      he: 'פרסומים',
    }),
  },
} satisfies Dictionary;

export default profileHeaderContent;
