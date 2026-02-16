import { t, type Dictionary } from 'intlayer';

const datePickerContent = {
  key: 'date_picker',
  content: {
    defaultLabelSingle: t({
      en: 'Date select',
      fr: 'Choix de date',
      es: 'Seleccionar fecha',
      ru: 'Выбор даты',
      it: 'Selezione data',
      he: 'בחירת תאריך',
    }),
    defaultLabelRange: t({
      en: 'Date range',
      fr: 'Période',
      es: 'Rango de fechas',
      ru: 'Период дат',
      it: 'Intervallo di date',
      he: 'טווח תאריכים',
    }),
    placeholderSingle: t({
      en: 'Select date',
      fr: 'Sélectionnez une date',
      es: 'Selecciona una fecha',
      ru: 'Выберите дату',
      it: 'Seleziona una data',
      he: 'בחר תאריך',
    }),
    placeholderRange: t({
      en: 'Select date range',
      fr: 'Sélectionnez une période',
      es: 'Selecciona un rango',
      ru: 'Выберите период',
      it: 'Seleziona un intervallo',
      he: 'בחר טווח תאריכים',
    }),
    calendar: t({
      en: 'Calendar',
      fr: 'Calendrier',
      es: 'Calendario',
      ru: 'Календарь',
      it: 'Calendario',
      he: 'לוח שנה',
    }),
    previousMonth: t({
      en: 'Previous month',
      fr: 'Mois précédent',
      es: 'Mes anterior',
      ru: 'Предыдущий месяц',
      it: 'Mese precedente',
      he: 'חודש קודם',
    }),
    nextMonth: t({
      en: 'Next month',
      fr: 'Mois suivant',
      es: 'Mes siguiente',
      ru: 'Следующий месяц',
      it: 'Mese successivo',
      he: 'חודש הבא',
    }),
    selectYear: t({
      en: 'Select year',
      fr: "Sélectionner l'année",
      es: 'Seleccionar año',
      ru: 'Выберите год',
      it: "Seleziona l'anno",
      he: 'בחר שנה',
    }),
  },
} satisfies Dictionary;

export default datePickerContent;
