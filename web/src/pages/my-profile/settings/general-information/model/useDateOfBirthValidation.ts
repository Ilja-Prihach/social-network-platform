import { useEffect, useMemo, useState } from 'react';
import { parseDateOfBirthToIso } from './dateOfBirth';

type DateOfBirthValidationStatus = 'valid' | 'invalid_format' | 'under_13' | 'empty';

export type DateOfBirthValidationResult = {
  status: DateOfBirthValidationStatus;
  parsedDateIso: string | null;
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

  const parsedDate = parseDateOfBirthToIso(normalized);
  if (parsedDate === 'invalid' || parsedDate === null) {
    return { status: 'invalid_format', parsedDateIso: null };
  }

  if (isUnder13(parsedDate)) {
    return { status: 'under_13', parsedDateIso: parsedDate };
  }

  return { status: 'valid', parsedDateIso: parsedDate };
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
