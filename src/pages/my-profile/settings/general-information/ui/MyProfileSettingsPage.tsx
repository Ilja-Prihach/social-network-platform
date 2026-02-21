'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/features/auth/model/useMe';
import { getMyProfile, updateProfile } from '@/entities/profile';
import type { MyProfile, UpdateProfileRequest } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { useDictionary } from 'next-intlayer';
import generalInformationContent from '../general-information.content';
import {
  buildLocationOptions,
  type CountryValue,
  type DictionaryText,
} from '../model/locationOptions';
import { useGeneralInfoFormState } from '../model/useGeneralInfoFormState';
import { useProfileAvatarController } from '../model/useProfileAvatarController';
import { AvatarSection } from './AvatarSection';
import { AvatarUploadModal } from './AvatarUploadModal';
import styles from './MyProfileSettingsPage.module.scss';

const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);
const myProfileQueryKey = ['my-profile-settings'] as const;

type ProfileUpdateErrorResponse = {
  messages?: string | { message: string; field: string }[];
};

const getProfileUpdateError = (error: ApiError<ProfileUpdateErrorResponse>) => {
  const messages = error.data?.messages;

  if (typeof messages === 'string') return messages;
  if (Array.isArray(messages) && messages.length && messages[0]?.message) {
    return messages[0].message;
  }

  return 'Failed to update profile';
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

type DateOfBirthValidationStatus = 'valid' | 'invalid_format' | 'under_13' | 'empty';

type DateOfBirthValidationResult = {
  status: DateOfBirthValidationStatus;
  parsedDateIso: string | null;
};

const validateDateOfBirth = (value: string): DateOfBirthValidationResult => {
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

const formatDateOfBirth = (value?: string | null): string => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const year = String(parsed.getUTCFullYear());

  return `${day}.${month}.${year}`;
};

const findOptionValueByTitle = (
  options: Array<{ value: string; title: string }>,
  title?: string,
): string | null => {
  if (!title?.trim()) return null;
  const normalizedTitle = title.trim().toLowerCase();

  return (
    options.find((option) => option.title.trim().toLowerCase() === normalizedTitle)?.value ?? null
  );
};

export function MyProfileSettingsPage() {
  const content = useDictionary(generalInformationContent);
  const router = useRouter();
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const formState = useGeneralInfoFormState();
  const [dateOfBirthAgeError, setDateOfBirthAgeError] = useState<string | null>(null);

  const { countryOptions: country_options, cityOptionsByCountry: city_options_by_country } =
    useMemo(() => buildLocationOptions(content), [content]);

  const myProfileQuery = useQuery<MyProfile, ApiError>({
    queryKey: myProfileQueryKey,
    queryFn: getMyProfile,
    retry: false,
  });

  const profileData = myProfileQuery.data;
  const fallbackCountry = useMemo(
    () => findOptionValueByTitle(country_options, profileData?.country) as CountryValue | null,
    [country_options, profileData?.country],
  );

  const selectedCountryValue = formState.selectedCountry ?? fallbackCountry;
  const city_options = useMemo(
    () => (selectedCountryValue ? city_options_by_country[selectedCountryValue] : []),
    [city_options_by_country, selectedCountryValue],
  );
  const fallbackCity = useMemo(() => {
    if (!selectedCountryValue) return null;
    return findOptionValueByTitle(city_options, profileData?.city);
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
  const dateOfBirthValidation = useMemo(
    () => validateDateOfBirth(dateOfBirthValue),
    [dateOfBirthValue],
  );
  const isDateOfBirthMissing = dateOfBirthValidation.status === 'empty';
  const isDateOfBirthInvalid =
    dateOfBirthValidation.status === 'invalid_format' ||
    dateOfBirthValidation.status === 'under_13';
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
  });

  useEffect(() => {
    if (!formState.touched.dateOfBirth) return;

    const normalized = formState.draft.dateOfBirth.trim();
    const isFullDate =
      /^\d{2}\.\d{2}\.\d{4}$/.test(normalized) || /^\d{4}-\d{2}-\d{2}$/.test(normalized);

    if (!isFullDate) {
      queueMicrotask(() => setDateOfBirthAgeError(null));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const result = validateDateOfBirth(normalized);
      if (result.status === 'under_13') {
        setDateOfBirthAgeError('A user under 13 cannot create a profile. Privacy Policy');
        return;
      }

      setDateOfBirthAgeError(null);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [formState.draft.dateOfBirth, formState.touched.dateOfBirth]);

  const updateMutation = useMutation<
    void,
    ApiError<ProfileUpdateErrorResponse>,
    UpdateProfileRequest
  >({
    mutationFn: updateProfile,
    onSuccess: async () => {
      showAlert('Profile updated successfully', 'success');
      const userId = me?.userId;

      await invalidateProfileQueries(userId);

      if (userId) {
        router.replace(`/profile/${userId}`);
        return;
      }

      router.replace('/my-profile');
    },
    onError: (error) => {
      showAlert(getProfileUpdateError(error), 'error');
    },
  });

  const onSave = () => {
    if (dateOfBirthValidation.status === 'invalid_format') {
      showAlert('Date of birth must be in format DD.MM.YYYY or YYYY-MM-DD', 'error');
      return;
    }

    if (dateOfBirthValidation.status === 'under_13') {
      showAlert('A user under 13 cannot create a profile. Privacy Policy', 'error');
      setDateOfBirthAgeError('A user under 13 cannot create a profile. Privacy Policy');
      return;
    }

    const countryTitle =
      country_options.find((option) => option.value === selectedCountryValue)?.title ?? '';
    const cityTitle =
      city_options.find((option) => option.value === selectedCityValue)?.title ?? '';

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

  return (
    <>
      <div className={styles.content_layout}>
        <AvatarSection
          avatarUrl={avatarController.avatarUrl}
          fileInputRef={avatarController.fileInputRef}
          isAvatarUploadPending={avatarController.isAvatarUploadPending}
          isAvatarDeletePending={avatarController.isAvatarDeletePending}
          selectPhotoText={toText(content.selectProfilePhoto)}
          onPhotoChange={avatarController.onPhotoChange}
          onSelectPhotoClick={avatarController.onSelectPhotoClick}
          onDeleteAvatar={avatarController.onDeleteAvatar}
        />

        <div className={styles.form_grid}>
          <Input
            label={toText(content.usernameLabel)}
            value={userNameValue}
            onChange={formState.setUserName}
            placeholder={toText(content.usernameValue)}
          />
          <Input
            label={toText(content.firstNameLabel)}
            value={firstNameValue}
            onChange={formState.setFirstName}
            placeholder={toText(content.firstNamePlaceholder)}
          />
          <Input
            label={toText(content.lastNameLabel)}
            value={lastNameValue}
            onChange={formState.setLastName}
            placeholder={toText(content.lastNamePlaceholder)}
          />
          <Input
            label={toText(content.dateOfBirthLabel)}
            value={dateOfBirthValue}
            onChange={formState.setDateOfBirth}
            placeholder={toText(content.dateOfBirthPlaceholder)}
            error={dateOfBirthAgeError ?? undefined}
          />

          <div className={styles.selects_row}>
            <Select
              className={styles.select_field}
              label={toText(content.countryLabel)}
              placeholder={toText(content.countryPlaceholder)}
              options={country_options}
              value={selectedCountryValue}
              onChange={(value) => formState.onCountryChange(value as CountryValue)}
            />
            <Select
              className={styles.select_field}
              label={toText(content.cityLabel)}
              placeholder={
                selectedCountryValue
                  ? toText(content.cityPlaceholder)
                  : toText(content.cityPlaceholderSelectCountryFirst)
              }
              options={city_options}
              value={selectedCityValue}
              onChange={formState.setSelectedCity}
              disabled={!selectedCountryValue}
            />
          </div>

          <Textarea
            id="about_me"
            label={toText(content.aboutMeLabel)}
            placeholder={toText(content.aboutMePlaceholder)}
            rows={3}
            value={aboutMeValue}
            onChange={(event) => formState.setAboutMe(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions_row}>
        <Button
          type="button"
          className={styles.save_button}
          onClick={onSave}
          disabled={
            updateMutation.isPending || myProfileQuery.isPending || isSaveDisabledByValidation
          }
        >
          {toText(content.saveChanges)}
        </Button>
      </div>

      <AvatarUploadModal
        isOpen={avatarController.isAvatarModalOpen}
        modalPreviewUrl={avatarController.modalPreviewUrl}
        avatarModalError={avatarController.avatarModalError}
        isAvatarUploadPending={avatarController.isAvatarUploadPending}
        onCloseAvatarModal={avatarController.onCloseAvatarModal}
        onSaveAvatar={avatarController.onSaveAvatar}
      />
    </>
  );
}
