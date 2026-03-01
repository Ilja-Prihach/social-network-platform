import { t, type Dictionary } from 'intlayer';

const postMediaCarouselContent = {
  key: 'post-media-carousel',
  content: {
    postMediaAlt: t({
      en: 'Post media',
      fr: 'Média de publication',
      es: 'Contenido de la publicación',
      ru: 'Медиа публикации',
      it: 'Contenuto del post',
      he: 'מדיה של הפוסט',
    }),
    previousMedia: t({
      en: 'Previous media',
      fr: 'Média précédent',
      es: 'Medio anterior',
      ru: 'Предыдущее медиа',
      it: 'Media precedente',
      he: 'מדיה קודמת',
    }),
    nextMedia: t({
      en: 'Next media',
      fr: 'Média suivant',
      es: 'Siguiente medio',
      ru: 'Следующее медиа',
      it: 'Media successivo',
      he: 'מדיה הבאה',
    }),
    mediaPagination: t({
      en: 'Media pagination',
      fr: 'Pagination des médias',
      es: 'Paginación de medios',
      ru: 'Пагинация медиа',
      it: 'Paginazione media',
      he: 'דפדוף במדיה',
    }),
    goToMediaPrefix: t({
      en: 'Go to media',
      fr: 'Aller au média',
      es: 'Ir al medio',
      ru: 'Перейти к медиа',
      it: 'Vai al media',
      he: 'עבור למדיה',
    }),
  },
} satisfies Dictionary;

export default postMediaCarouselContent;
