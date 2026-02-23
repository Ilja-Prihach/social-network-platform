import type { LocationSuggestion } from '@/features/create-post';
import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Icon } from '@/shared/ui/Icon';
import type { RefObject } from 'react';
import { useDictionary } from 'next-intlayer';
import createPostFlowContent from '@/features/create-post/model/create-post-flow.content';

type Props = {
  description: string;
  isLocationLoading: boolean;
  location: string;
  locationSuggestions: LocationSuggestion[];
  locationWrapRef: RefObject<HTMLDivElement | null>;
  profileUsername: string;
  setDescription: (value: string) => void;
  setLocation: (value: string) => void;
  setShowLocationSuggestions: (value: boolean) => void;
  showLocationSuggestions: boolean;
  styles: CreatePostStyles;
};

export function CreatePostPublishPanel({
  description,
  isLocationLoading,
  location,
  locationSuggestions,
  locationWrapRef,
  profileUsername,
  setDescription,
  setLocation,
  setShowLocationSuggestions,
  showLocationSuggestions,
  styles,
}: Props) {
  const dictionary = useDictionary(createPostFlowContent);

  return (
    <div className={styles.publish_panel}>
      <div className={styles.publish_profile}>
        <span className={styles.publish_avatar}>
          <img src="/mock/Avatar1.jpg" alt={`${profileUsername} ${dictionary.avatar.value}`} />
        </span>
        <span className={styles.publish_username}>{profileUsername}</span>
      </div>

      <label className={styles.publish_label} htmlFor="publish_description">
        {dictionary.addPublicationDescriptions}
      </label>
      <div className={styles.publish_textarea_wrap}>
        <textarea
          id="publish_description"
          className={styles.publish_textarea}
          placeholder={dictionary.descriptionPlaceholder.value}
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <span className={styles.publish_counter}>{description.length}/500</span>
      </div>

      <div className={styles.publish_location_block} ref={locationWrapRef}>
        <label className={styles.publish_label} htmlFor="publish_location">
          {dictionary.addLocation}
        </label>
        <div className={styles.publish_location_input_wrap}>
          <input
            id="publish_location"
            className={styles.publish_location_input}
            value={location}
            placeholder={dictionary.locationPlaceholder.value}
            onFocus={() => setShowLocationSuggestions(true)}
            onChange={(event) => {
              setLocation(event.target.value);
              setShowLocationSuggestions(true);
            }}
          />
          <button
            type="button"
            className={styles.publish_location_pin}
            aria-label={dictionary.pickLocation.value}
          >
            <Icon iconId="pin-outline" />
          </button>
        </div>

        {showLocationSuggestions && (
          <div className={styles.publish_location_suggestions}>
            {isLocationLoading && (
              <div className={styles.publish_location_empty}>{dictionary.searching}</div>
            )}

            {!isLocationLoading &&
              locationSuggestions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={styles.publish_location_item}
                  onClick={() => {
                    setLocation(item.city);
                    setShowLocationSuggestions(false);
                  }}
                >
                  <span className={styles.publish_location_city}>{item.city}</span>
                  <span className={styles.publish_location_place}>{item.description}</span>
                </button>
              ))}

            {!isLocationLoading &&
              location.trim().length >= 2 &&
              locationSuggestions.length === 0 && (
                <div className={styles.publish_location_empty}>{dictionary.noLocationsFound}</div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
