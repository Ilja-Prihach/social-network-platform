import type { Dispatch, RefObject, SetStateAction } from 'react';
import clsx from 'clsx';
import {
  type AspectRatio,
  type FilterId,
  type LocationSuggestion,
  type PhotoItem,
  type Step,
} from '@/features/create-post';
import styles from '../CreatePostFlowWidget.module.scss';
import { CreatePostControlsColumn } from './CreatePostControlsColumn';
import { CreatePostPreviewColumn } from './CreatePostPreviewColumn';

type Props = {
  activeFilter: string;
  activePhoto: PhotoItem;
  activePhotoIndex: number;
  aspectRatio: AspectRatio;
  cropGalleryPage: number;
  cropRatioPanelRef: RefObject<HTMLDivElement | null>;
  cropRatioToggleRef: RefObject<HTMLButtonElement | null>;
  cropGalleryToggleRef: RefObject<HTMLButtonElement | null>;
  cropGalleryWrapRef: RefObject<HTMLDivElement | null>;
  cropZoomPanelRef: RefObject<HTMLDivElement | null>;
  cropZoomToggleRef: RefObject<HTMLButtonElement | null>;
  cropRatio: number | null;
  description: string;
  filterId: FilterId;
  goToPhoto: (index: number) => void;
  isLocationLoading: boolean;
  isUploading: boolean;
  location: string;
  locationSuggestions: LocationSuggestion[];
  locationWrapRef: RefObject<HTMLDivElement | null>;
  onOpenPicker: () => void;
  onRemovePhoto: (photoId: string) => void;
  onSelectPhoto: (photoId: string) => void;
  profileAvatar?: string;
  profileUsername: string;
  photos: PhotoItem[];
  setAspectRatio: (value: AspectRatio) => void;
  setCropGalleryPage: Dispatch<SetStateAction<number>>;
  setDescription: (value: string) => void;
  setFilterId: (value: FilterId) => void;
  setLocation: (value: string) => void;
  setShowCropGallery: Dispatch<SetStateAction<boolean>>;
  setShowLocationSuggestions: (value: boolean) => void;
  setShowMobileRatio: Dispatch<SetStateAction<boolean>>;
  setShowMobileZoom: Dispatch<SetStateAction<boolean>>;
  showCropGallery: boolean;
  showLocationSuggestions: boolean;
  showMobileRatio: boolean;
  showMobileZoom: boolean;
  step: Step;
  zoom: number;
  setZoom: (value: number) => void;
};

export function CreatePostEditorContent({
  activeFilter,
  activePhoto,
  activePhotoIndex,
  aspectRatio,
  cropGalleryPage,
  cropRatioPanelRef,
  cropRatioToggleRef,
  cropGalleryToggleRef,
  cropGalleryWrapRef,
  cropZoomPanelRef,
  cropZoomToggleRef,
  cropRatio,
  description,
  filterId,
  goToPhoto,
  isLocationLoading,
  isUploading,
  location,
  locationSuggestions,
  locationWrapRef,
  onOpenPicker,
  onRemovePhoto,
  onSelectPhoto,
  profileAvatar,
  profileUsername,
  photos,
  setAspectRatio,
  setCropGalleryPage,
  setDescription,
  setFilterId,
  setLocation,
  setShowCropGallery,
  setShowLocationSuggestions,
  setShowMobileRatio,
  setShowMobileZoom,
  showCropGallery,
  showLocationSuggestions,
  showMobileRatio,
  showMobileZoom,
  step,
  zoom,
  setZoom,
}: Props) {
  return (
    <div
      className={clsx(
        styles.content,
        step === 'crop' && styles.content_crop_mobile,
        step === 'filters' && styles.content_filters,
        step === 'publish' && styles.content_publish,
      )}
    >
      <CreatePostPreviewColumn
        activeFilter={activeFilter}
        activePhoto={activePhoto}
        activePhotoIndex={activePhotoIndex}
        aspectRatio={aspectRatio}
        cropGalleryPage={cropGalleryPage}
        cropRatioPanelRef={cropRatioPanelRef}
        cropRatioToggleRef={cropRatioToggleRef}
        cropGalleryToggleRef={cropGalleryToggleRef}
        cropGalleryWrapRef={cropGalleryWrapRef}
        cropZoomPanelRef={cropZoomPanelRef}
        cropZoomToggleRef={cropZoomToggleRef}
        cropRatio={cropRatio}
        goToPhoto={goToPhoto}
        isUploading={isUploading}
        onOpenPicker={onOpenPicker}
        onRemovePhoto={onRemovePhoto}
        onSelectPhoto={onSelectPhoto}
        photos={photos}
        setAspectRatio={setAspectRatio}
        setCropGalleryPage={setCropGalleryPage}
        setShowCropGallery={setShowCropGallery}
        setShowMobileRatio={setShowMobileRatio}
        setShowMobileZoom={setShowMobileZoom}
        showCropGallery={showCropGallery}
        showMobileRatio={showMobileRatio}
        showMobileZoom={showMobileZoom}
        step={step}
        zoom={zoom}
        setZoom={setZoom}
      />

      <CreatePostControlsColumn
        activePhoto={activePhoto}
        aspectRatio={aspectRatio}
        description={description}
        filterId={filterId}
        isLocationLoading={isLocationLoading}
        isUploading={isUploading}
        location={location}
        locationSuggestions={locationSuggestions}
        locationWrapRef={locationWrapRef}
        onOpenPicker={onOpenPicker}
        photosCount={photos.length}
        profileAvatar={profileAvatar}
        profileUsername={profileUsername}
        setAspectRatio={setAspectRatio}
        setDescription={setDescription}
        setFilterId={setFilterId}
        setLocation={setLocation}
        setShowLocationSuggestions={setShowLocationSuggestions}
        showLocationSuggestions={showLocationSuggestions}
        step={step}
        zoom={zoom}
        setZoom={setZoom}
      />
    </div>
  );
}
