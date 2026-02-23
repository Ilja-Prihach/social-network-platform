import { t, type Dictionary } from 'intlayer';

const settingsTabsContent = {
  key: 'settings-tabs',
  content: {
    generalInformation: t({
      en: 'General information',
      he: 'מידע כללי',
      fr: 'Informations générales',
      es: 'Información general',
      ru: 'Общая информация',
      it: 'Informazioni generali',
    }),
    device: t({
      en: 'Device',
      he: 'מכשיר',
      fr: 'Appareil',
      es: 'Dispositivo',
      ru: 'Устройство',
      it: 'Dispositivo',
    }),
    accountManagement: t({
      en: 'Account management',
      he: 'ניהול חשבון',
      fr: 'Gestion du compte',
      es: 'Gestión de la cuenta',
      ru: 'Управление аккаунтом',
      it: 'Gestione account',
    }),
    myPayments: t({
      en: 'My payments',
      he: 'התשלומים שלי',
      fr: 'Mes paiements',
      es: 'Mis pagos',
      ru: 'Мои платежи',
      it: 'I miei pagamenti',
    }),
  },
} satisfies Dictionary;

export default settingsTabsContent;
