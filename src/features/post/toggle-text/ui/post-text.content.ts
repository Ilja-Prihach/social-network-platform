import { t, type Dictionary } from 'intlayer';

const postTextContent = {
  key: 'postText',
  content: {
    showMore: t({
      en: 'Show more',
      he: 'הצג עוד',
      fr: 'Voir plus',
      es: 'Ver más',
      ru: 'Показать больше',
      it: 'Mostra altro',
    }),
    hide: t({
      en: 'Hide',
      he: 'הסתר',
      fr: 'Masquer',
      es: 'Ocultar',
      ru: 'Скрыть',
      it: 'Nascondi',
    }),
    translating: t({
      en: 'Translating...',
      he: 'מתרגם...',
      fr: 'Traduction...',
      es: 'Traduciendo...',
      ru: 'Перевод...',
      it: 'Traduzione...',
    }),
    seeTranslation: t({
      en: 'See translation',
      he: 'הצג תרגום',
      fr: 'Voir la traduction',
      es: 'Ver traducción',
      ru: 'Показать перевод',
      it: 'Mostra traduzione',
    }),
    seeOriginal: t({
      en: 'See original',
      he: 'הצג מקור',
      fr: "Voir l'original",
      es: 'Ver original',
      ru: 'Показать оригинал',
      it: "Mostra l'originale",
    }),
    translationRouteMissing: t({
      en: 'Translation endpoint is unavailable.',
      he: 'נקודת הקצה לתרגום לא זמינה.',
      fr: "Le point d'accès de traduction est indisponible.",
      es: 'El endpoint de traducción no está disponible.',
      ru: 'Эндпоинт перевода недоступен.',
      it: "L'endpoint di traduzione non è disponibile.",
    }),
    translationFailed: t({
      en: 'Could not translate this post right now.',
      he: 'לא ניתן לתרגם את הפוסט כרגע.',
      fr: 'Impossible de traduire ce post pour le moment.',
      es: 'No se pudo traducir esta publicación ahora.',
      ru: 'Не удалось перевести пост прямо сейчас.',
      it: 'Impossibile tradurre questo post al momento.',
    }),
  },
} satisfies Dictionary;

export default postTextContent;
