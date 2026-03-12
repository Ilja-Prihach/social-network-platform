import { t, type Dictionary } from 'intlayer';

const headerNotificationsContent = {
  key: 'header-notifications',
  content: {
    title: t({
      en: 'Notifications',
      he: 'התראות',
      fr: 'Notifications',
      es: 'Notificaciones',
      ru: 'Уведомления',
      it: 'Notifiche',
    }),
    itemTitle: t({
      en: 'New notification!',
      he: 'התראה חדשה!',
      fr: 'Nouvelle notification !',
      es: 'Nueva notificación',
      ru: 'Новое уведомление!',
      it: 'Nuova notifica!',
    }),
    newLabel: t({
      en: 'New',
      he: 'חדש',
      fr: 'Nouveau',
      es: 'Nuevo',
      ru: 'Новое',
      it: 'Nuovo',
    }),
    emptyState: t({
      en: 'No notifications yet',
      he: 'אין התראות עדיין',
      fr: 'Aucune notification pour le moment',
      es: 'Aún no hay notificaciones',
      ru: 'Уведомлений пока нет',
      it: 'Nessuna notifica per ora',
    }),
    loadError: t({
      en: 'Failed to load notifications',
      he: 'לא הצלחנו לטעון התראות',
      fr: 'Impossible de charger les notifications',
      es: 'No se pudieron cargar las notificaciones',
      ru: 'Не удалось загрузить уведомления',
      it: 'Impossibile caricare le notifiche',
    }),
    openAriaLabel: t({
      en: 'Open notifications',
      he: 'פתח התראות',
      fr: 'Ouvrir les notifications',
      es: 'Abrir notificaciones',
      ru: 'Открыть уведомления',
      it: 'Apri notifiche',
    }),
    justNow: t({
      en: 'just now',
      he: 'רק עכשיו',
      fr: "à l'instant",
      es: 'justo ahora',
      ru: 'только что',
      it: 'proprio ora',
    }),
  },
} satisfies Dictionary;

export default headerNotificationsContent;
