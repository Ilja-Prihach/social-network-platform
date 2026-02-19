'use client';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select/Select';
import { Textarea } from '@/shared/ui/Textarea';
import styles from './MyProfileSettingsPage.module.scss';

const country_options = [
  { value: 'usa', title: 'Country' },
  { value: 'poland', title: 'Poland' },
  { value: 'germany', title: 'Germany' },
];

const city_options = [
  { value: 'new-york', title: 'City' },
  { value: 'warsaw', title: 'Warsaw' },
  { value: 'berlin', title: 'Berlin' },
];

export function MyProfileSettingsPage() {
  return (
    <>
      <div className={styles.content_layout}>
        <div className={styles.avatar_col}>
          <div className={styles.avatar_placeholder} aria-hidden="true" />
          <Button type="button" variant="outline" className={styles.photo_button}>
            Select Profile Photo
          </Button>
        </div>

        <div className={styles.form_grid}>
          <Input label="Username" value="Usertest" />
          <Input label="First Name*" placeholder="First name" />
          <Input label="Last Name*" placeholder="Last name" />
          <Input label="Date of birth" placeholder="00.00.0000" />

          <div className={styles.selects_row}>
            <Select
              className={styles.select_field}
              label="Select your country"
              placeholder="Country"
              options={country_options}
            />
            <Select
              className={styles.select_field}
              label="Select your city"
              placeholder="City"
              options={city_options}
            />
          </div>

          <Textarea label="About Me" placeholder="Tell us about yourself" rows={3} />
        </div>
      </div>

      <div className={styles.actions_row}>
        <Button type="button" className={styles.save_button} disabled>
          Save Changes
        </Button>
      </div>
    </>
  );
}
