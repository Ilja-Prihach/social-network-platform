type ParsedDateOfBirthParts = {
  day: number;
  month: number;
  year: number;
};

const parseDateOfBirthParts = (value: string): ParsedDateOfBirthParts | null | 'invalid' => {
  const normalized = value.trim();
  if (!normalized) return null;

  let year: number;
  let month: number;
  let day: number;

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalized)) {
    const [dd, mm, yyyy] = normalized.split('.');
    day = Number(dd);
    month = Number(mm);
    year = Number(yyyy);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const [yyyy, mm, dd] = normalized.split('-');
    day = Number(dd);
    month = Number(mm);
    year = Number(yyyy);
  } else {
    return 'invalid';
  }

  return { day, month, year };
};

export const parseDateOfBirthToIso = (value: string): string | null | 'invalid' => {
  const parsed = parseDateOfBirthParts(value);
  if (parsed === null || parsed === 'invalid') return parsed;

  const date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  const isValid =
    date.getUTCFullYear() === parsed.year &&
    date.getUTCMonth() === parsed.month - 1 &&
    date.getUTCDate() === parsed.day;

  return isValid ? date.toISOString() : 'invalid';
};

export const parseDateOfBirthInputValue = (value: string): Date | null => {
  const parsed = parseDateOfBirthParts(value);
  if (parsed === null || parsed === 'invalid') return null;

  const date = new Date(parsed.year, parsed.month - 1, parsed.day);
  const isValid =
    date.getFullYear() === parsed.year &&
    date.getMonth() === parsed.month - 1 &&
    date.getDate() === parsed.day;

  return isValid ? date : null;
};

export const formatDateOfBirthInputValue = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}.${month}.${year}`;
};

export const formatDateOfBirthFromIso = (value?: string | null): string => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const year = String(parsed.getUTCFullYear());

  return `${day}.${month}.${year}`;
};
