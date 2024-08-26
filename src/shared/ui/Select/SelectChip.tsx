import { Option } from './Select';

import removeSrc from '@/assets/icons/cross.svg';

interface SelectChipProps<T> {
  option?: Option<T>;
  onRemove: () => void;
}

const SelectChip = <T,>({
  option,
  onRemove,
}: SelectChipProps<T>) => {
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
