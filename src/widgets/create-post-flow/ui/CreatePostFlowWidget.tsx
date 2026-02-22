'use client';

import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary, useLocale } from 'next-intlayer';
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
import { useMe } from '@/features/auth/model/useMe';
import { CreatePostUploadStep } from '@/features/create-post/upload';
import { createPost, deletePostImage, uploadPostImages } from '@/entities/post';
import { CreatePostDialogs } from './components/CreatePostDialogs';
import { CreatePostEditorContent } from './components/CreatePostEditorContent';
import { CreatePostHeader } from './components/CreatePostHeader';
import createPostFlowContent from '../create-post-flow.content';
import styles from './CreatePostFlowWidget.module.scss';

export function CreatePostFlowWidget() {
  const router = useRouter();
  const { locale } = useLocale();
  const file_input_ref = useRef<HTMLInputElement>(null);
  const photos_ref = useRef<PhotoItem[]>([]);
  const location_wrap_ref = useRef<HTMLDivElement>(null);
  const crop_ratio_panel_ref = useRef<HTMLDivElement>(null);
  const crop_ratio_toggle_ref = useRef<HTMLButtonElement>(null);
  const crop_gallery_wrap_ref = useRef<HTMLDivElement>(null);
  const crop_gallery_toggle_ref = useRef<HTMLButtonElement>(null);
  const crop_zoom_panel_ref = useRef<HTMLDivElement>(null);
  const crop_zoom_toggle_ref = useRef<HTMLButtonElement>(null);
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
  const { data: me } = useMe();
  const dictionary = useDictionary(createPostFlowContent);

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

  useEffect(() => {
    const handle_click_outside_crop_panels = (event: MouseEvent) => {
      const target = event.target as Node;

      if (show_crop_gallery) {
        const clicked_inside_gallery = crop_gallery_wrap_ref.current?.contains(target) ?? false;
        const clicked_gallery_toggle = crop_gallery_toggle_ref.current?.contains(target) ?? false;

        if (!clicked_inside_gallery && !clicked_gallery_toggle) {
          setShowCropGallery(false);
        }
      }

      if (show_mobile_ratio) {
        const clicked_inside_ratio_panel = crop_ratio_panel_ref.current?.contains(target) ?? false;
        const clicked_ratio_toggle = crop_ratio_toggle_ref.current?.contains(target) ?? false;

        if (!clicked_inside_ratio_panel && !clicked_ratio_toggle) {
          setShowMobileRatio(false);
        }
      }

      if (show_mobile_zoom) {
        const clicked_inside_zoom_panel = crop_zoom_panel_ref.current?.contains(target) ?? false;
        const clicked_zoom_toggle = crop_zoom_toggle_ref.current?.contains(target) ?? false;

        if (!clicked_inside_zoom_panel && !clicked_zoom_toggle) {
          setShowMobileZoom(false);
        }
      }
    };

    document.addEventListener('mousedown', handle_click_outside_crop_panels);

    return () => {
      document.removeEventListener('mousedown', handle_click_outside_crop_panels);
    };
  }, [
    setShowCropGallery,
    setShowMobileRatio,
    setShowMobileZoom,
    show_crop_gallery,
    show_mobile_ratio,
    show_mobile_zoom,
  ]);

  const add_photos = async (new_files: File[]) => {
    if (new_files.length === 0) return;

    const wrong_file = new_files.find(
      (file) => !['image/jpeg', 'image/png'].includes(file.type) || file.size > MAX_FILE_SIZE,
    );

    if (wrong_file) {
      setValidationMessage(dictionary.invalidPhotoMessage);
      return;
    }

    if (photos.length + new_files.length > MAX_FILES_COUNT) {
      setValidationMessage(dictionary.maxPhotosMessage);
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
        setValidationMessage(dictionary.uploadFailedMessage);
        mapped.forEach((item) => URL.revokeObjectURL(item.preview_url));
        return;
      }

      setPhotos((prev) => [...prev, ...mapped]);
      setActivePhotoId(active_photo_id ?? mapped[0]?.id ?? null);
      setStep('crop');
    } catch (error) {
      setValidationMessage(
        getCreatePostErrorMessage(error, dictionary.invalidPhotoMessage),
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
      setValidationMessage(dictionary.noPhotosBeforePublishingMessage);
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
        getCreatePostErrorMessage(error, dictionary.publishFailedMessage),
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const remove_photo = async (photo_id: string) => {
    const photo_to_remove = photos.find((photo) => photo.id === photo_id);
    if (!photo_to_remove) return;

    try {
      if (photo_to_remove.upload_id) {
        await deletePostImage(photo_to_remove.upload_id);
      }

      if (photo_to_remove.revokable) {
        URL.revokeObjectURL(photo_to_remove.preview_url);
      }

      const next_photos = photos.filter((photo) => photo.id !== photo_id);
      setPhotos(next_photos);

      if (next_photos.length === 0) {
        setActivePhotoId(null);
        setShowCropGallery(false);
        setStep('upload');
        return;
      }

      if (active_photo_id === photo_id) {
        const removed_index = photos.findIndex((photo) => photo.id === photo_id);
        const next_index = Math.min(removed_index, next_photos.length - 1);
        setActivePhotoId(next_photos[next_index]?.id ?? next_photos[0]?.id ?? null);
      }
    } catch (error) {
      setValidationMessage(getCreatePostErrorMessage(error, dictionary.deletePhotoFailedMessage));
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
            cropRatioPanelRef={crop_ratio_panel_ref}
            cropRatioToggleRef={crop_ratio_toggle_ref}
            cropGalleryToggleRef={crop_gallery_toggle_ref}
            cropGalleryWrapRef={crop_gallery_wrap_ref}
            cropZoomPanelRef={crop_zoom_panel_ref}
            cropZoomToggleRef={crop_zoom_toggle_ref}
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
            onRemovePhoto={(photoId) => void remove_photo(photoId)}
            onSelectPhoto={setActivePhotoId}
            profileUsername={me?.userName ?? ''}
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
