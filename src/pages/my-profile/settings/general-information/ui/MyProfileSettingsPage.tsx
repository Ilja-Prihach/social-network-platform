'use client';

import { useMemo, useState } from 'react';
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

export function MyProfileSettingsPage() {
  const content = useDictionary(generalInformationContent);
  const [selectedCountry, setSelectedCountry] = useState<CountryValue | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const { countryOptions: country_options, cityOptionsByCountry: city_options_by_country } =
    useMemo(() => buildLocationOptions(content), [content]);

  const city_options = selectedCountry ? city_options_by_country[selectedCountry] : [];

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
          <Input label={toText(content.usernameLabel)} value={toText(content.usernameValue)} />
          <Input
            label={toText(content.firstNameLabel)}
            placeholder={toText(content.firstNamePlaceholder)}
          />
          <Input
            label={toText(content.lastNameLabel)}
            placeholder={toText(content.lastNamePlaceholder)}
          />
          <Input
            label={toText(content.dateOfBirthLabel)}
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
          />
        </div>
      </div>

      <div className={styles.actions_row}>
        <Button type="button" className={styles.save_button} disabled>
          {toText(content.saveChanges)}
        </Button>
      </div>
    </>
  );
}
