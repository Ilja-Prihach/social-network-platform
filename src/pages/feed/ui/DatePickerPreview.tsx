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

  const [range_value, set_range_value] = useState<DateRange>({
    start: new Date(2022, 11, 28),
    end: new Date(2023, 0, 10),
  });
  const [single_value, set_single_value] = useState<DateRange>({
    start: new Date(2023, 0, 6),
    end: null,
  });
  const [error_value, set_error_value] = useState<DateRange>({
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    end: null,
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
  const get_range_error = (value: DateRange) => {
    if (!value.start || !value.end) {
      return 'Please choose an end date to complete the range.';
    }
    return undefined;
  };

  return (
    <div className={styles.picker_preview}>
      <DatePicker
        label="Date select (range)"
        value={range_value}
        onChange={set_range_value}
        presets={range_presets}
        error={get_range_error(range_value)}
      />
      <DatePicker
        label="Date select (single)"
        value={single_value}
        onChange={set_single_value}
        selectionMode="single"
      />
      <DatePicker
        label="Date select (error)"
        value={error_value}
        onChange={set_error_value}
        error={get_range_error(error_value)}
      />
      <p className={styles.keyboard_hint}>
        Error reason: this example has only a start date selected, but the validation rule requires
        a complete range with both start and end dates.
      </p>
      <DatePicker
        label="Date select (disabled)"
        value={{ start: new Date(2022, 11, 22), end: null }}
        onChange={() => undefined}
        disabled
      />
      <p className={styles.keyboard_hint}>
        Keyboard: Enter/Space to open and select, arrows to move, Home/End by week, PageUp/PageDown
        by month, Esc to close. Click month/year label to open year picker.
      </p>
    </div>
  );
};
