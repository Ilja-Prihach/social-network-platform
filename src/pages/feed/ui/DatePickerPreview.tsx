'use client';

import { useState } from 'react';
import { DatePicker } from '@/shared/ui/DatePicker';
import styles from './FeedPage.module.scss';

type DateRange = {
  start: Date | null;
  end: Date | null;
};

export const DatePickerPreview = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const month_start = new Date(today.getFullYear(), today.getMonth(), 1);
  const month_end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [range, set_range] = useState<DateRange>({
    start: new Date(2022, 11, 28),
    end: new Date(2023, 0, 10),
  });

  const range_presets: { label: string; value: DateRange }[] = [
    { label: 'Today', value: { start: today, end: today } },
    {
      label: 'Last 7 days',
      value: {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
        end: today,
      },
    },
    { label: 'This month', value: { start: month_start, end: month_end } },
    { label: 'Clear', value: { start: null, end: null } },
  ];

  return (
    <div className={styles.picker_preview}>
      <DatePicker value={range} onChange={set_range} presets={range_presets} />
      <DatePicker label="Date select (range only)" value={range} onChange={set_range} />
      <DatePicker
        label="Date select (error)"
        value={{ start: null, end: null }}
        onChange={set_range}
        error="Please choose a valid date range"
      />
      <DatePicker
        label="Date select (disabled)"
        value={{ start: new Date(2022, 11, 22), end: null }}
        onChange={set_range}
        disabled
      />
      <p className={styles.keyboard_hint}>
        Keyboard: Enter/Space to open and select, arrows to move, Home/End by week, PageUp/PageDown
        by month, Esc to close. Click month/year label to open year picker.
      </p>
    </div>
  );
};
