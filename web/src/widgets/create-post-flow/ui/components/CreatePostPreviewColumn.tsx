import type { Dispatch, RefObject, SetStateAction } from 'react';
import clsx from 'clsx';
import { type AspectRatio, type PhotoItem, type Step } from '@/features/create-post';
import { CreatePostCropOverlays } from '@/features/create-post/crop';
import { Icon } from '@/shared/ui/Icon';
import styles from '../CreatePostFlowWidget.module.scss';

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
  goToPhoto: (index: number) => void;
  isUploading: boolean;
  onOpenPicker: () => void;
  onRemovePhoto: (photoId: string) => void;
  onSelectPhoto: (photoId: string) => void;
  photos: PhotoItem[];
  setAspectRatio: (value: AspectRatio) => void;
  setCropGalleryPage: Dispatch<SetStateAction<number>>;
  setShowCropGallery: Dispatch<SetStateAction<boolean>>;
  setShowMobileRatio: Dispatch<SetStateAction<boolean>>;
  setShowMobileZoom: Dispatch<SetStateAction<boolean>>;
  showCropGallery: boolean;
  showMobileRatio: boolean;
  showMobileZoom: boolean;
  step: Step;
  zoom: number;
  setZoom: (value: number) => void;
};

export function CreatePostPreviewColumn({
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
  goToPhoto,
  isUploading,
  onOpenPicker,
  onRemovePhoto,
  onSelectPhoto,
  photos,
  setAspectRatio,
  setCropGalleryPage,
  setShowCropGallery,
  setShowMobileRatio,
  setShowMobileZoom,
  showCropGallery,
  showMobileRatio,
  showMobileZoom,
  step,
  zoom,
  setZoom,
}: Props) {
  return (
    <div
      className={clsx(
        styles.preview_column,
        step === 'crop' && styles.preview_column_crop_mobile,
        step === 'filters' && styles.preview_column_filters,
        step === 'publish' && styles.preview_column_publish,
      )}
    >
      <div
        className={clsx(
          styles.preview,
          step === 'crop' && styles.preview_crop_mobile,
          step === 'filters' && styles.preview_filters,
          step === 'publish' && styles.preview_publish,
        )}
        style={
          step === 'crop' || step === 'filters' || !cropRatio
            ? undefined
            : { aspectRatio: cropRatio }
        }
      >
        <div
          className={styles.crop_stage}
          style={step === 'crop' && cropRatio ? { aspectRatio: cropRatio } : undefined}
          data-original={step === 'crop' && cropRatio ? 'false' : 'true'}
        >
          <img
            src={activePhoto.preview_url}
            alt={activePhoto.name}
            style={{
              transform: `scale(${zoom})`,
              filter: activeFilter,
            }}
          />
        </div>
      </div>

      <div
        className={clsx(
          styles.thumbs,
          (step === 'crop' || step === 'filters' || step === 'publish') &&
            styles.thumbs_crop_mobile,
        )}
      >
        {photos.map((photo) => (
          <button
            type="button"
            key={photo.id}
            className={styles.thumb_btn}
            data-active={photo.id === activePhoto.id}
            onClick={() => onSelectPhoto(photo.id)}
          >
            <img src={photo.preview_url} alt={photo.name} />
          </button>
        ))}
      </div>

      {step === 'crop' && (
        <CreatePostCropOverlays
          activePhoto={activePhoto}
          aspectRatio={aspectRatio}
          cropGalleryPage={cropGalleryPage}
          cropRatioPanelRef={cropRatioPanelRef}
          cropRatioToggleRef={cropRatioToggleRef}
          cropGalleryToggleRef={cropGalleryToggleRef}
          cropGalleryWrapRef={cropGalleryWrapRef}
          cropZoomPanelRef={cropZoomPanelRef}
          cropZoomToggleRef={cropZoomToggleRef}
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
          setZoom={setZoom}
          showCropGallery={showCropGallery}
          showMobileRatio={showMobileRatio}
          showMobileZoom={showMobileZoom}
          styles={styles}
          zoom={zoom}
        />
      )}

      {(step === 'filters' || step === 'publish') && (
        <>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className={styles.filter_preview_nav}
                data-side="left"
                onClick={() => goToPhoto(activePhotoIndex - 1)}
              >
                <Icon iconId="arrow-ios-back-outline" />
              </button>
              <button
                type="button"
                className={styles.filter_preview_nav}
                data-side="right"
                onClick={() => goToPhoto(activePhotoIndex + 1)}
              >
                <Icon iconId="arrow-ios-forward-outline" />
              </button>
            </>
          )}
          {photos.length > 1 && (
            <div className={styles.filter_preview_dots}>
              {photos.map((photo) => (
                <span
                  key={`filter-dot-${photo.id}`}
                  className={styles.filter_preview_dot}
                  data-active={photo.id === activePhoto.id ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
