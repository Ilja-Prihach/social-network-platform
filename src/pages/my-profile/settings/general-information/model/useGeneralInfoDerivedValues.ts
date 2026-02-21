import { useMemo } from 'react';
import type { MyProfile } from '@/entities/profile';
import { type CityValue, type CountryValue, type SelectOption } from './locationOptions';
import { resolveFallbackCity, resolveFallbackCountry } from './profileLocationMapping';
import { formatDateOfBirth, useDateOfBirthValidation } from './useDateOfBirthValidation';
import type { GeneralInfoFormState } from './useGeneralInfoFormState';

type UseGeneralInfoDerivedValuesParams = {
  formState: GeneralInfoFormState;
  profileData?: MyProfile;
  meUserName?: string;
  countryOptions: SelectOption<CountryValue>[];
  cityOptionsByCountry: Record<CountryValue, SelectOption<CityValue>[]>;
  dateOfBirthUnder13ErrorText: string;
};

export const useGeneralInfoDerivedValues = ({
  formState,
  profileData,
  meUserName,
  countryOptions,
  cityOptionsByCountry,
  dateOfBirthUnder13ErrorText,
}: UseGeneralInfoDerivedValuesParams) => {
  const fallbackCountry = useMemo(
    () => resolveFallbackCountry(countryOptions, profileData?.country),
    [countryOptions, profileData?.country],
  );

  const selectedCountryValue = formState.selectedCountry ?? fallbackCountry;
  const cityOptions = useMemo(
    () => (selectedCountryValue ? cityOptionsByCountry[selectedCountryValue] : []),
    [cityOptionsByCountry, selectedCountryValue],
  );
  const fallbackCity = useMemo(() => {
    if (!selectedCountryValue) return null;
    return resolveFallbackCity(cityOptions, profileData?.city);
  }, [cityOptions, profileData?.city, selectedCountryValue]);

  const selectedCityValue = formState.countryChanged
    ? formState.selectedCity
    : (formState.selectedCity ?? fallbackCity);

  const userNameValue = formState.touched.userName
    ? formState.draft.userName
    : (profileData?.userName ?? meUserName ?? '');
  const firstNameValue = formState.touched.firstName
    ? formState.draft.firstName
    : (profileData?.firstName ?? '');
  const lastNameValue = formState.touched.lastName
    ? formState.draft.lastName
    : (profileData?.lastName ?? '');
  const aboutMeValue = formState.touched.aboutMe
    ? formState.draft.aboutMe
    : (profileData?.aboutMe ?? '');
  const dateOfBirthValue = formState.touched.dateOfBirth
    ? formState.draft.dateOfBirth
    : formatDateOfBirth(profileData?.dateOfBirth);

  const {
    dateOfBirthValidation,
    isDateOfBirthMissing,
    isDateOfBirthInvalid,
    dateOfBirthAgeError,
    setDateOfBirthAgeError,
  } = useDateOfBirthValidation({
    dateOfBirthValue,
    draftDateOfBirth: formState.draft.dateOfBirth,
    isDateOfBirthTouched: formState.touched.dateOfBirth,
    under13ErrorText: dateOfBirthUnder13ErrorText,
  });

  const isRequiredFieldsMissing =
    !userNameValue.trim() ||
    !firstNameValue.trim() ||
    !lastNameValue.trim() ||
    isDateOfBirthMissing;
  const isSaveDisabledByValidation = isRequiredFieldsMissing || isDateOfBirthInvalid;

  return {
    selectedCountryValue,
    cityOptions,
    selectedCityValue,
    userNameValue,
    firstNameValue,
    lastNameValue,
    aboutMeValue,
    dateOfBirthValue,
    dateOfBirthValidation,
    dateOfBirthAgeError,
    setDateOfBirthAgeError,
    isSaveDisabledByValidation,
  };
};
