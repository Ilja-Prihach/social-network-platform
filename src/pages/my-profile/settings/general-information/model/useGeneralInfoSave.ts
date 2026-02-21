import type { Dispatch, SetStateAction } from 'react';
import { showAlert } from '@/shared/ui/Alert';
import { getOptionTitleByValue } from './profileLocationMapping';
import type { DateOfBirthValidationResult } from './useDateOfBirthValidation';
import { useProfileUpdateMutation } from './useProfileUpdateMutation';
import type { CityValue, CountryValue, SelectOption } from './locationOptions';

type UseGeneralInfoSaveParams = {
  userId?: number;
  invalidateProfileQueries: (userId?: number) => Promise<void>;
  setDateOfBirthAgeError: Dispatch<SetStateAction<string | null>>;
  messages: {
    success: string;
    dateOfBirthFormatError: string;
    dateOfBirthUnder13Error: string;
  };
  values: {
    dateOfBirthValidation: DateOfBirthValidationResult;
    countryOptions: SelectOption<CountryValue>[];
    cityOptions: SelectOption<CityValue>[];
    selectedCountryValue: CountryValue | null;
    selectedCityValue: CityValue | null;
    userName: string;
    firstName: string;
    lastName: string;
    aboutMe: string;
    region?: string;
  };
};

export const useGeneralInfoSave = ({
  userId,
  invalidateProfileQueries,
  setDateOfBirthAgeError,
  messages,
  values,
}: UseGeneralInfoSaveParams) => {
  const updateMutation = useProfileUpdateMutation({
    userId,
    invalidateProfileQueries,
    successMessage: messages.success,
  });

  const onSave = () => {
    if (values.dateOfBirthValidation.status === 'invalid_format') {
      showAlert(messages.dateOfBirthFormatError, 'error');
      return;
    }

    if (values.dateOfBirthValidation.status === 'under_13') {
      showAlert(messages.dateOfBirthUnder13Error, 'error');
      setDateOfBirthAgeError(messages.dateOfBirthUnder13Error);
      return;
    }

    const countryTitle = getOptionTitleByValue(values.countryOptions, values.selectedCountryValue);
    const cityTitle = getOptionTitleByValue(values.cityOptions, values.selectedCityValue);

    updateMutation.mutate({
      userName: values.userName.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      city: cityTitle,
      country: countryTitle,
      region: values.region ?? '',
      dateOfBirth: values.dateOfBirthValidation.parsedDateIso ?? undefined,
      aboutMe: values.aboutMe.trim(),
    });
  };

  return {
    onSave,
    isUpdatePending: updateMutation.isPending,
  };
};
