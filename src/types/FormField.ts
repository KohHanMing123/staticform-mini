export interface InputFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
  }

export interface TextAreaProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }

export interface RadioGroupProps {
    label: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
  }
  
export interface DropdownProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
  }

export interface DateInputProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
  }

export interface CheckboxProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string, checked: boolean) => void;
  }