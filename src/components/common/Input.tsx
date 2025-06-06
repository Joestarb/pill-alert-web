import React from 'react';
import { InputProps } from '../../interfaces/components';


const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  label,
  name,
  className = '',
  required = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default Input;