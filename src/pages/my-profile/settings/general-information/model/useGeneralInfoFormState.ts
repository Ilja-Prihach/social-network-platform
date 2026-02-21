import { useState } from 'react';
import type { CountryValue } from './locationOptions';

type FormDraft = {
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  aboutMe: string;
};

type FormTouched = {
  userName: boolean;
  firstName: boolean;
  lastName: boolean;
  dateOfBirth: boolean;
  aboutMe: boolean;
};

export const useGeneralInfoFormState = () => {
  const [draft, setDraft] = useState<FormDraft>({
    userName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aboutMe: '',
  });
  const [touched, setTouched] = useState<FormTouched>({
    userName: false,
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    aboutMe: false,
  });
  const [selectedCountry, setSelectedCountry] = useState<CountryValue | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [countryChanged, setCountryChanged] = useState(false);

  const setUserName = (value: string) => {
    setTouched((prev) => ({ ...prev, userName: true }));
    setDraft((prev) => ({ ...prev, userName: value }));
  };

  const setFirstName = (value: string) => {
    setTouched((prev) => ({ ...prev, firstName: true }));
    setDraft((prev) => ({ ...prev, firstName: value }));
  };

  const setLastName = (value: string) => {
    setTouched((prev) => ({ ...prev, lastName: true }));
    setDraft((prev) => ({ ...prev, lastName: value }));
  };

  const setDateOfBirth = (value: string) => {
    setTouched((prev) => ({ ...prev, dateOfBirth: true }));
    setDraft((prev) => ({ ...prev, dateOfBirth: value }));
  };

  const setAboutMe = (value: string) => {
    setTouched((prev) => ({ ...prev, aboutMe: true }));
    setDraft((prev) => ({ ...prev, aboutMe: value }));
  };

  const onCountryChange = (value: CountryValue | null) => {
    setSelectedCountry(value);
    setCountryChanged(true);
    setSelectedCity(null);
  };

  return {
    draft,
    touched,
    selectedCountry,
    selectedCity,
    countryChanged,
    setUserName,
    setFirstName,
    setLastName,
    setDateOfBirth,
    setAboutMe,
    setSelectedCity,
    onCountryChange,
  };
};
