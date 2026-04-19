import { t, type Dictionary } from 'intlayer';

const adminSidebarContent = {
  key: 'admin-sidebar',
  content: {
    users: t({
      en: 'User List',
      ru: 'Список пользователей',
      it: 'Elenco utenti',
      es: 'Lista de usuarios',
      fr: 'Liste des utilisateurs',
      he: 'רשימת משתמשים',
    }),
    statistics: t({
      en: 'Statistics',
      ru: 'Статистика',
      it: 'Statistiche',
      es: 'Estadisticas',
      fr: 'Statistiques',
      he: 'סטטיסטיקה',
    }),
    payments: t({
      en: 'Payment List',
      ru: 'Список платежей',
      it: 'Elenco pagamenti',
      es: 'Lista de pagos',
      fr: 'Liste des paiements',
      he: 'רשימת תשלומים',
    }),
    posts: t({
      en: 'Post List',
      ru: 'Список постов',
      it: 'Elenco post',
      es: 'Lista de publicaciones',
      fr: 'Liste des publications',
      he: 'רשימת פוסטים',
    }),
  },
} satisfies Dictionary;

export default adminSidebarContent;
