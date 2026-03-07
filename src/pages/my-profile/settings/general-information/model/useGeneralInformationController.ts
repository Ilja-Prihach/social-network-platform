import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/features/auth/model/useMe';
import { getMyProfile } from '@/entities/profile';
import type { MyProfile } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { buildLocationOptions, type DictionaryText } from './locationOptions';
import { useGeneralInfoFormState } from './useGeneralInfoFormState';
import { useGeneralInfoDerivedValues } from './useGeneralInfoDerivedValues';
import { useGeneralInfoSave } from './useGeneralInfoSave';
import { useProfileAvatarController } from './useProfileAvatarController';

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
  const dateOfBirthUnder13ErrorText = toText(content.dateOfBirthUnder13Error);
  const privacyPolicyLinkLabel = toText(content.privacyPolicyLinkLabel);
  const dateOfBirthUnder13AlertText = `${dateOfBirthUnder13ErrorText} ${privacyPolicyLinkLabel}`;
  const {
    selectedCountryValue,
    cityOptions: city_options,
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
  } = useGeneralInfoDerivedValues({
    formState,
    profileData,
    meUserName: me?.userName,
    countryOptions: country_options,
    cityOptionsByCountry: city_options_by_country,
    dateOfBirthUnder13ErrorText,
  });

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
  const { onSave, isUpdatePending } = useGeneralInfoSave({
    userId: me?.userId,
    invalidateProfileQueries,
    setDateOfBirthAgeError,
    messages: {
      success: toText(content.profileUpdatedSuccess),
      dateOfBirthFormatError: toText(content.dateOfBirthFormatError),
      dateOfBirthUnder13Error: dateOfBirthUnder13AlertText,
      errorServerUnavailable: toText(content.profileUpdateServerUnavailable),
    },
    values: {
      dateOfBirthValidation,
      countryOptions: country_options,
      cityOptions: city_options,
      selectedCountryValue,
      selectedCityValue,
      userName: userNameValue,
      firstName: firstNameValue,
      lastName: lastNameValue,
      aboutMe: aboutMeValue,
      region: profileData?.region,
    },
  });

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
    privacyPolicyLinkLabel,
    isSaveDisabledByValidation,
    isUpdatePending,
  };
};
