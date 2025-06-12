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
    primary: `text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-gray-300`,
    secondary: `text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 disabled:bg-gray-100`,
    tertiary: `text-gray-800 bg-transparent hover:text-indigo-700 focus:ring-indigo-400 disabled:text-gray-400`,
    cuarteatry: '',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} hover:cursor-pointer ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;