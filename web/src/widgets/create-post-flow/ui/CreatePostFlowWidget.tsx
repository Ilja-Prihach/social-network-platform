'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDictionary, useLocale } from 'next-intlayer';
import { getLocalizedUrl } from 'intlayer';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
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
import { createPost, deletePostImage, uploadPostImages } from '@/entities/post';
import type { ApiError } from '@/shared/api/types';
import { CreatePostDialogs } from './components/CreatePostDialogs';
import { CreatePostEditorContent } from './components/CreatePostEditorContent';
import { CreatePostHeader } from './components/CreatePostHeader';
import createPostFlowContent from '@/features/create-post/model/create-post-flow.content';
import styles from './CreatePostFlowWidget.module.scss';

type LocalProfileAvatar = {
  url: string;
  width?: number;
  height?: number;
};

type LocalProfile = {
  userName: string;
  avatars: LocalProfileAvatar[];
};

type RawProfile = {
  userName?: string;
  username?: string;
  avatar?: string | null;
  avatarUrl?: string | null;
  avatars?: Array<{
    url?: string;
    width?: number;
    height?: number;
  }>;
  profile?: {
    userName?: string;
    username?: string;
    avatar?: string | null;
    avatarUrl?: string | null;
    avatars?: Array<{
      url?: string;
      width?: number;
      height?: number;
    }>;
  };
};

const myProfileQueryKey = ['my-profile-create-post'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeAvatars = (value: unknown): LocalProfileAvatar[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is { url?: string; width?: number; height?: number } => isRecord(item))
    .map((item) => ({
      url: typeof item.url === 'string' ? item.url : '',
      width: typeof item.width === 'number' ? item.width : undefined,
      height: typeof item.height === 'number' ? item.height : undefined,
    }))
    .filter((item) => item.url.length > 0);
};

const normalizeProfile = (raw: RawProfile): LocalProfile => {
  const userName =
    raw.userName ?? raw.username ?? raw.profile?.userName ?? raw.profile?.username ?? '';
  const avatars = normalizeAvatars(raw.avatars);
  const profileAvatars = normalizeAvatars(raw.profile?.avatars);
  const directAvatar = raw.avatarUrl ?? raw.avatar ?? raw.profile?.avatarUrl ?? raw.profile?.avatar;
  const fallbackAvatar =
    typeof directAvatar === 'string' && directAvatar.length > 0 ? [{ url: directAvatar }] : [];

  return {
    userName,
    avatars: avatars.length ? avatars : profileAvatars.length ? profileAvatars : fallbackAvatar,
  };
};

const fetchCreatePostProfile = async (): Promise<LocalProfile> => {
  const response = await fetch('/api/users/profile');
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw {
      status: response.status,
      data: payload,
    } satisfies ApiError;
  }

  if (!isRecord(payload)) return { userName: '', avatars: [] };

  const candidates: unknown[] = [];
  if (isRecord(payload.data)) candidates.push(payload.data);
  if (isRecord(payload.profile)) candidates.push(payload.profile);
  candidates.push(payload);

  for (const candidate of candidates) {
    if (!isRecord(candidate)) continue;
    const normalized = normalizeProfile(candidate as RawProfile);
    if (normalized.userName || normalized.avatars.length) {
      return normalized;
    }
  }

  return { userName: '', avatars: [] };
};

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const isAllowedImageFile = (file: File) => {
  if (ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) return true;

  const fileName = file.name.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension));
};

