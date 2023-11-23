import React from 'react';
import { InputFieldProps } from '@/types/FormField';


const TitleInput: React.FC<InputFieldProps> = ({ label, id, value, onChange, type = 'text', placeholder = '' }) => {
  return (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor={label}>
        {label}
      </label>
      <input
        className="border border-gray-300 rounded w-full py-2 px-3 text-lg text-gray-700 focus:outline-none focus:border-blue-500"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TitleInput;
