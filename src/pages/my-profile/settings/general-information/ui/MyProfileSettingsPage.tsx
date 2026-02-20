'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useMe } from '@/features/auth/model/useMe';
import { updateProfile } from '@/entities/profile';
import type { UpdateProfileRequest } from '@/entities/profile';
import type { ApiError } from '@/shared/api/types';
import { showAlert } from '@/shared/ui/Alert';
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
import styles from './MyProfileSettingsPage.module.scss';

const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);

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

export function MyProfileSettingsPage() {
  const content = useDictionary(generalInformationContent);
  const { data: me } = useMe();
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryValue | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState('');

  const { countryOptions: country_options, cityOptionsByCountry: city_options_by_country } =
    useMemo(() => buildLocationOptions(content), [content]);

  const city_options = selectedCountry ? city_options_by_country[selectedCountry] : [];

  const userNameValue = userName || me?.userName || '';

  const updateMutation = useMutation<
    void,
    ApiError<ProfileUpdateErrorResponse>,
    UpdateProfileRequest
  >({
    mutationFn: updateProfile,
    onSuccess: () => {
      showAlert('Profile updated successfully', 'success');
    },
    onError: (error) => {
      showAlert(getProfileUpdateError(error), 'error');
    },
  });

  const onSave = () => {
    const parsedDateOfBirth = parseDateOfBirth(dateOfBirth);

    if (parsedDateOfBirth === 'invalid') {
      showAlert('Date of birth must be in format DD.MM.YYYY or YYYY-MM-DD', 'error');
      return;
    }

    const countryTitle =
      country_options.find((option) => option.value === selectedCountry)?.title ?? '';
    const cityTitle = city_options.find((option) => option.value === selectedCity)?.title ?? '';

    updateMutation.mutate({
      userName: userNameValue.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      city: cityTitle,
      country: countryTitle,
      region: '',
      dateOfBirth: parsedDateOfBirth ?? undefined,
      aboutMe: aboutMe.trim(),
    });
  };

  return (
    <>
      <div className={styles.content_layout}>
        <div className={styles.avatar_col}>
          <div className={styles.avatar_placeholder} aria-hidden="true" />
          <Button type="button" variant="outline" className={styles.photo_button}>
            {toText(content.selectProfilePhoto)}
          </Button>
        </div>

        <div className={styles.form_grid}>
          <Input
            label={toText(content.usernameLabel)}
            value={userNameValue}
            onChange={setUserName}
            placeholder={toText(content.usernameValue)}
          />
          <Input
            label={toText(content.firstNameLabel)}
            value={firstName}
            onChange={setFirstName}
            placeholder={toText(content.firstNamePlaceholder)}
          />
          <Input
            label={toText(content.lastNameLabel)}
            value={lastName}
            onChange={setLastName}
            placeholder={toText(content.lastNamePlaceholder)}
          />
          <Input
            label={toText(content.dateOfBirthLabel)}
            value={dateOfBirth}
            onChange={setDateOfBirth}
            placeholder={toText(content.dateOfBirthPlaceholder)}
          />

          <div className={styles.selects_row}>
            <Select
              className={styles.select_field}
              label={toText(content.countryLabel)}
              placeholder={toText(content.countryPlaceholder)}
              options={country_options}
              value={selectedCountry}
              onChange={(value) => {
                setSelectedCountry(value as CountryValue);
                setSelectedCity(null);
              }}
            />
            <Select
              className={styles.select_field}
              label={toText(content.cityLabel)}
              placeholder={
                selectedCountry
                  ? toText(content.cityPlaceholder)
                  : toText(content.cityPlaceholderSelectCountryFirst)
              }
              options={city_options}
              value={selectedCity}
              onChange={setSelectedCity}
              disabled={!selectedCountry}
            />
          </div>

          <Textarea
            label={toText(content.aboutMeLabel)}
            placeholder={toText(content.aboutMePlaceholder)}
            rows={3}
            value={aboutMe}
            onChange={(event) => setAboutMe(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions_row}>
        <Button
          type="button"
          className={styles.save_button}
          onClick={onSave}
          disabled={updateMutation.isPending}
        >
          {toText(content.saveChanges)}
        </Button>
      </div>
    </>
  );
}
