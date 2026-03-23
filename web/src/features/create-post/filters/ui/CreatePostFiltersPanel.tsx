import { filters, type FilterId, type PhotoItem } from '@/features/create-post';
import type { CreatePostStyles } from '@/features/create-post/model/uiTypes';

type Props = {
  activePhoto: PhotoItem;
  filterId: FilterId;
  setFilterId: (value: FilterId) => void;
  styles: CreatePostStyles;
};

export function CreatePostFiltersPanel({ activePhoto, filterId, setFilterId, styles }: Props) {
  return (
    <div className={styles.filter_grid}>
      {filters.map((item) => (
        <button
          type="button"
          key={item.id}
          className={styles.filter_tile}
          data-active={item.id === filterId}
          onClick={() => setFilterId(item.id)}
        >
          <span className={styles.filter_tile_image}>
            <img
              src={activePhoto.preview_url}
              alt={`${item.label} preview`}
              style={{ filter: item.css }}
            />
          </span>
          <span className={styles.filter_tile_label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
