import { useState } from 'react';
import type { CityValue, CountryValue } from './locationOptions';

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
  const [selectedCity, setSelectedCity] = useState<CityValue | null>(null);
  const [countryChanged, setCountryChanged] = useState(false);

  const setField = <TField extends keyof FormDraft>(field: TField, value: FormDraft[TField]) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const setUserName = (value: string) => setField('userName', value);
  const setFirstName = (value: string) => setField('firstName', value);
  const setLastName = (value: string) => setField('lastName', value);
  const setDateOfBirth = (value: string) => setField('dateOfBirth', value);
  const setAboutMe = (value: string) => setField('aboutMe', value);

  const onCountryChange = (value: CountryValue | null) => {
    setSelectedCountry(value);
    setCountryChanged(true);
    setSelectedCity(null);
  };

  const onCityChange = (value: CityValue | null) => {
    setSelectedCity(value);
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
    onCityChange,
    onCountryChange,
  };
};
