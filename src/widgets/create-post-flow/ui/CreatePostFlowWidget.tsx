'use client';

import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import clsx from 'clsx';
import {
  DRAFT_STORAGE_KEY,
  MAX_FILE_SIZE,
  MAX_FILES_COUNT,
  clearDraft,
  filters,
  getCreatePostErrorMessage,
  ratio_to_value,
  readDraft,
  saveDraft,
  steps,
  toDraftPhotos,
  toPhotoItems,
  useCreatePostFlowStore,
  useLocationSuggestions,
  type CreateDraft,
  type PhotoItem,
} from '@/features/create-post';
import { CreatePostUploadStep } from '@/features/create-post/upload';
import { createPost, uploadPostImages } from '@/entities/post';
import { CreatePostDialogs } from './components/CreatePostDialogs';
import { CreatePostEditorContent } from './components/CreatePostEditorContent';
import { CreatePostHeader } from './components/CreatePostHeader';
import styles from './CreatePostFlowWidget.module.scss';

export function CreatePostFlowWidget() {
  const router = useRouter();
  const { locale } = useLocale();
  const file_input_ref = useRef<HTMLInputElement>(null);
  const photos_ref = useRef<PhotoItem[]>([]);
  const location_wrap_ref = useRef<HTMLDivElement>(null);
  const {
    active_photo_id,
    aspect_ratio,
    crop_gallery_page,
    description,
    filter_id,
    has_draft,
    is_publishing,
    is_uploading,
    location,
    photos,
    setActivePhotoId,
    setAspectRatio,
    setCropGalleryPage,
    setDescription,
    setFilterId,
    setHasDraft,
    setIsPublishing,
    setIsUploading,
    setLocation,
    setPhotos,
    setShowCloseConfirm,
    setShowCropGallery,
    setShowLocationSuggestions,
    setShowMobileRatio,
    setShowMobileZoom,
    setStep,
    setValidationMessage,
    setZoom,
    show_close_confirm,
    show_crop_gallery,
    show_location_suggestions,
    show_mobile_ratio,
    show_mobile_zoom,
    step,
    validation_message,
    zoom,
  } = useCreatePostFlowStore();

  const active_photo = useMemo(
    () => photos.find((photo) => photo.id === active_photo_id) ?? photos[0] ?? null,
    [active_photo_id, photos],
  );
  const { suggestions: location_suggestions, isLoading: is_location_loading } =
    useLocationSuggestions({
      enabled: step === 'publish',
      query: location,
    });
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
  }, [setShowLocationSuggestions]);

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
      setActivePhotoId(active_photo_id ?? mapped[0]?.id ?? null);
      setStep('crop');
    } catch (error) {
      setValidationMessage(
        getCreatePostErrorMessage(
          error,
          'The photo must be less than 20 Mb and have JPEG or PNG format',
        ),
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
    const draft_photos = await toDraftPhotos(photos);

    const draft: CreateDraft = {
      step,
      aspect_ratio,
      zoom,
      filter_id,
      description,
      photos: draft_photos,
    };

    saveDraft(DRAFT_STORAGE_KEY, draft);
    setHasDraft(true);
    close_and_go_home();
  };

  const open_draft = () => {
    const parsed_draft = readDraft(DRAFT_STORAGE_KEY);

    if (!parsed_draft) {
      setHasDraft(false);
      return;
    }

    setStep(parsed_draft.step);
    setAspectRatio(parsed_draft.aspect_ratio);
    setZoom(parsed_draft.zoom);
    setFilterId(parsed_draft.filter_id);
    setDescription(parsed_draft.description);

    const mapped_photos = toPhotoItems(parsed_draft);

    setPhotos(mapped_photos);
    setActivePhotoId(mapped_photos[0]?.id ?? null);
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

      clearDraft(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      close_and_go_home();
    } catch (error) {
      setValidationMessage(
        getCreatePostErrorMessage(error, 'Could not publish post. Please try again'),
      );
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
        <CreatePostHeader
          canGoNext={can_go_next}
          isPublishing={is_publishing}
          isUploading={is_uploading}
          onBack={handle_back}
          onClose={() => setShowCloseConfirm(true)}
          onNext={handle_next}
          onPublish={() => void publish_post()}
          step={step}
        />

        {step === 'upload' && (
          <CreatePostUploadStep
            hasDraft={has_draft}
            isUploading={is_uploading}
            onOpenDraft={open_draft}
            onOpenPicker={handle_open_picker}
            styles={styles}
          />
        )}

        {step !== 'upload' && active_photo && (
          <CreatePostEditorContent
            activeFilter={active_filter}
            activePhoto={active_photo}
            activePhotoIndex={active_photo_index}
            aspectRatio={aspect_ratio}
            cropGalleryPage={crop_gallery_page}
            cropRatio={crop_ratio}
            description={description}
            filterId={filter_id}
            goToPhoto={go_to_photo}
            isLocationLoading={is_location_loading}
            isUploading={is_uploading}
            location={location}
            locationSuggestions={location_suggestions}
            locationWrapRef={location_wrap_ref}
            onOpenPicker={handle_open_picker}
            onSelectPhoto={setActivePhotoId}
            photos={photos}
            setAspectRatio={setAspectRatio}
            setCropGalleryPage={setCropGalleryPage}
            setDescription={setDescription}
            setFilterId={setFilterId}
            setLocation={setLocation}
            setShowCropGallery={setShowCropGallery}
            setShowLocationSuggestions={setShowLocationSuggestions}
            setShowMobileRatio={setShowMobileRatio}
            setShowMobileZoom={setShowMobileZoom}
            showCropGallery={show_crop_gallery}
            showLocationSuggestions={show_location_suggestions}
            showMobileRatio={show_mobile_ratio}
            showMobileZoom={show_mobile_zoom}
            step={step}
            zoom={zoom}
            setZoom={setZoom}
          />
        )}
      </article>

      <CreatePostDialogs
        onCloseConfirm={() => setShowCloseConfirm(false)}
        onCloseValidation={() => setValidationMessage(null)}
        onSaveDraft={() => void save_draft()}
        showCloseConfirm={show_close_confirm}
        validationMessage={validation_message}
      />
    </section>
  );
}
