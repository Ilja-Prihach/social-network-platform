import type { RefObject } from 'react';
import clsx from 'clsx';
import {
  type AspectRatio,
  type FilterId,
  type LocationSuggestion,
  type PhotoItem,
  type Step,
} from '@/features/create-post';
import { CreatePostCropControls } from '@/features/create-post/crop';
import { CreatePostFiltersPanel } from '@/features/create-post/filters';
import { CreatePostPublishPanel } from '@/features/create-post/publish';
import styles from '../CreatePostFlowWidget.module.scss';

type Props = {
  activePhoto: PhotoItem;
  aspectRatio: AspectRatio;
  description: string;
  filterId: FilterId;
  isLocationLoading: boolean;
  isUploading: boolean;
  location: string;
  locationSuggestions: LocationSuggestion[];
  locationWrapRef: RefObject<HTMLDivElement | null>;
  onOpenPicker: () => void;
  setAspectRatio: (value: AspectRatio) => void;
  setDescription: (value: string) => void;
  setFilterId: (value: FilterId) => void;
  setLocation: (value: string) => void;
  setShowLocationSuggestions: (value: boolean) => void;
  showLocationSuggestions: boolean;
  step: Step;
  zoom: number;
  setZoom: (value: number) => void;
  photosCount: number;
};

export function CreatePostControlsColumn({
  activePhoto,
  aspectRatio,
  description,
  filterId,
  isLocationLoading,
  isUploading,
  location,
  locationSuggestions,
  locationWrapRef,
  onOpenPicker,
  photosCount,
  setAspectRatio,
  setDescription,
  setFilterId,
  setLocation,
  setShowLocationSuggestions,
  showLocationSuggestions,
  step,
  zoom,
  setZoom,
}: Props) {
  return (
    <div className={clsx(styles.controls_column, step === 'crop' && styles.controls_column_hidden)}>
      {step === 'crop' && (
        <CreatePostCropControls
          aspectRatio={aspectRatio}
          isUploading={isUploading}
          onOpenPicker={onOpenPicker}
          photosCount={photosCount}
          setAspectRatio={setAspectRatio}
          setZoom={setZoom}
          styles={styles}
          zoom={zoom}
        />
      )}

      {step === 'filters' && (
        <CreatePostFiltersPanel
          activePhoto={activePhoto}
          filterId={filterId}
          setFilterId={setFilterId}
          styles={styles}
        />
      )}

      {step === 'publish' && (
        <CreatePostPublishPanel
          description={description}
          isLocationLoading={isLocationLoading}
          location={location}
          locationSuggestions={locationSuggestions}
          locationWrapRef={locationWrapRef}
          setDescription={setDescription}
          setLocation={setLocation}
          setShowLocationSuggestions={setShowLocationSuggestions}
          showLocationSuggestions={showLocationSuggestions}
          styles={styles}
        />
      )}
    </div>
  );
}
