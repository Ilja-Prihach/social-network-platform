'use client';

import { useDictionary, useLocale } from 'next-intlayer';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import datePickerContent from './DatePicker.content';
import styles from './DatePicker.module.scss';

type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DatePreset = {
  label: string;
  value: DateRange;
};

type DatePickerProps = {
  label?: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
  selectionMode?: 'range' | 'single';
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  presets?: DatePreset[];
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
};

const LOCALE_TAGS: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  ru: 'ru-RU',
  it: 'it-IT',
  he: 'he-IL',
};

const FIRST_DAY_OF_WEEK: Record<string, number> = {
  en: 0,
  fr: 1,
  es: 1,
  ru: 1,
  it: 1,
  he: 0,
};

const normalize_date = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const format_key = (date: Date) => {
  const normalized = normalize_date(date);
  const yyyy = normalized.getFullYear();
  const mm = String(normalized.getMonth() + 1).padStart(2, '0');
  const dd = String(normalized.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const add_days = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
const start_of_week = (date: Date, first_day_of_week: number) =>
  add_days(date, -((date.getDay() - first_day_of_week + 7) % 7));
const end_of_week = (date: Date, first_day_of_week: number) =>
  add_days(start_of_week(date, first_day_of_week), 6);

const is_same_day = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const is_between = (date: Date, start: Date, end: Date) => {
  const ts = normalize_date(date).getTime();
  const start_ts = normalize_date(start).getTime();
  const end_ts = normalize_date(end).getTime();
  return ts > start_ts && ts < end_ts;
};

const get_locale_tag = (locale: string) => LOCALE_TAGS[locale] ?? LOCALE_TAGS.en;
const get_first_day_of_week = (locale: string) => FIRST_DAY_OF_WEEK[locale] ?? 1;

const get_day_labels = (locale: string, first_day_of_week: number) => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const base = new Date(2024, 0, 7); // Sunday
  return Array.from({ length: 7 }, (_, index) => {
    const day_index = (first_day_of_week + index) % 7;
    return formatter.format(add_days(base, day_index));
  });
};

const to_input_value = (range: DateRange, formatter: Intl.DateTimeFormat) => {
  if (range.start && range.end)
    return `${formatter.format(range.start)} - ${formatter.format(range.end)}`;
  if (range.start) return formatter.format(range.start);
  return '';
};

const get_month_grid = (view_date: Date, first_day_of_week: number) => {
  const first = new Date(view_date.getFullYear(), view_date.getMonth(), 1);
  const first_day = (first.getDay() - first_day_of_week + 7) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - first_day);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export const DatePicker = ({
  label,
  value,
  onChange,
  selectionMode = 'range',
  disabled = false,
  error,
  placeholder,
  presets = [],
  minDate,
  maxDate,
  isDateDisabled,
}: DatePickerProps) => {
  const content = useDictionary(datePickerContent);
  const { locale } = useLocale();

  const locale_tag = useMemo(() => get_locale_tag(locale), [locale]);
  const first_day_of_week = useMemo(() => get_first_day_of_week(locale), [locale]);
  const day_labels = useMemo(
    () => get_day_labels(locale_tag, first_day_of_week),
    [locale_tag, first_day_of_week],
  );
  const date_formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale_tag, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [locale_tag],
  );
  const day_aria_formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale_tag, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [locale_tag],
  );

  const root_ref = useRef<HTMLDivElement>(null);
  const popup_ref = useRef<HTMLDivElement>(null);
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const day_refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const year_refs = useRef<Record<number, HTMLButtonElement | null>>({});

  const [is_open, set_is_open] = useState(false);
  const [is_year_picker_open, set_is_year_picker_open] = useState(false);
  const [view_date, set_view_date] = useState<Date>(value.start ?? new Date());
  const [focused_date, set_focused_date] = useState<Date>(value.start ?? new Date());
  const [month_animation, set_month_animation] = useState<'next' | 'prev' | null>(null);

  const current_year = new Date().getFullYear();
  const year_options = useMemo(() => {
    return Array.from({ length: 121 }, (_, index) => current_year - 100 + index);
  }, [current_year]);

  const month_title = useMemo(() => {
    return view_date.toLocaleDateString(locale_tag, { month: 'long', year: 'numeric' });
  }, [locale_tag, view_date]);

  const days = useMemo(
    () => get_month_grid(view_date, first_day_of_week),
    [view_date, first_day_of_week],
  );
  const weeks = useMemo(
    () => Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
    [days],
  );

  const min_date_ts = minDate ? normalize_date(minDate).getTime() : null;
  const max_date_ts = maxDate ? normalize_date(maxDate).getTime() : null;

  const is_day_disabled = (date: Date) => {
    const ts = normalize_date(date).getTime();
    if (min_date_ts !== null && ts < min_date_ts) return true;
    if (max_date_ts !== null && ts > max_date_ts) return true;
    if (isDateDisabled?.(normalize_date(date))) return true;
    return false;
  };

  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (!root_ref.current?.contains(event.target as Node)) {
        set_is_open(false);
        set_is_year_picker_open(false);
      }
    };

    document.addEventListener('mousedown', handle_click_outside);
    return () => document.removeEventListener('mousedown', handle_click_outside);
  }, []);

  useEffect(() => {
    if (!is_open) return;
    const key = format_key(focused_date);
    day_refs.current[key]?.focus();
  }, [focused_date, is_open]);

  useEffect(() => {
    if (!is_year_picker_open) return;
    const active_year = view_date.getFullYear();
    year_refs.current[active_year]?.scrollIntoView({ block: 'center' });
  }, [is_year_picker_open, view_date]);

  const open_popup = () => {
    if (disabled) return;
    const anchor = value.end ?? value.start ?? new Date();
    set_view_date(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    set_focused_date(anchor);
    set_is_year_picker_open(false);
    set_is_open(true);
  };

  const close_popup = (restore_focus = true) => {
    set_is_open(false);
    set_is_year_picker_open(false);
    if (restore_focus) {
      trigger_ref.current?.focus();
    }
  };

  const toggle_open = () => {
    if (is_open) {
      close_popup();
      return;
    }
    open_popup();
  };

  const select_day = (date: Date) => {
    if (disabled) return;
    if (is_day_disabled(date)) return;

    const picked = normalize_date(date);
    set_focused_date(picked);
    set_view_date(new Date(picked.getFullYear(), picked.getMonth(), 1));

    if (selectionMode === 'single') {
      onChange({ start: picked, end: null });
      close_popup();
      return;
    }

    if (!value.start || value.end) {
      onChange({ start: picked, end: null });
      return;
    }

    if (picked.getTime() < value.start.getTime()) {
      onChange({ start: picked, end: value.start });
      return;
    }

    onChange({ start: value.start, end: picked });
  };

  const move_month = (delta: number) => {
    set_month_animation(delta >= 0 ? 'next' : 'prev');
    set_view_date((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    set_is_year_picker_open(false);
  };

  const move_focus = (next_date: Date) => {
    set_focused_date(next_date);
    if (
      next_date.getMonth() !== view_date.getMonth() ||
      next_date.getFullYear() !== view_date.getFullYear()
    ) {
      set_view_date(new Date(next_date.getFullYear(), next_date.getMonth(), 1));
    }
  };

  const handle_select_year = (year: number) => {
    set_month_animation(year >= view_date.getFullYear() ? 'next' : 'prev');
    set_view_date((prev) => new Date(year, prev.getMonth(), 1));
    set_is_year_picker_open(false);
  };

  const apply_preset = (preset: DatePreset) => {
    if (disabled) return;

    const normalized_start = preset.value.start ? normalize_date(preset.value.start) : null;
    const normalized_end = preset.value.end ? normalize_date(preset.value.end) : null;

    const safe_start =
      normalized_start && !is_day_disabled(normalized_start) ? normalized_start : null;
    const safe_end = normalized_end && !is_day_disabled(normalized_end) ? normalized_end : null;

    let next_range: DateRange = {
      start: safe_start,
      end: selectionMode === 'single' ? null : safe_end,
    };

    if (
      selectionMode === 'range' &&
      next_range.start &&
      next_range.end &&
      next_range.start.getTime() > next_range.end.getTime()
    ) {
      next_range = { start: next_range.end, end: next_range.start };
    }

    onChange(next_range);

    const anchor = next_range.end ?? next_range.start;
    if (!anchor) return;
    set_focused_date(anchor);
    set_view_date(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  };

  const handle_trigger_key_down = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      open_popup();
    }
  };

  const handle_day_key_down = (event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) => {
    if (disabled) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close_popup();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select_day(date);
      return;
    }

    let next_date: Date | null = null;

    if (event.key === 'ArrowRight') next_date = add_days(date, 1);
    if (event.key === 'ArrowLeft') next_date = add_days(date, -1);
    if (event.key === 'ArrowDown') next_date = add_days(date, 7);
    if (event.key === 'ArrowUp') next_date = add_days(date, -7);
    if (event.key === 'Home') next_date = start_of_week(date, first_day_of_week);
    if (event.key === 'End') next_date = end_of_week(date, first_day_of_week);
    if (event.key === 'PageDown')
      next_date = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (event.key === 'PageUp')
      next_date = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());

    if (next_date) {
      event.preventDefault();
      move_focus(normalize_date(next_date));
    }
  };

  const handle_popup_key_down = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close_popup();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable =
      popup_ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const fallback_label_text =
    selectionMode === 'single' ? content.defaultLabelSingle.value : content.defaultLabelRange.value;
  const fallback_placeholder_text =
    selectionMode === 'single' ? content.placeholderSingle.value : content.placeholderRange.value;
  const calendar_label = content.calendar.value;
  const prev_month_label = content.previousMonth.value;
  const next_month_label = content.nextMonth.value;
  const select_year_label = content.selectYear.value;

  return (
    <div
      className={`${styles.wrapper} ${selectionMode === 'single' ? styles.wrapper_single : styles.wrapper_range}`}
      ref={root_ref}
    >
      <label className={styles.label}>{label ?? fallback_label_text}</label>
      <button
        ref={trigger_ref}
        type="button"
        className={`${styles.trigger} ${error ? styles.trigger_error : ''} ${disabled ? styles.trigger_disabled : ''}`}
        onClick={toggle_open}
        onKeyDown={handle_trigger_key_down}
        disabled={disabled}
        aria-expanded={is_open}
        aria-haspopup="dialog"
        aria-label={label ?? fallback_label_text}
      >
        <span className={styles.value}>
          {to_input_value(value, date_formatter) || placeholder || fallback_placeholder_text}
        </span>
        <span className={styles.icon} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 2v2M17 2v2M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}

      {is_open && (
        <div
          ref={popup_ref}
          className={styles.popup}
          role="dialog"
          aria-modal="false"
          aria-label={calendar_label}
          onKeyDown={handle_popup_key_down}
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.chevron}
              onClick={() => move_month(-1)}
              aria-label={prev_month_label}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="m15 18-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={styles.month_button}
              onClick={() => set_is_year_picker_open((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={is_year_picker_open}
            >
              <strong className={styles.month}>{month_title}</strong>
            </button>
            <button
              type="button"
              className={styles.chevron}
              onClick={() => move_month(1)}
              aria-label={next_month_label}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="m9 6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {is_year_picker_open && (
            <div className={styles.year_picker} role="listbox" aria-label={select_year_label}>
              {year_options.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`${styles.year_button} ${year === view_date.getFullYear() ? styles.year_button_active : ''}`}
                  onClick={() => handle_select_year(year)}
                  role="option"
                  aria-selected={year === view_date.getFullYear()}
                  ref={(node) => {
                    year_refs.current[year] = node;
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          <div className={styles.weekdays} role="row">
            {day_labels.map((day) => (
              <span key={day} className={styles.weekday} role="columnheader">
                {day}
              </span>
            ))}
          </div>

          <div className={styles.grid_viewport}>
            <div
              role="grid"
              aria-label={calendar_label}
              className={`${styles.grid} ${month_animation === 'next' ? styles.grid_slide_next : ''} ${month_animation === 'prev' ? styles.grid_slide_prev : ''}`}
              onAnimationEnd={() => set_month_animation(null)}
            >
              {weeks.map((week, week_index) => (
                <div
                  key={`${view_date.getFullYear()}-${view_date.getMonth()}-${week_index}`}
                  className={styles.week}
                  role="row"
                >
                  {week.map((date) => {
                    const is_other_month = date.getMonth() !== view_date.getMonth();
                    const is_weekend = date.getDay() === 0 || date.getDay() === 6;
                    const is_today = is_same_day(date, new Date());
                    const is_start = value.start ? is_same_day(date, value.start) : false;
                    const is_end =
                      selectionMode === 'range' && value.end ? is_same_day(date, value.end) : false;
                    const is_single_selected = selectionMode === 'single' && is_start;
                    const in_range =
                      selectionMode === 'range' && value.start && value.end
                        ? is_between(date, value.start, value.end)
                        : false;
                    const day_key = format_key(date);
                    const is_focused = is_same_day(date, focused_date);
                    const day_disabled = is_day_disabled(date);

                    const day_class = [
                      styles.day,
                      is_other_month ? styles.day_other : '',
                      is_weekend ? styles.day_weekend : '',
                      is_today ? styles.day_today : '',
                      in_range ? styles.day_range : '',
                      selectionMode === 'range' && is_start ? styles.day_selected_start : '',
                      selectionMode === 'range' && is_end ? styles.day_selected_end : '',
                      is_single_selected ? styles.day_selected_single : '',
                      is_start || is_end ? styles.day_selected : '',
                      is_focused ? styles.day_focused : '',
                      day_disabled ? styles.day_disabled : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <button
                        key={day_key}
                        type="button"
                        role="gridcell"
                        className={day_class}
                        ref={(node) => {
                          day_refs.current[day_key] = node;
                        }}
                        onClick={() => select_day(date)}
                        onKeyDown={(event) => handle_day_key_down(event, date)}
                        onMouseEnter={() => {
                          if (!day_disabled) {
                            set_focused_date(date);
                          }
                        }}
                        tabIndex={is_focused && !day_disabled ? 0 : -1}
                        aria-selected={Boolean(
                          is_start || is_end || in_range || is_single_selected,
                        )}
                        aria-current={is_today ? 'date' : undefined}
                        aria-label={day_aria_formatter.format(date)}
                        disabled={day_disabled}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {presets.length > 0 && (
            <div className={styles.preset_list}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={styles.preset_button}
                  onClick={() => apply_preset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