export function CreatePostFlowWidget() {
  const router = useRouter();
  const { locale } = useLocale();
  const file_input_ref = useRef<HTMLInputElement>(null);
  const photos_ref = useRef<PhotoItem[]>([]);
  const is_draft_bootstrapped_ref = useRef(false);
  const pending_navigation_ref = useRef<string | null>(null);
  const allow_unload_ref = useRef(false);
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
    resetFlow,
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
  const myProfileQuery = useQuery<LocalProfile, ApiError>({
    queryKey: myProfileQueryKey,
    queryFn: fetchCreatePostProfile,
    retry: false,
  });
  const profile = myProfileQuery.data;
  const dictionary = useDictionary(createPostFlowContent);
  const has_unsaved_changes =
    photos.length > 0 || description.trim().length > 0 || location.trim().length > 0;
  const profile_avatar = useMemo(() => {
    const avatars = profile?.avatars;
    if (!avatars?.length) return undefined;
    return avatars.find((avatar) => avatar.width === 192)?.url ?? avatars[0]?.url ?? undefined;
  }, [profile?.avatars]);

  useEffect(() => {
    photos_ref.current = photos;
  }, [photos]);

  const release_revokable_photos = useCallback((items: PhotoItem[]) => {
    items.forEach((photo) => {
      if (photo.revokable) {
        URL.revokeObjectURL(photo.preview_url);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      release_revokable_photos(photos_ref.current);
    };
  }, [release_revokable_photos]);

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

  useEffect(() => {
    const handle_before_unload = (event: BeforeUnloadEvent) => {
      if (allow_unload_ref.current) return;
      if (!has_unsaved_changes) return;

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handle_before_unload);

    return () => {
      window.removeEventListener('beforeunload', handle_before_unload);
    };
  }, [has_unsaved_changes]);

  useEffect(() => {
    const handle_link_click = (event: MouseEvent) => {
      if (!has_unsaved_changes || show_close_confirm) return;
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const next_url = new URL(href, window.location.href);
      if (next_url.href === window.location.href) return;

      event.preventDefault();
      pending_navigation_ref.current =
        next_url.origin === window.location.origin
          ? `${next_url.pathname}${next_url.search}${next_url.hash}`
          : next_url.href;
      setShowCloseConfirm(true);
    };

    document.addEventListener('click', handle_link_click, true);

    return () => {
      document.removeEventListener('click', handle_link_click, true);
    };
  }, [has_unsaved_changes, setShowCloseConfirm, show_close_confirm]);

  const add_photos = async (new_files: File[]) => {
    if (new_files.length === 0) return;

    const wrong_file = new_files.find(
      (file) => !isAllowedImageFile(file) || file.size > MAX_FILE_SIZE,
    );

    if (wrong_file) {
      setValidationMessage(dictionary.invalidPhotoMessage.value);
      return;
    }

    if (photos.length + new_files.length > MAX_FILES_COUNT) {
      setValidationMessage(dictionary.maxPhotosMessage.value);
      return;
    }

    setIsUploading(true);

    try {
      const uploaded_images = await uploadPostImages(new_files);
      const mapped = new_files.map((file, index) => {
        const uploaded = uploaded_images[index];
        const preview_url =
          uploaded && typeof uploaded.url === 'string' && uploaded.url.length > 0
            ? uploaded.url
            : URL.createObjectURL(file);

        return {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          upload_id: uploaded?.uploadId ?? null,
          preview_url,
          revokable: preview_url.startsWith('blob:'),
        };
      });

      const has_missed_upload_id = mapped.some((item) => item.upload_id === null);
      if (has_missed_upload_id) {
        setValidationMessage(dictionary.uploadFailedMessage.value);
        mapped.forEach((item) => {
          if (item.revokable) URL.revokeObjectURL(item.preview_url);
        });
        return;
      }

      setPhotos((prev) => [...prev, ...mapped]);
      setActivePhotoId(active_photo_id ?? mapped[0]?.id ?? null);
      setStep('crop');
    } catch (error) {
      setValidationMessage(getCreatePostErrorMessage(error, dictionary.invalidPhotoMessage.value));
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
    if (step === 'crop') {
      pending_navigation_ref.current = getLocalizedUrl('/', locale);
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

  const navigate_after_close = () => {
    const raw_target = pending_navigation_ref.current ?? getLocalizedUrl('/', locale);
    pending_navigation_ref.current = null;
    allow_unload_ref.current = true;
    const normalized = new URL(raw_target, window.location.href);

    if (normalized.origin === window.location.origin) {
      router.push(`${normalized.pathname}${normalized.search}${normalized.hash}`);
      return;
    }

    window.location.assign(normalized.href);
  };

  const save_draft = async () => {
    try {
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
      setShowCloseConfirm(false);
      navigate_after_close();
    } catch {
      setValidationMessage(dictionary.draftSaveFailedMessage.value);
    }
  };

  const open_draft = useCallback(() => {
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
    setShowCloseConfirm(false);
    pending_navigation_ref.current = null;
  }, [
    setActivePhotoId,
    setAspectRatio,
    setDescription,
    setFilterId,
    setHasDraft,
    setPhotos,
    setShowCloseConfirm,
    setStep,
    setZoom,
  ]);

  useEffect(() => {
    if (is_draft_bootstrapped_ref.current) return;
    is_draft_bootstrapped_ref.current = true;

    const parsed_draft = readDraft(DRAFT_STORAGE_KEY);
    setHasDraft(Boolean(parsed_draft));

    if (parsed_draft) {
      open_draft();
    }
  }, [open_draft, setHasDraft]);

  const publish_post = async () => {
    const upload_ids = photos
      .map((photo) => photo.upload_id)
      .filter((upload_id): upload_id is string => Boolean(upload_id));

    if (upload_ids.length === 0) {
      setValidationMessage(dictionary.noPhotosBeforePublishingMessage.value);
      return;
    }
    if (description.trim().length === 0) {
      setValidationMessage(dictionary.descriptionRequiredMessage.value);
      return;
    }

    setIsPublishing(true);

    try {
      await createPost({
        description: description.trim(),
        childrenMetadata: upload_ids.map((uploadId) => ({ uploadId })),
      });

      release_revokable_photos(photos_ref.current);
      clearDraft(DRAFT_STORAGE_KEY);
      resetFlow();
      pending_navigation_ref.current = null;
      allow_unload_ref.current = true;
      router.push(getLocalizedUrl('/', locale));
    } catch (error) {
      setValidationMessage(getCreatePostErrorMessage(error, dictionary.publishFailedMessage.value));
    } finally {
      setIsPublishing(false);
    }
  };

  const remove_photo = async (photo_id: string) => {
    const photo_to_remove = photos.find((photo) => photo.id === photo_id);
    if (!photo_to_remove) return;

    const next_photos = photos.filter((photo) => photo.id !== photo_id);
    setPhotos(next_photos);

    if (photo_to_remove.revokable) {
      URL.revokeObjectURL(photo_to_remove.preview_url);
    }

    if (next_photos.length === 0) {
      clearDraft(DRAFT_STORAGE_KEY);
      setHasDraft(false);
      setActivePhotoId(null);
      setShowCropGallery(false);
      setStep('upload');
    } else if (active_photo_id === photo_id) {
      const removed_index = photos.findIndex((photo) => photo.id === photo_id);
      const next_index = Math.min(removed_index, next_photos.length - 1);
      setActivePhotoId(next_photos[next_index]?.id ?? next_photos[0]?.id ?? null);
    }

    if (photo_to_remove.upload_id) {
      void deletePostImage(photo_to_remove.upload_id).catch(() => {
        // Keep UI flow smooth even when backend image cleanup fails.
      });
    }
  };

  const can_go_next = photos.length > 0 && step !== 'publish' && !is_uploading && !is_publishing;
  const can_publish = photos.length > 0 && description.trim().length > 0;
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
          pending_navigation_ref.current = getLocalizedUrl('/', locale);
          setShowCloseConfirm(true);
        }
      }}
    >
      <input
        ref={file_input_ref}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
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
          canPublish={can_publish}
          isPublishing={is_publishing}
          isUploading={is_uploading}
          onBack={handle_back}
          onClose={() => {
            pending_navigation_ref.current = getLocalizedUrl('/', locale);
            setShowCloseConfirm(true);
          }}
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
            profileAvatar={profile_avatar}
            profileUsername={profile?.userName ?? ''}
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
        onContinueEditing={() => {
          pending_navigation_ref.current = null;
          setShowCloseConfirm(false);
        }}
        onDiscardChanges={() => {
          release_revokable_photos(photos_ref.current);
          clearDraft(DRAFT_STORAGE_KEY);
          resetFlow();
          setShowCloseConfirm(false);
          navigate_after_close();
        }}
        onCloseValidation={() => setValidationMessage(null)}
        onSaveDraft={() => void save_draft()}
        showCloseConfirm={show_close_confirm}
        validationMessage={validation_message}
      />
    </section>
  );
}
