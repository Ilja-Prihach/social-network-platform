import type { Dispatch, RefObject, SetStateAction } from 'react';
import { MAX_FILES_COUNT, ratios, type AspectRatio, type PhotoItem } from '@/features/create-post';
import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Icon } from '@/shared/ui/Icon';
import clsx from 'clsx';
import { useDictionary } from 'next-intlayer';
import createPostFlowContent from '@/features/create-post/model/create-post-flow.content';

type Props = {
  activePhoto: PhotoItem;
  aspectRatio: AspectRatio;
  cropGalleryPage: number;
  cropRatioPanelRef: RefObject<HTMLDivElement | null>;
  cropRatioToggleRef: RefObject<HTMLButtonElement | null>;
  cropGalleryToggleRef: RefObject<HTMLButtonElement | null>;
  cropGalleryWrapRef: RefObject<HTMLDivElement | null>;
  cropZoomPanelRef: RefObject<HTMLDivElement | null>;
  cropZoomToggleRef: RefObject<HTMLButtonElement | null>;
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
  setZoom: (value: number) => void;
  showCropGallery: boolean;
  showMobileRatio: boolean;
  showMobileZoom: boolean;
  styles: CreatePostStyles;
  zoom: number;
};

export function CreatePostCropOverlays({
  activePhoto,
  aspectRatio,
  cropGalleryPage,
  cropRatioPanelRef,
  cropRatioToggleRef,
  cropGalleryToggleRef,
  cropGalleryWrapRef,
  cropZoomPanelRef,
  cropZoomToggleRef,
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
  setZoom,
  showCropGallery,
  showMobileRatio,
  showMobileZoom,
  styles,
  zoom,
}: Props) {
  const dictionary = useDictionary(createPostFlowContent);
  const active_photo_index = Math.max(
    0,
    photos.findIndex((photo) => photo.id === activePhoto.id),
  );

  const select_photo_by_index = (index: number) => {
    if (photos.length === 0) return;
    const safe_index = (index + photos.length) % photos.length;
    const next_photo = photos[safe_index];
    if (!next_photo) return;
    setCropGalleryPage(safe_index);
    onSelectPhoto(next_photo.id);
  };

  return (
    <>
      {showMobileRatio && (
        <div
          ref={cropRatioPanelRef}
          className={clsx(styles.crop_mobile_panel, styles.crop_mobile_panel_ratio)}
        >
          <div className={styles.ratio_sheet}>
            {ratios.map((ratio) => (
              <button
                type="button"
                key={ratio}
                className={styles.ratio_sheet_item}
                data-active={aspectRatio === ratio}
                data-ratio={ratio}
                onClick={() => setAspectRatio(ratio)}
              >
                <span>{ratio === 'original' ? dictionary.original : ratio}</span>
                {ratio === 'original' ? (
                  <span className={styles.ratio_sheet_icon_symbol}>
                    <Icon iconId="image-outline" width="24" height="24" />
                  </span>
                ) : (
                  <span className={styles.ratio_sheet_icon} data-ratio={ratio} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {showMobileZoom && (
        <div
          ref={cropZoomPanelRef}
          className={clsx(styles.crop_mobile_panel, styles.crop_mobile_panel_zoom)}
        >
          <input
            id="mobile_zoom"
            className={clsx(styles.zoom_input, styles.zoom_input_crop)}
            type="range"
            min="1"
            max="2.2"
            step="0.05"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className={styles.crop_preview_nav}
            data-side="left"
            onClick={() => select_photo_by_index(active_photo_index - 1)}
            aria-label={dictionary.previousImage.value}
          >
            <Icon iconId="arrow-ios-back-outline" width="24" height="24" />
          </button>
          <button
            type="button"
            className={styles.crop_preview_nav}
            data-side="right"
            onClick={() => select_photo_by_index(active_photo_index + 1)}
            aria-label={dictionary.nextImage.value}
          >
            <Icon iconId="arrow-ios-forward-outline" width="24" height="24" />
          </button>
          <div className={styles.crop_preview_dots}>
            {photos.map((photo) => (
              <span
                key={`crop-dot-${photo.id}`}
                className={styles.crop_preview_dot}
                data-active={photo.id === activePhoto.id ? 'true' : 'false'}
              />
            ))}
          </div>
        </>
      )}

      {showCropGallery && (
        <div ref={cropGalleryWrapRef}>
          <div className={styles.crop_gallery_panel}>
            <div className={styles.crop_gallery_track}>
              {photos.map((photo) => (
                <div
                  key={`gallery-${photo.id}`}
                  className={styles.crop_gallery_item}
                  data-active={photo.id === activePhoto.id}
                >
                  <button
                    type="button"
                    className={styles.crop_gallery_select}
                    onClick={() => {
                      setCropGalleryPage(
                        Math.max(
                          0,
                          photos.findIndex((item) => item.id === photo.id),
                        ),
                      );
                      onSelectPhoto(photo.id);
                    }}
                  >
                    <img src={photo.preview_url} alt={photo.name} />
                  </button>
                  <button
                    type="button"
                    className={styles.crop_gallery_close}
                    onClick={() => onRemovePhoto(photo.id)}
                    aria-label={`${dictionary.removeImage.value}: ${photo.name}`}
                  >
                    <Icon iconId="close-outline" width="12" height="12" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.crop_gallery_add}
              onClick={onOpenPicker}
              disabled={photos.length >= MAX_FILES_COUNT || isUploading}
              aria-label={dictionary.addImage.value}
            >
              <Icon iconId="plus-circle-outline" width="36" height="36" />
            </button>
          </div>
        </div>
      )}

      <div className={styles.crop_mobile_actions}>
        <button
          ref={cropRatioToggleRef}
          type="button"
          className={styles.crop_mobile_btn}
          onClick={() => {
            setShowMobileRatio((prev) => !prev);
            setShowMobileZoom(false);
            setShowCropGallery(false);
          }}
          aria-label={dictionary.aspectRatio.value}
          data-active={showMobileRatio}
        >
          <Icon iconId="expand-outline" width="24" height="24" />
        </button>

        <button
          ref={cropZoomToggleRef}
          type="button"
          className={styles.crop_mobile_btn}
          onClick={() => {
            setShowMobileZoom((prev) => !prev);
            setShowMobileRatio(false);
            setShowCropGallery(false);
          }}
          aria-label={dictionary.zoom.value}
          data-active={showMobileZoom}
        >
          <svg
            className={styles.crop_btn_icon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="10.5"
              cy="10.5"
              r="5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M19 19l-3.9-3.9M10.5 8v5M8 10.5h5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          ref={cropGalleryToggleRef}
          type="button"
          className={styles.crop_mobile_btn}
          onClick={() => {
            setShowCropGallery((prev) => !prev);
            setShowMobileRatio(false);
            setShowMobileZoom(false);
          }}
          data-active={showCropGallery}
          aria-label={dictionary.selectPhoto.value}
        >
          <Icon iconId="image-outline" width="24" height="24" />
        </button>
      </div>
    </>
  );
}
