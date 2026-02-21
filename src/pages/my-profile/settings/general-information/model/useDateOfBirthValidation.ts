import { useEffect, useMemo, useState } from 'react';

type DateOfBirthValidationStatus = 'valid' | 'invalid_format' | 'under_13' | 'empty';

export type DateOfBirthValidationResult = {
  status: DateOfBirthValidationStatus;
  parsedDateIso: string | null;
};

const parseDateOfBirth = (value: string): string | null | 'invalid' => {
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

  const date = new Date(Date.UTC(year, month - 1, day));
  const isValid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isValid ? date.toISOString() : 'invalid';
};

const getAge = (date: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - date.getUTCFullYear();
  const monthDiff = today.getMonth() - date.getUTCMonth();
  const dayDiff = today.getDate() - date.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
};

const isUnder13 = (parsedDateIso: string): boolean => {
  const birthDate = new Date(parsedDateIso);
  if (Number.isNaN(birthDate.getTime())) return false;
  return getAge(birthDate) < 13;
};

export const validateDateOfBirth = (value: string): DateOfBirthValidationResult => {
  const normalized = value.trim();
  if (!normalized) {
    return { status: 'empty', parsedDateIso: null };
  }

  const parsedDate = parseDateOfBirth(normalized);
  if (parsedDate === 'invalid' || parsedDate === null) {
    return { status: 'invalid_format', parsedDateIso: null };
  }

  if (isUnder13(parsedDate)) {
    return { status: 'under_13', parsedDateIso: parsedDate };
  }

  return { status: 'valid', parsedDateIso: parsedDate };
};

export const formatDateOfBirth = (value?: string | null): string => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const year = String(parsed.getUTCFullYear());

  return `${day}.${month}.${year}`;
};

type UseDateOfBirthValidationParams = {
  dateOfBirthValue: string;
  draftDateOfBirth: string;
  isDateOfBirthTouched: boolean;
  under13ErrorText: string;
};

export const useDateOfBirthValidation = ({
  dateOfBirthValue,
  draftDateOfBirth,
  isDateOfBirthTouched,
  under13ErrorText,
}: UseDateOfBirthValidationParams) => {
  const [dateOfBirthAgeError, setDateOfBirthAgeError] = useState<string | null>(null);

  const dateOfBirthValidation = useMemo(
    () => validateDateOfBirth(dateOfBirthValue),
    [dateOfBirthValue],
  );
  const isDateOfBirthMissing = dateOfBirthValidation.status === 'empty';
  const isDateOfBirthInvalid =
    dateOfBirthValidation.status === 'invalid_format' ||
    dateOfBirthValidation.status === 'under_13';

  useEffect(() => {
    if (!isDateOfBirthTouched) return;

    const timeoutId = window.setTimeout(() => {
      const result = validateDateOfBirth(draftDateOfBirth);
      if (result.status === 'under_13') {
        setDateOfBirthAgeError(under13ErrorText);
        return;
      }

      setDateOfBirthAgeError(null);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [draftDateOfBirth, isDateOfBirthTouched, under13ErrorText]);

  return {
    dateOfBirthValidation,
    isDateOfBirthMissing,
    isDateOfBirthInvalid,
    dateOfBirthAgeError,
    setDateOfBirthAgeError,
  };
};
