import { type FC } from 'react';

import { Option } from './Select';

import removeSrc from '@/assets/icons/cross.svg';

interface SelectChipProps {
  option?: Option;
  onRemove: () => void;
}

const SelectChip: FC<SelectChipProps> = ({ option, onRemove }) => {
  return (
    <div className="select-chip">
      {Boolean(option?.avatarSrc) && typeof option?.avatarSrc === 'string' && (
        <img
          className="select-chip-avatar"
          alt={`${option.label} avatar`}
          src={option.avatarSrc}
        />
      )}

      <span className="select-chip-name">
        {option?.label}
      </span>

      <button className="select-chip-remove" onClick={onRemove}>
        <img
          alt="Remove chip"
          src={removeSrc}
        />
      </button>
    </div>
  );
};

export default SelectChip;
