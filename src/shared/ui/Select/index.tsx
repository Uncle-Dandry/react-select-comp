import {
  type ChangeEvent,
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import SelectControl from './SelectControl';
import SelectDropdown from './SelectDropdown';
import SelectChip from './SelectChip';

import { Option } from './Select.ts';

import './Select.css';

export interface SelectProps<T> {
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  combobox?: boolean;
  value?: T | T[];
  options: Option<T>[];
  placeholder?: string;
  hint?: string;
  onChange?: (value: T | T[]) => void;
  onStartCreateOption?: (value: string) => Promise<void>;
  onCreateOption?: (newOption: Option<T>) => void;
  dropdownRender?: (props: {
    options: Option<T>[];
    selectedValues: T[];
    onSelect: (value: T) => void;
  }) => ReactNode;
  optionRender?: (option: Option<T>) => ReactNode;
}

const Select = <T,>({
  searchable = false,
  multiple = false,
  combobox = false,
  disabled = false,
  error = false,
  placeholder = 'Select...',
  value,
  hint,
  options: initialOptions,
  onChange,
  onStartCreateOption,
  onCreateOption,
  dropdownRender,
  optionRender,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<T | T[]>(
    multiple ? ([] as T[]) : (value || ('' as unknown as T))
  );
  const [options, setOptions] = useState<Option<T>[]>(initialOptions);
  const [filteredOptions, setFilteredOptions] = useState<Option<T>[]>(initialOptions);
  const [hasError, setHasError] = useState(error);

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFilled = useMemo(
    () => multiple
      ? (selectedValue as T[]).length > 0
      : Boolean(selectedValue),
    [multiple, selectedValue],
  );

  const handleToggleDropdown = useCallback(
    () => {
      if (!disabled) {
        setIsOpen(prev => !prev);
      }
    },
    [disabled],
  );

  const handleSelectContainerClick = useCallback(
    () => {
      if (searchable && !disabled && multiple) {
        inputRef.current?.focus();
      }
    },
    [
      searchable,
      disabled,
    ],
  );

  const handleSelectControlClick = useCallback(
    () => {
      if (!searchable) {
        handleToggleDropdown();
      }
    },
    [
      searchable,
      disabled,
      handleToggleDropdown,
    ],
  );

  const handleSelect = useCallback(
    (selected: T) => {
      if (multiple) {
        const newValue = (selectedValue as T[]).includes(selected)
          ? (selectedValue as T[]).filter(val => val !== selected)
          : [...(selectedValue as T[]), selected];

        setSelectedValue(newValue);
        onChange?.(newValue);
        setInputValue('');
      } else {
        setSelectedValue(selected);
        onChange?.(selected);
        setIsOpen(false);
        setInputValue(options.find(opt => opt.value === selected)?.label || '');
      }

      setFilteredOptions(options);
      setHasError(false);
    },
    [
      multiple,
      selectedValue,
      options,
      onChange,
    ],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    [],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      const newFilteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredOptions(newFilteredOptions);

      const exactMatch = options.some(option =>
        option.label.toLowerCase() === value.toLowerCase()
      );

      setHasError(!combobox && newFilteredOptions.length === 0
        || (combobox && !exactMatch));
    },
    [options, combobox],
  );

  const handleCreateOption = useCallback(
    async () => {
      if (!inputValue) return;

      if (onStartCreateOption) {
        try {
          await onStartCreateOption(inputValue);
        } catch (error) {
          return;
        }
      }

      const newOption: Option<T> = {
        label: inputValue,
        value: inputValue as unknown as T,
      };

      setOptions(prevOptions => {
        const newOptionsList = [...prevOptions, newOption];
        setFilteredOptions(newOptionsList);
        return newOptionsList;
      });

      onCreateOption?.(newOption);
      handleSelect(newOption.value);

      if (!multiple) {
        setInputValue(inputValue);
      }
    },
    [
      multiple,
      inputValue,
      onStartCreateOption,
      onCreateOption,
      handleSelect,
    ],
  );

  useEffect(
    () => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [handleClickOutside],
  );

  useEffect(
    () => {
      if (value !== undefined) {
        setSelectedValue(value);
        setInputValue(options.find(opt => opt.value === value)?.label || '');
      }
    },
    [value, options],
  );

  const renderChips = useCallback(
    () => (
      (selectedValue as T[]).map(val => (
        <SelectChip
          key={String(val)}
          option={options.find(opt => opt.value === val)}
          onRemove={() => handleSelect(val)}
        />
      ))
    ),
    [
      selectedValue,
      options,
      handleSelect,
    ],
  );

  const selectedValues = useMemo(
    () => multiple
      ? (selectedValue as T[])
      : [selectedValue as T],
    [multiple, selectedValue],
  );

  return (
    <div
      className={`
        select-container ${
          disabled ? 'select-disabled' : ''
        } ${
          hasError
            ? 'select-error'
            : ''
        } ${
          !searchable
            ? 'select-non-searchable'
            : ''
        }`
      }
      ref={selectRef}
      onClick={handleSelectContainerClick}
    >
      <SelectControl
        isOpen={isOpen}
        disabled={disabled}
        multiple={multiple}
        error={error}
        filled={isFilled}
        active={isOpen}
        searchable={searchable}
        withChips={multiple && (selectedValue as T[]).length > 0}
        placeholder={placeholder}
        inputValue={inputValue}
        inputRef={inputRef}
        renderChips={renderChips}
        onInputChange={handleInputChange}
        onFocus={setIsOpen.bind(null, true)}
        onToggleDropdown={handleToggleDropdown}
        onClick={handleSelectControlClick}
      />

      {isOpen && (
        dropdownRender
          ? dropdownRender({
            options,
            selectedValues,
            onSelect: handleSelect,
          }) : (
            <SelectDropdown
              combobox={combobox}
              inputValue={inputValue}
              filteredOptions={filteredOptions}
              selectedValues={selectedValues}
              onCreateOption={handleCreateOption}
              onSelect={handleSelect}
              optionRender={optionRender}
            />
          )
      )}

      {hint && (
        <div className="select-hint">
          {hint}
        </div>
      )}
    </div>
  );
};

export default Select;
