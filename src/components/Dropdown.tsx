import React from 'react';
import { DropdownProps } from '@/types/FormField';


const Dropdown: React.FC<DropdownProps> = ({ id, value, onChange, options }) => {
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor={id}>
        Preferred Game
      </label>
      <select
        id={id}
        value={value}
        onChange={handleDropdownChange}
        className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
