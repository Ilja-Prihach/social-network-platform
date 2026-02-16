'use client';

import { useState } from 'react';
import { DatePicker } from '@/shared/ui/DatePicker';
import styles from './FeedPage.module.scss';
import { useDictionary } from 'next-intlayer';
import feedContent from '../feed.content';

type DateRange = {
  start: Date | null;
  end: Date | null;
};

export const DatePickerPreview = () => {
  const content = useDictionary(feedContent);

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
    { label: content.presetToday, value: { start: today, end: today } },
    {
      label: content.presetLast7Days,
      value: {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
        end: today,
      },
    },
    { label: content.presetThisMonth, value: { start: month_start, end: month_end } },
    { label: content.presetClear, value: { start: null, end: null } },
  ];
  const get_range_error = (value: DateRange) => {
    if (!value.start || !value.end) {
      return content.rangeErrorMessage;
    }
    return undefined;
  };

  return (
    <div className={styles.picker_preview}>
      <DatePicker
        label={content.rangeLabel}
        value={range_value}
        onChange={set_range_value}
        presets={range_presets}
        error={get_range_error(range_value)}
      />
      <DatePicker
        label={content.singleLabel}
        value={single_value}
        onChange={set_single_value}
        selectionMode="single"
      />
      <DatePicker
        label={content.errorLabel}
        value={error_value}
        onChange={set_error_value}
        error={get_range_error(error_value)}
      />
      <p className={styles.keyboard_hint}>{content.errorReason}</p>
      <DatePicker
        label={content.disabledLabel}
        value={{ start: new Date(2022, 11, 22), end: null }}
        onChange={() => undefined}
        disabled
      />
      <p className={styles.keyboard_hint}>{content.keyboardHint}</p>
    </div>
  );
};
