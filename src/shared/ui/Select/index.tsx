import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
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

  const isActive = isOpen;

  const isFilled = multiple
    ? (selectedValue as (string | number)[]).length > 0
    : Boolean(selectedValue);

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  };

  const handleSelectContainerClick = () => {
    if (searchable && !disabled) {
      inputRef.current?.focus();
    } else if (!disabled && !isOpen) {
      handleToggleDropdown();
    }
  };

  const handleSelect = (selected: string | number) => {
    if (multiple) {
      const newValue = (selectedValue as (string | number)[]).includes(selected)
        ? (selectedValue as (string | number)[]).filter(val => val !== selected)
        : [...(selectedValue as (string | number)[]), selected];

      setSelectedValue(newValue);
      if (onChange) onChange(newValue);
      setInputValue('');
    } else {
      setSelectedValue(selected);
      if (onChange) onChange(selected);
      setIsOpen(false);
      setInputValue(options.find(opt => opt.value === selected)?.label || '');
    }

    setFilteredOptions(options);
    setHasError(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const newFilteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(newFilteredOptions);

    const exactMatch = options.some(option => option.label.toLowerCase() === value.toLowerCase());

    if (combobox && value && !exactMatch) {
      setHasError(false);
    } else if (!combobox && newFilteredOptions.length === 0) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [options, combobox]);

  const handleCreateOption = useCallback(async () => {
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

    if (onCreateOption) {
      onCreateOption(newOption);
    }

    handleSelect(newOption.value);

    if (!multiple) {
      setInputValue(inputValue);
    }
  }, [inputValue, onStartCreateOption, onCreateOption, handleSelect]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
      setInputValue(options.find(opt => opt.value === value)?.label || '');
    }
  }, [value, options]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const renderChips = () => {
    return (
      // <div className="chips-container">
      (selectedValue as (string | number)[]).map(val => (
        <SelectChip
          key={val}
          option={options.find(opt => opt.value === val)}
          onRemove={() => handleSelect(val)}
        />
      ))
      // </div>
    );
  };

  const dropdownContent = (
    <SelectDropdown
      combobox={combobox}
      inputValue={inputValue}
      filteredOptions={filteredOptions}
      selectedValues={
        multiple
          ? (selectedValue as (string | number)[])
          : [selectedValue as (string | number)]
      }
      onCreateOption={handleCreateOption}
      onSelect={handleSelect}
      optionRender={optionRender}
    />
  );

  return (
    <div
      className={`select-container ${
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
        active={isActive}
        searchable={searchable}
        withChips={multiple && (selectedValue as (string | number)[]).length > 0}
        placeholder={placeholder}
        inputValue={inputValue}
        inputRef={inputRef}
        renderChips={renderChips}
        onInputChange={handleInputChange}
        onFocus={handleFocus}
        onToggleDropdown={handleToggleDropdown}
      />

      {isOpen && (
        dropdownRender
          ? dropdownRender(dropdownContent)
          : dropdownContent
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
