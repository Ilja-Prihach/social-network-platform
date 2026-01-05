'use client';

import { useState } from 'react';
import { CheckBox } from '@/shared/ui/CheckBox';

type Props = {
  defaultChecked?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  onChangeAction?: (value: boolean) => void;
};

export const CheckBoxAgreeTerms = ({
  defaultChecked = false,
  disabled,
  error,
  label = '',
  onChangeAction,
}: Props) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (value: boolean) => {
    setChecked(value);
    onChangeAction?.(value);
  };

  return (
    <CheckBox
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      error={error}
      label={label}
    />
  );
};
