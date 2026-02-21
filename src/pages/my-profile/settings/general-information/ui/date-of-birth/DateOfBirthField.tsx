'use client';

import { useMemo, useState } from 'react';
import { DatePicker } from '@/shared/ui/DatePicker';
import { Icon } from '@/shared/ui/Icon';
import { Input } from '@/shared/ui/Input';
import { formatDateOfBirthInputValue, parseDateOfBirthInputValue } from '../../model/dateOfBirth';
import styles from './DateOfBirthField.module.scss';

type DateOfBirthFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
};

export const DateOfBirthField = ({
  label,
  value,
  placeholder,
  error,
  onChange,
}: DateOfBirthFieldProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const selectedDate = useMemo(() => parseDateOfBirthInputValue(value), [value]);

  const onDateSelect = (nextValue: { start: Date | null; end: Date | null }) => {
    if (!nextValue.start) return;
    onChange(formatDateOfBirthInputValue(nextValue.start));
  };

  return (
    <div className={styles.date_of_birth_field}>
      <Input
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        rightIcon={<Icon iconId="calendar-outline" width="20" height="20" />}
        onRightIconClick={() => setIsDatePickerOpen(true)}
      />
      <DatePicker
        className={styles.date_picker_popup}
        value={{ start: selectedDate, end: null }}
        onChange={onDateSelect}
        selectionMode="single"
        isOpen={isDatePickerOpen}
        onOpenChange={setIsDatePickerOpen}
        renderTrigger={false}
      />
    </div>
  );
};
