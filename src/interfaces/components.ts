export interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
  className?: string;
  required: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type: 'button' | 'submit' | 'reset';
  className?: string;
  disabled: boolean;
  variant: 'primary' | 'secondary' | 'tertiary'|'cuarteatry';
}