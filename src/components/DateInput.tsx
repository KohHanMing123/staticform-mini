import React from 'react';
import { DateInputProps } from '@/types/FormField';

const DateInput: React.FC<DateInputProps> = ({ id, value, onChange }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor={id}>
        Date of Birth
      </label>
      <input
        className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
        id={id}
        type="date"
        placeholder="Select date"
        value={value}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DateInput;
