import type { Dispatch, SetStateAction } from 'react';
import { showAlert } from '@/shared/ui/Alert';
import { getOptionTitleByValue } from './profileLocationMapping';
import type { DateOfBirthValidationResult } from './useDateOfBirthValidation';
import { useProfileUpdateMutation } from './useProfileUpdateMutation';
import type { CityValue, CountryValue, SelectOption } from './locationOptions';

type UseGeneralInfoSaveParams = {
  userId?: number;
  invalidateProfileQueries: (userId?: number) => Promise<void>;
  successMessage: string;
  dateOfBirthFormatErrorText: string;
  dateOfBirthUnder13ErrorText: string;
  dateOfBirthValidation: DateOfBirthValidationResult;
  setDateOfBirthAgeError: Dispatch<SetStateAction<string | null>>;
  countryOptions: SelectOption<CountryValue>[];
  cityOptions: SelectOption<CityValue>[];
  selectedCountryValue: CountryValue | null;
  selectedCityValue: CityValue | null;
  userNameValue: string;
  firstNameValue: string;
  lastNameValue: string;
  aboutMeValue: string;
  region?: string;
};

export const useGeneralInfoSave = ({
  userId,
  invalidateProfileQueries,
  successMessage,
  dateOfBirthFormatErrorText,
  dateOfBirthUnder13ErrorText,
  dateOfBirthValidation,
  setDateOfBirthAgeError,
  countryOptions,
  cityOptions,
  selectedCountryValue,
  selectedCityValue,
  userNameValue,
  firstNameValue,
  lastNameValue,
  aboutMeValue,
  region,
}: UseGeneralInfoSaveParams) => {
  const updateMutation = useProfileUpdateMutation({
    userId,
    invalidateProfileQueries,
    successMessage,
  });

  const onSave = () => {
    if (dateOfBirthValidation.status === 'invalid_format') {
      showAlert(dateOfBirthFormatErrorText, 'error');
      return;
    }

    if (dateOfBirthValidation.status === 'under_13') {
      showAlert(dateOfBirthUnder13ErrorText, 'error');
      setDateOfBirthAgeError(dateOfBirthUnder13ErrorText);
      return;
    }

    const countryTitle = getOptionTitleByValue(countryOptions, selectedCountryValue);
    const cityTitle = getOptionTitleByValue(cityOptions, selectedCityValue);

    updateMutation.mutate({
      userName: userNameValue.trim(),
      firstName: firstNameValue.trim(),
      lastName: lastNameValue.trim(),
      city: cityTitle,
      country: countryTitle,
      region: region ?? '',
      dateOfBirth: dateOfBirthValidation.parsedDateIso ?? undefined,
      aboutMe: aboutMeValue.trim(),
    });
  };

  return {
    onSave,
    isUpdatePending: updateMutation.isPending,
  };
};
