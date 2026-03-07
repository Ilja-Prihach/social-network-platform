'use client';

import Link from 'next/link';
import { getLocalizedUrl } from 'intlayer';
import { useLocale } from 'next-intlayer';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { useDictionary } from 'next-intlayer';
import generalInformationContent from '../general-information.content';
import { type CityValue, type CountryValue, type DictionaryText } from '../model/locationOptions';
import { useGeneralInformationController } from '../model/useGeneralInformationController';
import { AvatarSection } from './avatar/AvatarSection';
import { AvatarUploadModal } from './avatar/AvatarUploadModal';
import { DateOfBirthField } from './date-of-birth/DateOfBirthField';
import styles from './MyProfileSettingsPage.module.scss';

const toText = (value: DictionaryText): string => (typeof value === 'string' ? value : value.value);

export function MyProfileSettingsPage() {
  const content = useDictionary(generalInformationContent);
  const { locale } = useLocale();
  const controller = useGeneralInformationController(content);
  const privacyPolicyHref = getLocalizedUrl('/privacy-policy', locale);
  const dateOfBirthError = controller.dateOfBirthAgeError ? (
    <>
      {controller.dateOfBirthAgeError}{' '}
      <Link
        className={styles.privacy_policy_link}
        href={privacyPolicyHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {controller.privacyPolicyLinkLabel}
      </Link>
    </>
  ) : undefined;

  return (
    <>
      <div className={styles.content_layout}>
        <AvatarSection
          avatarUrl={controller.avatarController.avatarUrl}
          fileInputRef={controller.avatarController.fileInputRef}
          isAvatarUploadPending={controller.avatarController.isAvatarUploadPending}
          isAvatarDeletePending={controller.avatarController.isAvatarDeletePending}
          selectPhotoText={toText(content.selectProfilePhoto)}
          onPhotoChange={controller.avatarController.onPhotoChange}
          onSelectPhotoClick={controller.avatarController.onSelectPhotoClick}
          onDeleteAvatar={controller.avatarController.onDeleteAvatar}
        />

        <div className={styles.form_grid}>
          <Input
            label={toText(content.usernameLabel)}
            value={controller.userNameValue}
            onChange={controller.formState.setUserName}
            placeholder={toText(content.usernameValue)}
          />
          <Input
            label={toText(content.firstNameLabel)}
            value={controller.firstNameValue}
            onChange={controller.formState.setFirstName}
            placeholder={toText(content.firstNamePlaceholder)}
          />
          <Input
            label={toText(content.lastNameLabel)}
            value={controller.lastNameValue}
            onChange={controller.formState.setLastName}
            placeholder={toText(content.lastNamePlaceholder)}
          />
          <DateOfBirthField
            label={toText(content.dateOfBirthLabel)}
            value={controller.dateOfBirthValue}
            onChange={controller.formState.setDateOfBirth}
            placeholder={toText(content.dateOfBirthPlaceholder)}
            error={dateOfBirthError}
          />

          <div className={styles.selects_row}>
            <Select<CountryValue>
              className={styles.select_field}
              label={toText(content.countryLabel)}
              placeholder={toText(content.countryPlaceholder)}
              options={controller.country_options}
              value={controller.selectedCountryValue}
              onChange={controller.formState.onCountryChange}
            />
            <Select<CityValue>
              className={styles.select_field}
              label={toText(content.cityLabel)}
              placeholder={
                controller.selectedCountryValue
                  ? toText(content.cityPlaceholder)
                  : toText(content.cityPlaceholderSelectCountryFirst)
              }
              options={controller.city_options}
              value={controller.selectedCityValue}
              onChange={controller.formState.onCityChange}
              disabled={!controller.selectedCountryValue}
            />
          </div>

          <Textarea
            id="about_me"
            label={toText(content.aboutMeLabel)}
            placeholder={toText(content.aboutMePlaceholder)}
            rows={3}
            value={controller.aboutMeValue}
            onChange={(event) => controller.formState.setAboutMe(event.target.value)}
            maxLength={200}
          />
        </div>
      </div>

      <div className={styles.actions_row}>
        <Button
          type="button"
          className={styles.save_button}
          onClick={controller.onSave}
          disabled={
            controller.isUpdatePending ||
            controller.myProfileQuery.isPending ||
            controller.isSaveDisabledByValidation
          }
        >
          {toText(content.saveChanges)}
        </Button>
      </div>

      <AvatarUploadModal
        isOpen={controller.avatarController.isAvatarModalOpen}
        title={toText(content.avatarAddModalTitle)}
        saveButtonText={toText(content.avatarSaveButton)}
        modalPreviewUrl={controller.avatarController.modalPreviewUrl}
        avatarModalError={controller.avatarController.avatarModalError}
        isAvatarUploadPending={controller.avatarController.isAvatarUploadPending}
        closeButtonAriaLabel={toText(content.avatarModalCloseAriaLabel)}
        previewAriaLabel={toText(content.avatarModalPreviewAriaLabel)}
        onCloseAvatarModal={controller.avatarController.onCloseAvatarModal}
        onSaveAvatar={controller.avatarController.onSaveAvatar}
      />
    </>
  );
}
