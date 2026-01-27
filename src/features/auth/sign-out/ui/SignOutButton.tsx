'use client';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { useSignOut } from '../model/useSignOut';

type SignOutButtonProps = {
  label: string;
  className?: string;
  iconClassName?: string;
};

export const SignOutButton = ({ label, className, iconClassName }: SignOutButtonProps) => {
  const { signOut, isLoading } = useSignOut();

  return (
    <Button
      variant="text"
      className={className}
      onClick={signOut}
      disabled={isLoading}
      type="button"
    >
      <div className={iconClassName}>
        <Icon iconId="log-out-outline" />
      </div>
      <span>{label}</span>
    </Button>
  );
};
