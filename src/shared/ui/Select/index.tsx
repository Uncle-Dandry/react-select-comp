import React, {
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

export interface SelectProps {
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  combobox?: boolean;
  value?: string | number | (string | number)[];
  options: Option[];
  placeholder?: string;
  hint?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
  onStartCreateOption?: (value: string) => Promise<void>;
  onCreateOption?: (newOption: Option) => void;
  dropdownRender?: (props: {
    options: Option[];
    selectedValues: (string | number)[];
    onSelect: (value: string | number) => void;
  }) => React.ReactNode;
  optionRender?: (option: Option) => React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | number | (string | number)[]>(value || (multiple ? [] : ''));
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(initialOptions);
  const [hasError, setHasError] = useState(error);

  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFilled = useMemo(
    () => multiple
      ? (selectedValue as (string | number)[]).length > 0
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
      if (searchable && !disabled) {
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
    (selected: string | number) => {
      if (multiple) {
        const newValue = (selectedValue as (string | number)[]).includes(selected)
          ? (selectedValue as (string | number)[]).filter(val => val !== selected)
          : [...(selectedValue as (string | number)[]), selected];

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

      const newOption: Option = {
        label: inputValue,
        value: inputValue,
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
      (selectedValue as (string | number)[]).map(val => (
        <SelectChip
          key={val}
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
      ? (selectedValue as (string | number)[])
      : [selectedValue as (string | number)],
    [multiple, selectedValue],
  );

  const dropdownContent = useMemo(
    () => (
      <SelectDropdown
        combobox={combobox}
        inputValue={inputValue}
        filteredOptions={filteredOptions}
        selectedValues={selectedValues}
        onCreateOption={handleCreateOption}
        onSelect={handleSelect}
        optionRender={optionRender}
      />
    ),
    [
      combobox,
      inputValue,
      filteredOptions,
      selectedValues,
      handleCreateOption,
      handleSelect,
      optionRender
    ],
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
        withChips={multiple && (selectedValue as (string | number)[]).length > 0}
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
          }) : dropdownContent
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
