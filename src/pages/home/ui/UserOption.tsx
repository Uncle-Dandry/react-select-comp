import { type FC } from 'react';

import chekIconSrc from '@/assets/icons/checkbox-option.svg';

import styles from './UserOption.module.css';

interface CustomOptionProps {
  selected?: boolean;
  withPadding?: boolean;
  label: string;
  email?: string;
  avatarSrc?: string;
}

const UserOption: FC<CustomOptionProps> = ({
  selected = false,
  withPadding = false,
  label,
  ...optionProps
}, isSelected) => (
  <div className={`${styles.userOptionWrapper} ${withPadding && styles.withPadding}`}>
    <div className={styles.userOptionTag}>
      <span className={styles.userOptionAvatarContainer}>
        {Boolean(optionProps?.avatarSrc) ? (
          <img
            alt={`${label} avatar`}
            src={optionProps.avatarSrc}
          />
        ) : (
          <span>
            {label?.[0]}
          </span>
        )}
      </span>

      <p>
        {label}
      </p>

      {Boolean(optionProps?.email) && (
        <p>
          {optionProps.email}
        </p>
      )}
    </div>

    {isSelected && (
      <img
        className={styles.selectedIndicator}
        alt={`Remove ${label}`}
        src={chekIconSrc}
      />
    )}
  </div>
);

export default UserOption;
