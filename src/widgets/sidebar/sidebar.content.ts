import { t, type Dictionary } from 'intlayer';

const sidebarContent = {
  key: 'sidebar',
  content: {
    feed: t({
      en: 'Feed',
      he: 'פיד',
      fr: 'Fil',
      es: 'Feed',
      ru: 'Лента',
      it: 'Feed',
    }),
    create: t({
      en: 'Create',
      he: 'צור',
      fr: 'Créer',
      es: 'Crear',
      ru: 'Создать',
      it: 'Crea',
    }),
    myProfile: t({
      en: 'My Profile',
      he: 'הפרופיל שלי',
      fr: 'Mon profil',
      es: 'Mi perfil',
      ru: 'Мой профиль',
      it: 'Il mio profilo',
    }),
    messenger: t({
      en: 'Messenger',
      he: 'מסרים',
      fr: 'Messagerie',
      es: 'Mensajería',
      ru: 'Мессенджер',
      it: 'Messaggi',
    }),
    search: t({
      en: 'Search',
      he: 'חיפוש',
      fr: 'Recherche',
      es: 'Buscar',
      ru: 'Поиск',
      it: 'Cerca',
    }),
    statistics: t({
      en: 'Statistics',
      he: 'סטטיסטיקה',
      fr: 'Statistiques',
      es: 'Estadísticas',
      ru: 'Статистика',
      it: 'Statistiche',
    }),
    favorites: t({
      en: 'Favorites',
      he: 'מועדפים',
      fr: 'Favoris',
      es: 'Favoritos',
      ru: 'Избранное',
      it: 'Preferiti',
    }),
    logOut: t({
      en: 'Log Out',
      he: 'התנתק',
      fr: 'Se déconnecter',
      es: 'Cerrar sesión',
      ru: 'Выйти',
      it: 'Esci',
    }),
  },
} satisfies Dictionary;

export default sidebarContent;
