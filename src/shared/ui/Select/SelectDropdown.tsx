import React from 'react';
import { Option } from './Select.ts';

import plusIconSrc from '@/assets/icons/plus.svg';

interface SelectDropdownProps {
  combobox: boolean;
  inputValue: string;
  filteredOptions: Option[];
  selectedValues: (string | number)[];
  onCreateOption: () => void;
  onSelect: (value: string | number) => void;
  optionRender?: (option: Option, isSelected: boolean) => React.ReactNode;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  combobox,
  inputValue,
  filteredOptions,
  selectedValues,
  onCreateOption,
  onSelect,
  optionRender,
}) => (
  <ul className="select-dropdown">
    {filteredOptions.map(option => {
      const isSelected = selectedValues.includes(option.value);
      return (
        <li
          className={`select-option ${option.disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          key={option.value}
          onClick={() => !option.disabled && onSelect(option.value)}
        >
          {optionRender ? optionRender(option, isSelected) : <div>{option.label}</div>}
        </li>
      );
    })}

    {combobox && inputValue && !filteredOptions.some(option => option.label.toLowerCase() === inputValue.toLowerCase()) && (
      <li className="select-option create-option" onClick={onCreateOption}>
        <img
          alt={`Add ${inputValue}`}
          src={plusIconSrc}
        />

        <span>
          Создать «{inputValue}»
        </span>
      </li>
    )}
  </ul>
);

export default SelectDropdown;
