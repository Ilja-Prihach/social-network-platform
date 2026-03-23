const LOCALE_FALLBACK = 'en';

export const formatNotificationRelativeTime = (
  iso: string,
  locale: string,
  justNowLabel: string,
): string => {
  const now = Date.now();
  const timestamp = new Date(iso).getTime();

  if (Number.isNaN(timestamp)) {
    return '';
  }

  const diffMs = timestamp - now;
  const diffMinutes = Math.round(diffMs / 60_000);
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 1) {
    return justNowLabel;
  }

  if (absMinutes < 60) {
    return formatRelative(diffMinutes, 'minute', locale);
  }

  const diffHours = Math.round(diffMinutes / 60);
  const absHours = Math.abs(diffHours);
  if (absHours < 24) {
    return formatRelative(diffHours, 'hour', locale);
  }

  const diffDays = Math.round(diffHours / 24);
  const absDays = Math.abs(diffDays);
  if (absDays < 30) {
    return formatRelative(diffDays, 'day', locale);
  }

  const diffMonths = Math.round(diffDays / 30);
  return formatRelative(diffMonths, 'month', locale);
};

const formatRelative = (value: number, unit: Intl.RelativeTimeFormatUnit, locale: string) => {
  const formatter = new Intl.RelativeTimeFormat(normalizeLocale(locale), {
    numeric: 'always',
  });

  return formatter.format(value, unit);
};

const normalizeLocale = (locale: string) => {
  return typeof locale === 'string' && locale.length > 0 ? locale : LOCALE_FALLBACK;
};
