'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import clsx from 'clsx';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { createPost, uploadPostImages } from '@/entities/post';
import styles from './CreatePage.module.scss';

type Step = 'upload' | 'crop' | 'filters' | 'publish';
type AspectRatio = 'original' | '1:1' | '4:5' | '16:9';
type FilterId =
  | 'normal'
  | 'clarendon'
  | 'lark'
  | 'gingham'
  | 'moon'
  | 'valencia'
  | 'juno'
  | 'reyes'
  | 'ludwig';

type PhotoItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  upload_id: string | null;
  preview_url: string;
  revokable: boolean;
};

type DraftPhoto = Omit<PhotoItem, 'revokable'>;

type CreateDraft = {
  step: Step;
  aspect_ratio: AspectRatio;
  zoom: number;
  filter_id: FilterId;
  description: string;
  photos: DraftPhoto[];
};

type NominatimResult = {
  place_id: number;
  name?: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
    suburb?: string;
    county?: string;
    state?: string;
    country?: string;
  };
};

type LocationSuggestion = {
  id: string;
  city: string;
  description: string;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES_COUNT = 10;
const DRAFT_STORAGE_KEY = 'create_post_draft_v1';

const filters: { id: FilterId; label: string; css: string }[] = [
  { id: 'normal', label: 'Normal', css: 'none' },
  { id: 'clarendon', label: 'Clarendon', css: 'contrast(1.12) saturate(1.2)' },
  { id: 'lark', label: 'Lark', css: 'brightness(1.06) saturate(0.88)' },
  { id: 'gingham', label: 'Gingham', css: 'sepia(0.14) contrast(0.95)' },
  { id: 'moon', label: 'Moon', css: 'grayscale(1) contrast(1.08)' },
  { id: 'valencia', label: 'Valencia', css: 'sepia(0.22) saturate(1.08) brightness(1.02)' },
  { id: 'juno', label: 'Juno', css: 'hue-rotate(-8deg) saturate(1.32)' },
  { id: 'reyes', label: 'Reyes', css: 'sepia(0.12) brightness(1.08) contrast(0.92)' },
  { id: 'ludwig', label: 'Ludwig', css: 'contrast(1.08) brightness(1.03)' },
];

const ratios: AspectRatio[] = ['original', '1:1', '4:5', '16:9'];
const steps: Step[] = ['upload', 'crop', 'filters', 'publish'];
const ratio_to_value: Record<Exclude<AspectRatio, 'original'>, number> = {
  '1:1': 1 / 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
};

async function file_to_data_url(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function get_error_message(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null || !('data' in error)) {
    return fallback;
  }

  const data = (error as { data?: unknown }).data;

  if (typeof data === 'string' && data) {
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    const record = data as {
      message?: string;
      error?: string;
      messages?: Array<string | { message?: string }>;
    };

    if (Array.isArray(record.messages) && record.messages.length > 0) {
      const first = record.messages[0];

      if (typeof first === 'string' && first) return first;
      if (typeof first === 'object' && first?.message) return first.message;
    }

    if (typeof record.message === 'string' && record.message) return record.message;
    if (typeof record.error === 'string' && record.error) return record.error;
  }

  return fallback;
}

export function CreatePage() {
  const router = useRouter();
  const { locale } = useLocale();
  const file_input_ref = useRef<HTMLInputElement>(null);
  const photos_ref = useRef<PhotoItem[]>([]);
  const location_wrap_ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [active_photo_id, setActivePhotoId] = useState<string | null>(null);
  const [aspect_ratio, setAspectRatio] = useState<AspectRatio>('original');
  const [zoom, setZoom] = useState(1);
  const [filter_id, setFilterId] = useState<FilterId>('normal');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [location_suggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [show_location_suggestions, setShowLocationSuggestions] = useState(false);
  const [is_location_loading, setIsLocationLoading] = useState(false);
  const [show_close_confirm, setShowCloseConfirm] = useState(false);
  const [validation_message, setValidationMessage] = useState<string | null>(null);
  const [is_uploading, setIsUploading] = useState(false);
  const [is_publishing, setIsPublishing] = useState(false);
  const [show_mobile_ratio, setShowMobileRatio] = useState(false);
  const [show_mobile_zoom, setShowMobileZoom] = useState(false);
  const [show_crop_gallery, setShowCropGallery] = useState(false);
  const [crop_gallery_page, setCropGalleryPage] = useState(0);
  const [has_draft, setHasDraft] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    return Boolean(localStorage.getItem(DRAFT_STORAGE_KEY));
  });

  const active_photo = useMemo(
    () => photos.find((photo) => photo.id === active_photo_id) ?? photos[0] ?? null,
    [active_photo_id, photos],
  );
  const active_filter = filters.find((item) => item.id === filter_id)?.css ?? 'none';
  const crop_ratio = aspect_ratio === 'original' ? null : ratio_to_value[aspect_ratio];

  useEffect(() => {
    photos_ref.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photos_ref.current.forEach((photo) => {
        if (photo.revokable) {
          URL.revokeObjectURL(photo.preview_url);
        }
      });
    };
  }, []);

  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (!location_wrap_ref.current) return;
      if (!location_wrap_ref.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handle_click_outside);

    return () => {
      document.removeEventListener('mousedown', handle_click_outside);
    };
  }, []);

  useEffect(() => {
    const query = location.trim();

    if (step !== 'publish' || query.length < 2) {
      setLocationSuggestions([]);
      setIsLocationLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLocationLoading(true);

      try {
        const params = new URLSearchParams({
          q: query,
          format: 'jsonv2',
          addressdetails: '1',
          limit: '10',
          'accept-language': 'en',
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Location search failed: ${response.status}`);
        }

        const data = (await response.json()) as NominatimResult[];
        const mapped = data.map((item) => {
          const city =
            item.address?.city ||
            item.address?.town ||
            item.address?.village ||
            item.address?.hamlet ||
            item.name ||
            item.display_name.split(',')[0] ||
            'Unknown';

          const description_parts = [
            item.address?.suburb,
            item.address?.county,
            item.address?.state,
            item.address?.country,
          ].filter(Boolean);

          return {
            id: String(item.place_id),
            city,
            description: description_parts.join(', ') || item.display_name,
          };
        });

        setLocationSuggestions(mapped);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setLocationSuggestions([]);
        }
      } finally {
        setIsLocationLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [location, step]);

  const add_photos = async (new_files: File[]) => {
    if (new_files.length === 0) return;

    const wrong_file = new_files.find(
      (file) => !['image/jpeg', 'image/png'].includes(file.type) || file.size > MAX_FILE_SIZE,
    );

    if (wrong_file) {
      setValidationMessage('The photo must be less than 20 Mb and have JPEG or PNG format');
      return;
    }

    if (photos.length + new_files.length > MAX_FILES_COUNT) {
      setValidationMessage('You can upload up to 10 photos for one publication');
      return;
    }

    setIsUploading(true);

    try {
      const upload_ids = await uploadPostImages(new_files);
      const mapped = new_files.map((file, index) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        upload_id: upload_ids[index] ?? null,
        preview_url: URL.createObjectURL(file),
        revokable: true,
      }));

      const has_missed_upload_id = mapped.some((item) => item.upload_id === null);
      if (has_missed_upload_id) {
        setValidationMessage('Unable to upload one or more photos. Please try again');
        mapped.forEach((item) => URL.revokeObjectURL(item.preview_url));
        return;
      }

      setPhotos((prev) => [...prev, ...mapped]);
      setActivePhotoId((prev) => prev ?? mapped[0]?.id ?? null);
      setStep('crop');
    } catch (error) {
      setValidationMessage(
        get_error_message(error, 'The photo must be less than 20 Mb and have JPEG or PNG format'),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handle_file_select = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    void add_photos(files);
    event.target.value = '';
  };

  const handle_open_picker = () => {
    file_input_ref.current?.click();
  };

  const handle_back = () => {
    if (step === 'upload') {
      setShowCloseConfirm(true);
      return;
    }

    const current_index = steps.indexOf(step);
    const prev_step = steps[Math.max(0, current_index - 1)];
    setStep(prev_step);
  };

  const handle_next = () => {
    const current_index = steps.indexOf(step);
    const next_step = steps[Math.min(steps.length - 1, current_index + 1)];
    setStep(next_step);
  };

  const close_and_go_home = () => {
    router.push(getLocalizedUrl('/', locale));
  };

  const save_draft = async () => {
    const draft_photos: DraftPhoto[] = await Promise.all(
      photos.map(async (photo) => {
        if (!photo.revokable) {
          return {
            id: photo.id,
            name: photo.name,
            type: photo.type,
            size: photo.size,
            upload_id: photo.upload_id,
            preview_url: photo.preview_url,
          };
        }

        const photo_response = await fetch(photo.preview_url);
        const photo_blob = await photo_response.blob();
        const file_like = new File([photo_blob], photo.name, { type: photo.type });
        const preview_data = await file_to_data_url(file_like);

        return {
          id: photo.id,
          name: photo.name,
          type: photo.type,
          size: photo.size,
          upload_id: photo.upload_id,
          preview_url: preview_data,
        };
      }),
    );

    const draft: CreateDraft = {
      step,
      aspect_ratio,
      zoom,
      filter_id,
      description,
      photos: draft_photos,
    };

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setHasDraft(true);
    close_and_go_home();
  };

  const open_draft = () => {
    const raw_draft = localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!raw_draft) return;

    try {
      const parsed_draft = JSON.parse(raw_draft) as CreateDraft;

      setStep(parsed_draft.step);
      setAspectRatio(parsed_draft.aspect_ratio);
      setZoom(parsed_draft.zoom);
      setFilterId(parsed_draft.filter_id);
      setDescription(parsed_draft.description);

      const mapped_photos: PhotoItem[] = parsed_draft.photos.map((photo) => ({
        ...photo,
        upload_id: photo.upload_id ?? null,
        revokable: false,
      }));

      setPhotos(mapped_photos);
      setActivePhotoId(mapped_photos[0]?.id ?? null);
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
    }
  };

  const publish_post = async () => {
    const upload_ids = photos
      .map((photo) => photo.upload_id)
      .filter((upload_id): upload_id is string => Boolean(upload_id));

    if (upload_ids.length === 0) {
      setValidationMessage('Please upload at least one photo before publishing');
      return;
    }

    setIsPublishing(true);

    try {
      await createPost({
        description: description.trim() ? description.trim() : null,
        childrenMetadata: upload_ids.map((uploadId) => ({ uploadId })),
      });

      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      close_and_go_home();
    } catch (error) {
      setValidationMessage(get_error_message(error, 'Could not publish post. Please try again'));
    } finally {
      setIsPublishing(false);
    }
  };

  const can_go_next = photos.length > 0 && step !== 'publish' && !is_uploading && !is_publishing;
  const active_photo_index = Math.max(
    0,
    photos.findIndex((photo) => photo.id === active_photo_id),
  );

  const go_to_photo = (index: number) => {
    if (photos.length === 0) return;
    const safe_index = (index + photos.length) % photos.length;
    setActivePhotoId(photos[safe_index]?.id ?? null);
  };

  return (
    <section
      className={styles.page}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setShowCloseConfirm(true);
        }
      }}
    >
      <input
        ref={file_input_ref}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        hidden
        onChange={handle_file_select}
      />

      <article
        className={clsx(
          styles.modal,
          step === 'upload' && styles.modal_upload,
          step === 'crop' && styles.modal_crop_mobile,
          step === 'filters' && styles.modal_filters,
          step === 'publish' && styles.modal_publish,
        )}
      >
        {step === 'upload' ? (
          <header className={clsx(styles.header, styles.header_upload)}>
            <h1 className={styles.title}>Add Photo</h1>
            <Button
              variant="text"
              className={styles.icon_btn}
              onClick={() => setShowCloseConfirm(true)}
              aria-label="Close"
            >
              <Icon iconId="close-outline" />
            </Button>
          </header>
        ) : (
          <header
            className={clsx(
              styles.header,
              step === 'crop' && styles.header_crop_mobile,
              step === 'filters' && styles.header_filters,
              step === 'publish' && styles.header_publish,
            )}
          >
            <Button variant="text" className={styles.icon_btn} onClick={handle_back}>
              <Icon iconId="arrow-ios-back-outline" />
            </Button>

            <h1 className={styles.title}>
              {step === 'crop'
                ? 'Cropping'
                : step === 'filters'
                  ? 'Filters'
                  : step === 'publish'
                    ? 'Publication'
                    : 'Create post'}
            </h1>

            {step === 'publish' ? (
              <Button
                variant="text"
                className={styles.action_btn}
                onClick={() => void publish_post()}
                disabled={is_publishing || is_uploading}
              >
                {is_publishing ? 'Publishing...' : 'Publish'}
              </Button>
            ) : (
              <Button
                variant="text"
                className={styles.action_btn}
                onClick={handle_next}
                disabled={!can_go_next}
              >
                Next
              </Button>
            )}
          </header>
        )}

        {step === 'upload' && (
          <div className={styles.upload_step}>
            <div className={styles.upload_preview_box}>
              <Icon iconId="image-outline" width="48" height="48" />
            </div>

            <Button variant="primary" className={styles.upload_button} onClick={handle_open_picker}>
              {is_uploading ? 'Uploading...' : 'Select from Computer'}
            </Button>

            <Button
              variant="outline"
              className={styles.upload_button}
              onClick={open_draft}
              disabled={!has_draft}
            >
              Open Draft
            </Button>
          </div>
        )}

        {step !== 'upload' && active_photo && (
          <div
            className={clsx(
              styles.content,
              step === 'crop' && styles.content_crop_mobile,
              step === 'filters' && styles.content_filters,
              step === 'publish' && styles.content_publish,
            )}
          >
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
                  step === 'crop' || step === 'filters' || !crop_ratio
                    ? undefined
                    : { aspectRatio: crop_ratio }
                }
              >
                <div
                  className={styles.crop_stage}
                  style={step === 'crop' && crop_ratio ? { aspectRatio: crop_ratio } : undefined}
                  data_original={step === 'crop' && crop_ratio ? 'false' : 'true'}
                >
                  <img
                    src={active_photo.preview_url}
                    alt={active_photo.name}
                    style={{
                      transform: `scale(${zoom})`,
                      filter: active_filter,
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
                    data_active={photo.id === active_photo.id}
                    onClick={() => setActivePhotoId(photo.id)}
                  >
                    <img src={photo.preview_url} alt={photo.name} />
                  </button>
                ))}
              </div>

              {step === 'crop' && (
                <>
                  {(show_mobile_ratio || show_mobile_zoom) && (
                    <div
                      className={clsx(
                        styles.crop_mobile_panel,
                        show_mobile_zoom && styles.crop_mobile_panel_zoom,
                        show_mobile_ratio && styles.crop_mobile_panel_ratio,
                      )}
                    >
                      {show_mobile_ratio && (
                        <div className={styles.ratio_sheet}>
                          {ratios.map((ratio) => (
                            <button
                              type="button"
                              key={ratio}
                              className={styles.ratio_sheet_item}
                              data_active={aspect_ratio === ratio}
                              onClick={() => setAspectRatio(ratio)}
                            >
                              <span>{ratio === 'original' ? 'Оригинал' : ratio}</span>
                              <span className={styles.ratio_sheet_icon} data_ratio={ratio} />
                            </button>
                          ))}
                        </div>
                      )}

                      {show_mobile_zoom && (
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

                  {show_crop_gallery && (
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
                              onClick={() => setActivePhotoId(photo.id)}
                              data_active={photo.id === active_photo.id}
                            >
                              <img src={photo.preview_url} alt={photo.name} />
                              <span className={styles.crop_gallery_close}>×</span>
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          className={styles.crop_gallery_add}
                          onClick={handle_open_picker}
                          disabled={photos.length >= MAX_FILES_COUNT || is_uploading}
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
                              data_active={index === crop_gallery_page % 2}
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
                      data_active={show_mobile_ratio}
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
                      data_active={show_mobile_zoom}
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
                      data_active={show_crop_gallery}
                      aria-label="Select photo"
                    >
                      <Icon iconId="image-outline" />
                    </button>
                  </div>
                </>
              )}

              {(step === 'filters' || step === 'publish') && (
                <>
                  <button
                    type="button"
                    className={styles.filter_preview_nav}
                    data_side="left"
                    onClick={() => go_to_photo(active_photo_index - 1)}
                    disabled={photos.length <= 1}
                  >
                    <Icon iconId="arrow-ios-back-outline" />
                  </button>
                  <button
                    type="button"
                    className={styles.filter_preview_nav}
                    data_side="right"
                    onClick={() => go_to_photo(active_photo_index + 1)}
                    disabled={photos.length <= 1}
                  >
                    <Icon iconId="arrow-ios-forward-outline" />
                  </button>
                  {photos.length > 1 && (
                    <div className={styles.filter_preview_dots}>
                      {photos.map((photo) => (
                        <span
                          key={`filter-dot-${photo.id}`}
                          className={styles.filter_preview_dot}
                          data_active={photo.id === active_photo.id ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div
              className={clsx(
                styles.controls_column,
                step === 'crop' && styles.controls_column_hidden,
              )}
            >
              {step === 'crop' && (
                <>
                  <h2 className={styles.section_title}>Adjust photo</h2>

                  <div className={styles.ratio_list}>
                    {ratios.map((ratio) => (
                      <Button
                        key={ratio}
                        variant={aspect_ratio === ratio ? 'primary' : 'outline'}
                        onClick={() => setAspectRatio(ratio)}
                      >
                        {ratio}
                      </Button>
                    ))}
                  </div>

                  <label className={styles.zoom_label} htmlFor="zoom">
                    Zoom
                  </label>
                  <input
                    id="zoom"
                    className={styles.zoom_input}
                    type="range"
                    min="1"
                    max="2.2"
                    step="0.05"
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                  />

                  <Button
                    variant="outline"
                    onClick={handle_open_picker}
                    disabled={photos.length >= MAX_FILES_COUNT || is_uploading}
                  >
                    {is_uploading
                      ? 'Uploading...'
                      : `Add more photos (${photos.length}/${MAX_FILES_COUNT})`}
                  </Button>
                </>
              )}

              {step === 'filters' && (
                <div className={styles.filter_grid}>
                  {filters.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={styles.filter_tile}
                        data_active={item.id === filter_id}
                        onClick={() => setFilterId(item.id)}
                      >
                        <span className={styles.filter_tile_image}>
                          <img
                            src={active_photo.preview_url}
                            alt={`${item.label} preview`}
                            style={{ filter: item.css }}
                          />
                        </span>
                        <span className={styles.filter_tile_label}>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 'publish' && (
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

                  <div className={styles.publish_location_block} ref={location_wrap_ref}>
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
                      <button
                        type="button"
                        className={styles.publish_location_pin}
                        aria-label="Pick location"
                      >
                        <Icon iconId="pin-outline" />
                      </button>
                    </div>

                    {show_location_suggestions && (
                      <div className={styles.publish_location_suggestions}>
                        {is_location_loading && (
                          <div className={styles.publish_location_empty}>Searching...</div>
                        )}

                        {!is_location_loading &&
                          location_suggestions.map((item) => (
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
                              <span className={styles.publish_location_place}>
                                {item.description}
                              </span>
                            </button>
                          ))}

                        {!is_location_loading &&
                          location.trim().length >= 2 &&
                          location_suggestions.length === 0 && (
                            <div className={styles.publish_location_empty}>No locations found</div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </article>

      {show_close_confirm && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_header}>
              <h2>Close publication creation?</h2>
              <Button
                variant="text"
                className={styles.icon_btn}
                onClick={() => setShowCloseConfirm(false)}
              >
                <Icon iconId="close-outline" />
              </Button>
            </div>

            <p>
              Do you really want to close the creation of a publication? If you close everything
              will be deleted
            </p>

            <div className={styles.dialog_actions}>
              <Button variant="outline" onClick={save_draft}>
                Save draft
              </Button>
              <Button variant="primary" onClick={() => setShowCloseConfirm(false)}>
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}

      {validation_message && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_header}>
              <h2>Invalid photo</h2>
              <Button
                variant="text"
                className={styles.icon_btn}
                onClick={() => setValidationMessage(null)}
              >
                <Icon iconId="close-outline" />
              </Button>
            </div>

            <p>{validation_message}</p>

            <div className={styles.dialog_actions}>
              <Button variant="primary" onClick={() => setValidationMessage(null)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
