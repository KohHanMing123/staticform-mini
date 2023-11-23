import React from 'react';
import { RadioGroupProps } from '@/types/FormField';


const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, selectedValue, onChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-700 mb-2">{label}</label>
      <div className="space-x-4">
        {options.map((option, index) => (
          <label key={index} htmlFor={`radioOption${index}`} className="inline-flex items-center">
            <input
              id={`radioOption${index}`}
              type="radio"
              name="radioOptions"
              value={option.value}
              onChange={handleRadioChange}
              checked={selectedValue === option.value}
            />
            <span className="ml-2 text-black">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
