import React from 'react';
import type { CheckboxProps } from '@/types/FormField';


const Checkbox: React.FC<CheckboxProps> = ({ label, id, value, onChange }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value, e.currentTarget.checked);
  };

  return (
    <label htmlFor={id} className="inline-flex items-center">
      <input
        id={id}
        type="checkbox"
        onChange={handleCheckboxChange}
        className="mr-2 h-5 w-5 rounded border-gray-300 focus:outline-none focus:ring-blue-500"
      />
      <span className="text-md text-black">{label}</span>
    </label>
  );
};

export default Checkbox;
