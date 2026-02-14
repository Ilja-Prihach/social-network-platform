'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
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
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  presets?: DatePreset[];
};

const day_labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const normalize_date = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const format_key = (date: Date) => normalize_date(date).toISOString().slice(0, 10);
const add_days = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
const start_of_week = (date: Date) => add_days(date, -((date.getDay() + 6) % 7));
const end_of_week = (date: Date) => add_days(start_of_week(date), 6);

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

const to_input_value = (range: DateRange) => {
  const fmt = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  if (range.start && range.end) return `${fmt(range.start)} - ${fmt(range.end)}`;
  if (range.start) return fmt(range.start);
  return '';
};

const get_month_grid = (view_date: Date) => {
  const first = new Date(view_date.getFullYear(), view_date.getMonth(), 1);
  const first_day = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - first_day);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export const DatePicker = ({
  label = 'Date select',
  value,
  onChange,
  disabled = false,
  error,
  placeholder = 'dd/mm/yyyy - dd/mm/yyyy',
  presets = [],
}: DatePickerProps) => {
  const root_ref = useRef<HTMLDivElement>(null);
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const day_refs = useRef<Record<string, HTMLButtonElement | null>>({});
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
    return view_date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [view_date]);

  const days = useMemo(() => get_month_grid(view_date), [view_date]);

  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (!root_ref.current?.contains(event.target as Node)) {
        set_is_open(false);
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

  const open_popup = () => {
    if (disabled) return;
    const anchor = value.end ?? value.start ?? new Date();
    set_view_date(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    set_focused_date(anchor);
    set_is_year_picker_open(false);
    set_is_open(true);
  };

  const close_popup = () => {
    set_is_open(false);
    set_is_year_picker_open(false);
    trigger_ref.current?.focus();
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

    const picked = normalize_date(date);
    set_focused_date(picked);
    set_view_date(new Date(picked.getFullYear(), picked.getMonth(), 1));

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
    const next_range: DateRange = {
      start: preset.value.start ? normalize_date(preset.value.start) : null,
      end: preset.value.end ? normalize_date(preset.value.end) : null,
    };
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
    if (event.key === 'Home') next_date = start_of_week(date);
    if (event.key === 'End') next_date = end_of_week(date);
    if (event.key === 'PageDown')
      next_date = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (event.key === 'PageUp')
      next_date = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());

    if (next_date) {
      event.preventDefault();
      move_focus(normalize_date(next_date));
    }
  };

  return (
    <div className={styles.wrapper} ref={root_ref}>
      <label className={styles.label}>{label}</label>
      <button
        ref={trigger_ref}
        type="button"
        className={`${styles.trigger} ${error ? styles.trigger_error : ''} ${disabled ? styles.trigger_disabled : ''}`}
        onClick={toggle_open}
        onKeyDown={handle_trigger_key_down}
        disabled={disabled}
        aria-expanded={is_open}
        aria-haspopup="dialog"
      >
        <span className={styles.value}>{to_input_value(value) || placeholder}</span>
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
      {error && <span className={styles.error}>{error}</span>}

      {is_open && (
        <div className={styles.popup} role="dialog" aria-label="Calendar">
          <div className={styles.header}>
            <button
              type="button"
              className={styles.chevron}
              onClick={() => move_month(-1)}
              aria-label="Previous month"
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
              aria-label="Next month"
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
            <div className={styles.year_picker} role="listbox" aria-label="Select year">
              {year_options.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`${styles.year_button} ${year === view_date.getFullYear() ? styles.year_button_active : ''}`}
                  onClick={() => handle_select_year(year)}
                  role="option"
                  aria-selected={year === view_date.getFullYear()}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          <div className={styles.weekdays}>
            {day_labels.map((day) => (
              <span key={day} className={styles.weekday}>
                {day}
              </span>
            ))}
          </div>

          <div className={styles.grid_viewport}>
            <div
              className={`${styles.grid} ${month_animation === 'next' ? styles.grid_slide_next : ''} ${month_animation === 'prev' ? styles.grid_slide_prev : ''}`}
              onAnimationEnd={() => set_month_animation(null)}
            >
              {days.map((date) => {
                const is_other_month = date.getMonth() !== view_date.getMonth();
                const is_weekend = date.getDay() === 0 || date.getDay() === 6;
                const is_today = is_same_day(date, new Date());
                const is_start = value.start ? is_same_day(date, value.start) : false;
                const is_end = value.end ? is_same_day(date, value.end) : false;
                const in_range =
                  value.start && value.end ? is_between(date, value.start, value.end) : false;
                const day_key = format_key(date);
                const is_focused = is_same_day(date, focused_date);

                const day_class = [
                  styles.day,
                  is_other_month ? styles.day_other : '',
                  is_weekend ? styles.day_weekend : '',
                  is_today ? styles.day_today : '',
                  in_range ? styles.day_range : '',
                  is_start ? styles.day_selected_start : '',
                  is_end ? styles.day_selected_end : '',
                  is_start || is_end ? styles.day_selected : '',
                  is_focused ? styles.day_focused : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={day_key}
                    type="button"
                    className={day_class}
                    ref={(node) => {
                      day_refs.current[day_key] = node;
                    }}
                    onClick={() => select_day(date)}
                    onKeyDown={(event) => handle_day_key_down(event, date)}
                    onMouseEnter={() => set_focused_date(date)}
                    tabIndex={is_focused ? 0 : -1}
                    aria-pressed={is_start || is_end || in_range}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
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
