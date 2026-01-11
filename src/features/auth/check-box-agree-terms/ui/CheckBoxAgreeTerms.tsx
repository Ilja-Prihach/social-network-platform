import { CheckBox } from '@/shared/ui/CheckBox';

type Props = {
  checked: boolean;
  error?: boolean;
  onChangeAction: (v: boolean) => void;
  label?: string;
};

export const CheckBoxAgreeTerms = ({ checked, error, onChangeAction, label }: Props) => {
  return <CheckBox checked={checked} onChange={onChangeAction} error={error} label={label} />;
};
