import React from 'react';
import { ButtonProps } from '../../interfaces/components';



const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',
}) => {
  const baseStyles = `px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed`;
  const variantStyles = {
    primary: `text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 disabled:bg-gray-400`,
    secondary: `text-blue-500 bg-white border border-blue-500 hover:bg-blue-100 focus:ring-blue-500 disabled:bg-gray-100`,
    tertiary: `text-gray-700 bg-transparent hover:text-gray-900 focus:ring-gray-500 disabled:text-gray-400`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;