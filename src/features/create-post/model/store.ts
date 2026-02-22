import { create } from 'zustand';
import { hasStoredDraft } from './draftStorage';
import {
  DRAFT_STORAGE_KEY,
  type AspectRatio,
  type FilterId,
  type PhotoItem,
  type Step,
} from './types';

type Updater<T> = T | ((prev: T) => T);

function resolve<T>(next: Updater<T>, prev: T): T {
  return typeof next === 'function' ? (next as (value: T) => T)(prev) : next;
}

type CreatePostFlowState = {
  active_photo_id: string | null;
  aspect_ratio: AspectRatio;
  crop_gallery_page: number;
  description: string;
  filter_id: FilterId;
  has_draft: boolean;
  is_publishing: boolean;
  is_uploading: boolean;
  location: string;
  photos: PhotoItem[];
  setActivePhotoId: (value: string | null) => void;
  setAspectRatio: (value: AspectRatio) => void;
  setCropGalleryPage: (value: Updater<number>) => void;
  setDescription: (value: string) => void;
  setFilterId: (value: FilterId) => void;
  setHasDraft: (value: boolean) => void;
  setIsPublishing: (value: boolean) => void;
  setIsUploading: (value: boolean) => void;
  setLocation: (value: string) => void;
  setPhotos: (value: Updater<PhotoItem[]>) => void;
  setShowCloseConfirm: (value: boolean) => void;
  setShowCropGallery: (value: Updater<boolean>) => void;
  setShowLocationSuggestions: (value: boolean) => void;
  setShowMobileRatio: (value: Updater<boolean>) => void;
  setShowMobileZoom: (value: Updater<boolean>) => void;
  setStep: (value: Step) => void;
  setValidationMessage: (value: string | null) => void;
  setZoom: (value: number) => void;
  show_close_confirm: boolean;
  show_crop_gallery: boolean;
  show_location_suggestions: boolean;
  show_mobile_ratio: boolean;
  show_mobile_zoom: boolean;
  step: Step;
  validation_message: string | null;
  zoom: number;
};

export const useCreatePostFlowStore = create<CreatePostFlowState>()((set) => ({
  active_photo_id: null,
  aspect_ratio: 'original',
  crop_gallery_page: 0,
  description: '',
  filter_id: 'normal',
  has_draft: hasStoredDraft(DRAFT_STORAGE_KEY),
  is_publishing: false,
  is_uploading: false,
  location: '',
  photos: [],
  setActivePhotoId: (value) => set({ active_photo_id: value }),
  setAspectRatio: (value) => set({ aspect_ratio: value }),
  setCropGalleryPage: (value) =>
    set((state) => ({ crop_gallery_page: resolve<number>(value, state.crop_gallery_page) })),
  setDescription: (value) => set({ description: value }),
  setFilterId: (value) => set({ filter_id: value }),
  setHasDraft: (value) => set({ has_draft: value }),
  setIsPublishing: (value) => set({ is_publishing: value }),
  setIsUploading: (value) => set({ is_uploading: value }),
  setLocation: (value) => set({ location: value }),
  setPhotos: (value) => set((state) => ({ photos: resolve<PhotoItem[]>(value, state.photos) })),
  setShowCloseConfirm: (value) => set({ show_close_confirm: value }),
  setShowCropGallery: (value) =>
    set((state) => ({ show_crop_gallery: resolve<boolean>(value, state.show_crop_gallery) })),
  setShowLocationSuggestions: (value) => set({ show_location_suggestions: value }),
  setShowMobileRatio: (value) =>
    set((state) => ({ show_mobile_ratio: resolve<boolean>(value, state.show_mobile_ratio) })),
  setShowMobileZoom: (value) =>
    set((state) => ({ show_mobile_zoom: resolve<boolean>(value, state.show_mobile_zoom) })),
  setStep: (value) => set({ step: value }),
  setValidationMessage: (value) => set({ validation_message: value }),
  setZoom: (value) => set({ zoom: value }),
  show_close_confirm: false,
  show_crop_gallery: false,
  show_location_suggestions: false,
  show_mobile_ratio: false,
  show_mobile_zoom: false,
  step: 'upload',
  validation_message: null,
  zoom: 1,
}));
