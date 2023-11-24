import React from 'react';
import type { TextAreaProps } from '@/types/FormField';


const TextArea: React.FC<TextAreaProps> = ({ label, id, value, onChange, placeholder = '' }) => {
  return (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextArea;