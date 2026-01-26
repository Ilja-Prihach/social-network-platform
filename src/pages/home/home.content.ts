import { t, type Dictionary } from 'intlayer';

const homeContent = {
  key: 'home',
  content: {
    selectPlaceholder: t({
      en: 'Select value',
      fr: 'Sélectionner une valeur',
      es: 'Selecciona un valor',
      ru: 'Выберите значение',
      it: 'Seleziona un valore',
    }),
    selectLabel: t({
      en: 'Select box',
      fr: 'Liste déroulante',
      es: 'Selector',
      ru: 'Выпадающий список',
      it: 'Selettore',
    }),
    selectOptionSelectBox: t({
      en: 'Select box',
      fr: 'Sélecteur',
      es: 'Selector',
      ru: 'Выбор',
      it: 'Selettore',
    }),
    selectOptionMister: t({
      en: 'Mister',
      fr: 'Monsieur',
      es: 'Señor',
      ru: 'Мистер',
      it: 'Signor',
    }),
    openModalButton: t({
      en: 'Open modal',
      fr: 'Ouvrir la modale',
      es: 'Abrir modal',
      ru: 'Открыть модальное окно',
      it: 'Apri modale',
    }),
    modalTitle: t({
      en: 'Email sent',
      fr: 'E-mail envoyé',
      es: 'Correo enviado',
      ru: 'Письмо отправлено',
      it: 'Email inviata',
    }),
    modalDescription: t({
      en: 'We have sent a link to confirm your email to epam@epam.com',
      fr: 'Nous avons envoyé un lien de confirmation à epam@epam.com',
      es: 'Hemos enviado un enlace de confirmación a epam@epam.com',
      ru: 'Мы отправили ссылку для подтверждения вашего email на epam@epam.com',
      it: 'Abbiamo inviato un link di conferma a epam@epam.com',
    }),
    heading: t({
      en: 'Home Page',
      fr: "Page d'accueil",
      es: 'Página de inicio',
      ru: 'Главная',
      it: 'Pagina iniziale',
    }),
    intro: t({
      en: 'Entry point stub wired through the Feature-Sliced Design layout. Replace with the actual landing or feed content.',
      fr: "Page d'entrée factice liée au découpage FSD. Remplacez par la page d'accueil ou le fil.",
      es: 'Plantilla de entrada conectada a FSD. Sustitúyela por el landing o el feed.',
      ru: 'Заглушка стартовой страницы по FSD. Замените на реальный лендинг или ленту.',
      it: 'Pagina di ingresso stub collegata al layout FSD. Sostituisci con landing o feed.',
    }),
    postModalPrefix: t({
      en: 'Post modal placeholder for id',
      fr: "Espace réservé de modale du post pour l'id",
      es: 'Marcador de posición del modal del post para id',
      ru: 'Заглушка модального окна поста для id',
      it: 'Segnaposto modale del post per id',
    }),
    createModal: t({
      en: 'Create post modal placeholder',
      fr: 'Espace réservé de modale de création de post',
      es: 'Marcador de posición del modal de creación de post',
      ru: 'Заглушка модального окна создания поста',
      it: 'Segnaposto modale di creazione post',
    }),
    modalHint: t({
      en: 'Query-driven modal state. If both postId and action are present, postId takes precedence.',
      fr: 'État de modale piloté par la requête. Si postId et action sont présents, postId a priorité.',
      es: 'Estado del modal controlado por la URL. Si hay postId y action, postId tiene prioridad.',
      ru: 'Состояние модалки определяется параметрами запроса. Если заданы postId и action, приоритет у postId.',
      it: 'Stato della modale guidato dalla query. Se postId e action sono presenti, postId ha priorità.',
    }),
    noModal: t({
      en: 'No modal active. Add ?postId=42 or ?action=create to the URL to preview modal handling.',
      fr: 'Aucune modale active. Ajoutez ?postId=42 ou ?action=create pour prévisualiser.',
      es: 'No hay modal activo. Añade ?postId=42 o ?action=create para ver el manejo.',
      ru: 'Модальное окно неактивно. Добавьте ?postId=42 или ?action=create, чтобы посмотреть.',
      it: 'Nessuna modale attiva. Aggiungi ?postId=42 o ?action=create per vedere.',
    }),
  },
} satisfies Dictionary;

export default homeContent;
