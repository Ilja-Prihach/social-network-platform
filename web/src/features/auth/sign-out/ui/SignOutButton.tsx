'use client';

import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { useSignOut } from '../model/useSignOut';
import { useMe } from '@/features/auth/model/useMe';

type SignOutButtonProps = {
  label: string;
  modalTitle: string;
  modalDescriptionWithEmail: string;
  modalDescription: string;
  modalConfirmText: string;
  modalCancelText: string;
  className?: string;
  iconClassName?: string;
};

const resolveDescription = (
  templateWithEmail: string,
  fallbackTemplate: string,
  email?: string,
): string => {
  const normalizedEmail = email?.trim();
  if (!normalizedEmail) return fallbackTemplate;
  return templateWithEmail.replace('{email}', normalizedEmail);
};

export const SignOutButton = ({
  label,
  modalTitle,
  modalDescriptionWithEmail,
  modalDescription,
  modalConfirmText,
  modalCancelText,
  className,
  iconClassName,
}: SignOutButtonProps) => {
  const { confirmSignOut, isLoading } = useSignOut();
  const { data: me } = useMe();

  const description = resolveDescription(modalDescriptionWithEmail, modalDescription, me?.email);

  const onClick = () => {
    confirmSignOut({
      title: modalTitle,
      description,
      confirmText: modalConfirmText,
      cancelText: modalCancelText,
    });
  };

  return (
    <Button
      variant="sidebar"
      className={className}
      onClick={onClick}
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
