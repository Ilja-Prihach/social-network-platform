import { MAX_FILES_COUNT, ratios, type AspectRatio } from '@/features/create-post';
import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import createPostFlowContent from '@/widgets/create-post-flow/create-post-flow.content';

type Props = {
  aspectRatio: AspectRatio;
  isUploading: boolean;
  onOpenPicker: () => void;
  photosCount: number;
  setAspectRatio: (value: AspectRatio) => void;
  setZoom: (value: number) => void;
  styles: CreatePostStyles;
  zoom: number;
};

export function CreatePostCropControls({
  aspectRatio,
  isUploading,
  onOpenPicker,
  photosCount,
  setAspectRatio,
  setZoom,
  styles,
  zoom,
}: Props) {
  const dictionary = useDictionary(createPostFlowContent);

  return (
    <>
      <h2 className={styles.section_title}>{dictionary.adjustPhoto}</h2>

      <div className={styles.ratio_list}>
        {ratios.map((ratio) => (
          <Button
            key={ratio}
            variant={aspectRatio === ratio ? 'primary' : 'outline'}
            onClick={() => setAspectRatio(ratio)}
          >
            {ratio}
          </Button>
        ))}
      </div>

      <label className={styles.zoom_label} htmlFor="zoom">
        {dictionary.zoom}
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
        onClick={onOpenPicker}
        disabled={photosCount >= MAX_FILES_COUNT || isUploading}
      >
        {isUploading
          ? dictionary.uploading
          : `${dictionary.addMorePhotos} (${photosCount}/${MAX_FILES_COUNT})`}
      </Button>
    </>
  );
}
