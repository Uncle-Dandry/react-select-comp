import {
  type ReactNode,
  memo,
} from 'react';

import { Option } from './Select.ts';

import plusIconSrc from '@/assets/icons/plus.svg';

interface SelectDropdownProps<T> {
  combobox: boolean;
  inputValue: string;
  filteredOptions: Option<T>[];
  selectedValues: T[];
  onCreateOption: () => void;
  onSelect: (value: T) => void;
  optionRender?: (option: Option<T>) => ReactNode;
  dropdownRender?: (props: {
    options: Option<T>[];
    selectedValues: T[];
    onSelect: (value: T) => void;
  }) => ReactNode;
}

const SelectDropdown = <T,>({
  combobox,
  inputValue,
  filteredOptions,
  selectedValues,
  onCreateOption,
  onSelect,
  optionRender,
  dropdownRender,
}: SelectDropdownProps<T>) => {
  return (
    <div className="select-dropdown">
      {dropdownRender ? (
        dropdownRender({
          options: filteredOptions,
          selectedValues,
          onSelect,
        })
      ) : (
        <ul>
          {filteredOptions.map(option => (
            <li
              className={`
                select-option ${
                  option.disabled ? 'disabled' : ''
                } ${
                  selectedValues.includes(option.value) ? 'selected' : ''
                }
              `}
              key={option.label}
              onClick={() => !option.disabled && onSelect(option.value)}
            >
              {optionRender
                ? optionRender({
                  ...option,
                  selected: selectedValues.includes(option.value),
                })
                : <div>
                    {option.label}
                  </div>
              }
            </li>
          ))}

          {combobox && inputValue
            && !filteredOptions.some(option => option.label.toLowerCase() === inputValue.toLowerCase())
            && (
              <li className="select-option create-option" onClick={onCreateOption}>
                <img
                  alt={`Add ${inputValue}`}
                  src={plusIconSrc}
                />

                <span>
                  Создать «{inputValue}»
                </span>
              </li>
            )
          }
        </ul>
      )}
    </div>
  );
};

export default memo(SelectDropdown) as typeof SelectDropdown;
