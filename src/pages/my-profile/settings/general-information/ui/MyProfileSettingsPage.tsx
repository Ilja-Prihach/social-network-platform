'use client';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { useDictionary } from 'next-intlayer';
import generalInformationContent from '../general-information.content';
import styles from './MyProfileSettingsPage.module.scss';

type DictionaryText = string | { value: string };
const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);

export function MyProfileSettingsPage() {
  const content = useDictionary(generalInformationContent);

  const country_options = [
    { value: 'usa', title: toText(content.countryUsa) },
    { value: 'poland', title: toText(content.countryPoland) },
    { value: 'germany', title: toText(content.countryGermany) },
  ];

  const city_options = [
    { value: 'new-york', title: toText(content.cityNewYork) },
    { value: 'warsaw', title: toText(content.cityWarsaw) },
    { value: 'berlin', title: toText(content.cityBerlin) },
  ];

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
            />
            <Select
              className={styles.select_field}
              label={toText(content.cityLabel)}
              placeholder={toText(content.cityPlaceholder)}
              options={city_options}
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
