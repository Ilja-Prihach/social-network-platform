import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/features/auth/model/useMe';
import { getMyProfile } from '@/entities/profile';
import type { MyProfile } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
import { buildLocationOptions, type DictionaryText } from './locationOptions';
import {
  getOptionTitleByValue,
  resolveFallbackCity,
  resolveFallbackCountry,
} from './profileLocationMapping';
import { useGeneralInfoFormState } from './useGeneralInfoFormState';
import { formatDateOfBirth, useDateOfBirthValidation } from './useDateOfBirthValidation';
import { useProfileAvatarController } from './useProfileAvatarController';
import { useProfileUpdateMutation } from './useProfileUpdateMutation';

const myProfileQueryKey = ['my-profile-settings'] as const;

const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);

export const useGeneralInformationController = (content: Record<string, DictionaryText>) => {
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const formState = useGeneralInfoFormState();

  const { countryOptions: country_options, cityOptionsByCountry: city_options_by_country } =
    useMemo(() => buildLocationOptions(content), [content]);

  const myProfileQuery = useQuery<MyProfile, ApiError>({
    queryKey: myProfileQueryKey,
    queryFn: getMyProfile,
    retry: false,
  });

  const profileData = myProfileQuery.data;
  const fallbackCountry = useMemo(
    () => resolveFallbackCountry(country_options, profileData?.country),
    [country_options, profileData?.country],
  );

  const selectedCountryValue = formState.selectedCountry ?? fallbackCountry;
  const city_options = useMemo(
    () => (selectedCountryValue ? city_options_by_country[selectedCountryValue] : []),
    [city_options_by_country, selectedCountryValue],
  );
  const fallbackCity = useMemo(() => {
    if (!selectedCountryValue) return null;
    return resolveFallbackCity(city_options, profileData?.city);
  }, [city_options, profileData?.city, selectedCountryValue]);

  const selectedCityValue = formState.countryChanged
    ? formState.selectedCity
    : (formState.selectedCity ?? fallbackCity);

  const userNameValue = formState.touched.userName
    ? formState.draft.userName
    : (profileData?.userName ?? me?.userName ?? '');
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

  const dateOfBirthFormatErrorText = toText(content.dateOfBirthFormatError);
  const dateOfBirthUnder13ErrorText = toText(content.dateOfBirthUnder13Error);
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

  const invalidateProfileQueries = async (userId?: number) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: myProfileQueryKey }),
      userId
        ? queryClient.invalidateQueries({ queryKey: ['public-profile', userId] })
        : Promise.resolve(),
    ]);
  };

  const avatarController = useProfileAvatarController({
    profileAvatars: profileData?.avatars,
    userId: me?.userId,
    invalidateProfileQueries,
    texts: {
      uploadSuccess: toText(content.avatarUpdatedSuccess),
      deleteSuccess: toText(content.avatarDeletedSuccess),
      deleteFailed: toText(content.avatarDeleteFailed),
      uploadFormatError: toText(content.avatarUploadFormatError),
      uploadSizeError: toText(content.avatarUploadSizeError),
      deleteModalTitle: toText(content.avatarDeleteModalTitle),
      deleteModalDescription: toText(content.avatarDeleteModalDescription),
      deleteModalYes: toText(content.avatarDeleteModalYes),
      deleteModalNo: toText(content.avatarDeleteModalNo),
    },
  });
  const updateMutation = useProfileUpdateMutation({
    userId: me?.userId,
    invalidateProfileQueries,
    successMessage: toText(content.profileUpdatedSuccess),
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

    const countryTitle = getOptionTitleByValue(country_options, selectedCountryValue);
    const cityTitle = getOptionTitleByValue(city_options, selectedCityValue);

    updateMutation.mutate({
      userName: userNameValue.trim(),
      firstName: firstNameValue.trim(),
      lastName: lastNameValue.trim(),
      city: cityTitle,
      country: countryTitle,
      region: profileData?.region ?? '',
      dateOfBirth: dateOfBirthValidation.parsedDateIso ?? undefined,
      aboutMe: aboutMeValue.trim(),
    });
  };

  return {
    formState,
    avatarController,
    myProfileQuery,
    onSave,
    country_options,
    city_options,
    selectedCountryValue,
    selectedCityValue,
    userNameValue,
    firstNameValue,
    lastNameValue,
    dateOfBirthValue,
    aboutMeValue,
    dateOfBirthAgeError,
    isSaveDisabledByValidation,
    isUpdatePending: updateMutation.isPending,
  };
};
