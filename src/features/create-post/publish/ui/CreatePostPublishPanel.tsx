import type { LocationSuggestion } from '@/features/create-post';
import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Icon } from '@/shared/ui/Icon';
import type { RefObject } from 'react';

type Props = {
  description: string;
  isLocationLoading: boolean;
  location: string;
  locationSuggestions: LocationSuggestion[];
  locationWrapRef: RefObject<HTMLDivElement | null>;
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
  setDescription,
  setLocation,
  setShowLocationSuggestions,
  showLocationSuggestions,
  styles,
}: Props) {
  return (
    <div className={styles.publish_panel}>
      <div className={styles.publish_profile}>
        <span className={styles.publish_avatar}>
          <img src="/mock/Avatar1.jpg" alt="URLProfile avatar" />
        </span>
        <span className={styles.publish_username}>URLProfile</span>
      </div>

      <label className={styles.publish_label} htmlFor="publish_description">
        Add publication descriptions
      </label>
      <div className={styles.publish_textarea_wrap}>
        <textarea
          id="publish_description"
          className={styles.publish_textarea}
          placeholder="Text-area"
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <span className={styles.publish_counter}>{description.length}/500</span>
      </div>

      <div className={styles.publish_location_block} ref={locationWrapRef}>
        <label className={styles.publish_label} htmlFor="publish_location">
          Add location
        </label>
        <div className={styles.publish_location_input_wrap}>
          <input
            id="publish_location"
            className={styles.publish_location_input}
            value={location}
            placeholder="New York"
            onFocus={() => setShowLocationSuggestions(true)}
            onChange={(event) => {
              setLocation(event.target.value);
              setShowLocationSuggestions(true);
            }}
          />
          <button type="button" className={styles.publish_location_pin} aria-label="Pick location">
            <Icon iconId="pin-outline" />
          </button>
        </div>

        {showLocationSuggestions && (
          <div className={styles.publish_location_suggestions}>
            {isLocationLoading && <div className={styles.publish_location_empty}>Searching...</div>}

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
                <div className={styles.publish_location_empty}>No locations found</div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
