import type {
  ChangeEvent,
  FC,
  RefObject,
} from 'react';

import arrowDownIconSrc from '@/assets/icons/arrow-down.svg';
import searchIconSrc from '@/assets/icons/search.svg';

interface SelectControlProps {
  withChips: boolean;
  searchable: boolean;
  isOpen: boolean;
  error: boolean;
  active: boolean;
  filled: boolean;
  disabled: boolean;
  multiple: boolean;
  inputRef: RefObject<HTMLInputElement>;
  placeholder: string;
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onToggleDropdown: () => void;
  renderChips: () => JSX.Element[];
}

const SelectControl: FC<SelectControlProps> = ({
  withChips,
  searchable,
  error,
  active,
  filled,
  isOpen,
  disabled,
  multiple,
  inputRef,
  placeholder,
  inputValue,
  onInputChange,
  onFocus,
  onToggleDropdown,
  renderChips,
}) => {
  const stateClasses = [
    error ? 'error' : '',
    active ? 'active' : '',
    filled ? 'filled' : '',
    disabled ? 'disabled' : ''
  ].join(' ');

  return (
    <div
      className={`
        select-control${
          isOpen && !searchable
            ? ' open'
            : ''
        } ${
          stateClasses
        } ${
          searchable
            ? 'select-searchable'
            : 'select-non-searchable'
        }${withChips && ' with-chips'}`}
    >
      <div className={multiple ? 'select-multi-container' : 'select-input-wrapper'}>
        {multiple && (
          renderChips()
        )}

        <input
          className={`select-input ${stateClasses}`}
          type="text"
          readOnly={!searchable}
          disabled={disabled}
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          {...(searchable && {
            onFocus: onFocus,
          })}
        />
      </div>

      {!multiple && (
        <div className="select-arrow" onClick={onToggleDropdown}>
          <img
            alt={`${isOpen ? 'Close' : 'Open'} select icon`}
            src={
              searchable && isOpen
                ? searchIconSrc
                : arrowDownIconSrc
            }
          />
        </div>
      )}
    </div>
  );
};

export default SelectControl;
