'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { createPost, uploadPostImages } from '@/entities/post';
import styles from './CreatePage.module.scss';

type Step = 'upload' | 'crop' | 'filters' | 'publish';
type AspectRatio = '1:1' | '4:5' | '16:9';
type FilterId = 'none' | 'grayscale' | 'sepia' | 'contrast';

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

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES_COUNT = 10;
const DRAFT_STORAGE_KEY = 'create_post_draft_v1';

const filters: { id: FilterId; label: string; css: string }[] = [
  { id: 'none', label: 'Original', css: 'none' },
  { id: 'grayscale', label: 'Grayscale', css: 'grayscale(1)' },
  { id: 'sepia', label: 'Sepia', css: 'sepia(0.85)' },
  { id: 'contrast', label: 'High Contrast', css: 'contrast(1.25) saturate(1.05)' },
];

const ratios: AspectRatio[] = ['1:1', '4:5', '16:9'];
const steps: Step[] = ['upload', 'crop', 'filters', 'publish'];
const ratio_to_value: Record<AspectRatio, number> = {
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
  const [step, setStep] = useState<Step>('upload');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [active_photo_id, setActivePhotoId] = useState<string | null>(null);
  const [aspect_ratio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [zoom, setZoom] = useState(1);
  const [filter_id, setFilterId] = useState<FilterId>('none');
  const [description, setDescription] = useState('');
  const [show_close_confirm, setShowCloseConfirm] = useState(false);
  const [validation_message, setValidationMessage] = useState<string | null>(null);
  const [is_uploading, setIsUploading] = useState(false);
  const [is_publishing, setIsPublishing] = useState(false);
  const [has_draft, setHasDraft] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    return Boolean(localStorage.getItem(DRAFT_STORAGE_KEY));
  });

  const active_photo = useMemo(
    () => photos.find((photo) => photo.id === active_photo_id) ?? photos[0] ?? null,
    [active_photo_id, photos],
  );
  const active_filter = filters.find((item) => item.id === filter_id)?.css ?? 'none';
  const crop_ratio = ratio_to_value[aspect_ratio];

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

      <article className={styles.modal}>
        <header className={styles.header}>
          <Button variant="text" className={styles.icon_btn} onClick={handle_back}>
            <Icon iconId="arrow-ios-back-outline" />
          </Button>

          <h1 className={styles.title}>Create post</h1>

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

        {step === 'upload' && (
          <div className={styles.upload_step}>
            <div className={styles.placeholder}>
              <Icon iconId="image-outline" width="48" height="48" />
              <p>Add photos here</p>
            </div>

            <Button variant="primary" onClick={handle_open_picker}>
              {is_uploading ? 'Uploading...' : 'Select from Computer'}
            </Button>

            {has_draft && (
              <Button variant="outline" onClick={open_draft}>
                Open draft
              </Button>
            )}
          </div>
        )}

        {step !== 'upload' && active_photo && (
          <div className={styles.content}>
            <div className={styles.preview_column}>
              <div className={styles.preview} style={{ aspectRatio: crop_ratio }}>
                <img
                  src={active_photo.preview_url}
                  alt={active_photo.name}
                  style={{
                    transform: `scale(${zoom})`,
                    filter: active_filter,
                  }}
                />
              </div>

              <div className={styles.thumbs}>
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
            </div>

            <div className={styles.controls_column}>
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
                <>
                  <h2 className={styles.section_title}>Filters</h2>

                  <div className={styles.filter_list}>
                    {filters.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className={styles.filter_btn}
                        data_active={item.id === filter_id}
                        onClick={() => setFilterId(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 'publish' && (
                <>
                  <h2 className={styles.section_title}>Post details</h2>

                  <Input label="Photos" value={`${photos.length}`} disabled />

                  <Textarea
                    label="Description"
                    placeholder="Add a caption..."
                    maxLength={500}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    helperText={`${description.length}/500`}
                  />
                </>
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
