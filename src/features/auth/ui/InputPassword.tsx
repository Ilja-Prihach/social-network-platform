'use client';

import { useState } from 'react';
import { Input, InputProps } from '@/shared/ui/Input/Input';
import { Icon } from '@/shared/ui/Icon/Icon';

type InputPasswordProps = Omit<InputProps, 'type' | 'rightIcon' | 'onRightIconClick'>;

export const InputPassword = (props: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <Icon
          iconId={showPassword ? 'eye-off-outline' : 'eye-outline'}
          width="20px"
          height="20px"
        />
      }
      onRightIconClick={() => setShowPassword((prev) => !prev)}
    />
  );
};
