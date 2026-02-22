import type { Dispatch, SetStateAction } from 'react';
import { MAX_FILES_COUNT, ratios, type AspectRatio, type PhotoItem } from '@/features/create-post';
import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Icon } from '@/shared/ui/Icon';
import clsx from 'clsx';

type Props = {
  activePhoto: PhotoItem;
  aspectRatio: AspectRatio;
  cropGalleryPage: number;
  isUploading: boolean;
  onOpenPicker: () => void;
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
  isUploading,
  onOpenPicker,
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
  return (
    <>
      {(showMobileRatio || showMobileZoom) && (
        <div
          className={clsx(
            styles.crop_mobile_panel,
            showMobileZoom && styles.crop_mobile_panel_zoom,
            showMobileRatio && styles.crop_mobile_panel_ratio,
          )}
        >
          {showMobileRatio && (
            <div className={styles.ratio_sheet}>
              {ratios.map((ratio) => (
                <button
                  type="button"
                  key={ratio}
                  className={styles.ratio_sheet_item}
                  data-active={aspectRatio === ratio}
                  onClick={() => setAspectRatio(ratio)}
                >
                  <span>{ratio === 'original' ? 'Оригинал' : ratio}</span>
                  <span className={styles.ratio_sheet_icon} data-ratio={ratio} />
                </button>
              ))}
            </div>
          )}

          {showMobileZoom && (
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
          )}
        </div>
      )}

      {showCropGallery && (
        <>
          {photos.length > 1 && (
            <button
              type="button"
              className={styles.crop_gallery_prev}
              onClick={() =>
                setCropGalleryPage((prev) => (prev <= 0 ? photos.length - 1 : prev - 1))
              }
              aria-label="Previous image"
            >
              <Icon iconId="arrow-ios-back-outline" />
            </button>
          )}

          <div className={styles.crop_gallery_panel}>
            <div className={styles.crop_gallery_track}>
              {photos.map((photo) => (
                <button
                  type="button"
                  key={`gallery-${photo.id}`}
                  className={styles.crop_gallery_item}
                  onClick={() => onSelectPhoto(photo.id)}
                  data-active={photo.id === activePhoto.id}
                >
                  <img src={photo.preview_url} alt={photo.name} />
                  <span className={styles.crop_gallery_close}>×</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.crop_gallery_add}
              onClick={onOpenPicker}
              disabled={photos.length >= MAX_FILES_COUNT || isUploading}
              aria-label="Add image"
            >
              +
            </button>
          </div>

          {photos.length > 1 && (
            <div className={styles.crop_gallery_dots}>
              {photos.slice(0, 2).map((photo, index) => (
                <span
                  key={`dot-${photo.id}`}
                  className={styles.crop_gallery_dot}
                  data-active={index === cropGalleryPage % 2}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className={styles.crop_mobile_actions}>
        <button
          type="button"
          className={styles.crop_mobile_btn}
          onClick={() => {
            setShowMobileRatio((prev) => !prev);
            setShowMobileZoom(false);
            setShowCropGallery(false);
          }}
          aria-label="Aspect ratio"
          data-active={showMobileRatio}
        >
          <svg
            className={styles.crop_btn_icon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6M3 9l6-6M15 3l6 6M3 15l6 6M21 15l-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className={styles.crop_mobile_btn}
          onClick={() => {
            setShowMobileZoom((prev) => !prev);
            setShowMobileRatio(false);
            setShowCropGallery(false);
          }}
          aria-label="Zoom"
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
          type="button"
          className={styles.crop_mobile_btn}
          onClick={() => {
            setShowCropGallery((prev) => !prev);
            setShowMobileRatio(false);
            setShowMobileZoom(false);
          }}
          data-active={showCropGallery}
          aria-label="Select photo"
        >
          <Icon iconId="image-outline" />
        </button>
      </div>
    </>
  );
}
