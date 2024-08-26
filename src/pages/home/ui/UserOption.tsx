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
}) => {
  return (
    <div className={`${styles.userOptionWrapper} ${withPadding ? '' : styles.withoutPadding}`}>
      <div className={styles.userOptionTag}>
        <span className={`${styles.userOptionAvatarContainer} ${!optionProps?.avatarSrc ? styles.withInitials : ''}`}>
          {Boolean(optionProps?.avatarSrc) ? (
            <img
              alt={`${label} avatar`}
              src={optionProps.avatarSrc}
            />
          ) : (
            <span className={styles.userOptionInitials}>
              {label?.[0]}
            </span>
          )}
        </span>

        <p className={styles.userOptionLabel}>
          {label}
        </p>

        {Boolean(optionProps?.email) && (
          <p className={styles.userOptionEmail}>
            {optionProps.email}
          </p>
        )}
      </div>

      {selected && (
        <img
          className={styles.selectedIndicator}
          alt={`Remove ${label}`}
          src={chekIconSrc}
        />
      )}
    </div>
  );
};

export default UserOption;
