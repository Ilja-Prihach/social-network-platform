export type Step = 'upload' | 'crop' | 'filters' | 'publish';

export type AspectRatio = 'original' | '1:1' | '4:5' | '16:9';

export type FilterId =
  | 'normal'
  | 'clarendon'
  | 'lark'
  | 'gingham'
  | 'moon'
  | 'valencia'
  | 'juno'
  | 'reyes'
  | 'ludwig';

export type PhotoItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  upload_id: string | null;
  preview_url: string;
  revokable: boolean;
};

export type DraftPhoto = Omit<PhotoItem, 'revokable'>;

export type CreateDraft = {
  step: Step;
  aspect_ratio: AspectRatio;
  zoom: number;
  filter_id: FilterId;
  description: string;
  photos: DraftPhoto[];
};

export type FilterPreset = {
  id: FilterId;
  label: string;
  css: string;
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const MAX_FILES_COUNT = 10;
export const DRAFT_STORAGE_KEY = 'create_post_draft_v1';

export const filters: FilterPreset[] = [
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

export const ratios: AspectRatio[] = ['original', '1:1', '4:5', '16:9'];

export const steps: Step[] = ['upload', 'crop', 'filters', 'publish'];

export const ratio_to_value: Record<Exclude<AspectRatio, 'original'>, number> = {
  '1:1': 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
};
