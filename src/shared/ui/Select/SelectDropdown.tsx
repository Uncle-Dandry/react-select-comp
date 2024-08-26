import {
  type FC,
  type ReactNode,
  memo,
} from 'react';

import { Option } from './Select.ts';

import plusIconSrc from '@/assets/icons/plus.svg';

export interface SelectDropdownProps {
  combobox: boolean;
  inputValue: string;
  filteredOptions: Option[];
  selectedValues: (string | number)[];
  onCreateOption: () => void;
  onSelect: (value: string | number) => void;
  optionRender?: (option: Option) => ReactNode;
  dropdownRender?: (props: {
    options: Option[];
    selectedValues: (string | number)[];
    onSelect: (value: string | number) => void;
  }) => ReactNode;
}

const SelectDropdown: FC<SelectDropdownProps> = ({
  combobox,
  inputValue,
  filteredOptions,
  selectedValues,
  onCreateOption,
  onSelect,
  optionRender,
  dropdownRender,
}) => (
  <div className="select-dropdown">
    {dropdownRender ? (
      dropdownRender({
        options: filteredOptions,
        selectedValues,
        onSelect,
      })
    ) : (
      <ul>
        {filteredOptions.map(option => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <li
              className={`select-option ${option.disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
              key={option.value}
              onClick={() => !option.disabled && onSelect(option.value)}
            >
              {optionRender ? optionRender({ ...option, selected: isSelected }) : <div>{option.label}</div>}
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
    )}
  </div>
);

export default memo(SelectDropdown);
