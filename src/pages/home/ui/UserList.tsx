import { type FC, memo } from 'react';

import UserOption from './UserOption';

import styles from './UserList.module.css';

interface UserListProps {
  withPadding?: boolean;
  options: {
    label: string;
    value: string | number;
    email?: string;
    avatarSrc?: string;
  }[];
  selectedValues: (string | number)[];
  onSelect: (value: string | number) => void;
}

const UserList: FC<UserListProps> = ({
  withPadding = false,
  options,
  selectedValues,
  onSelect,
}) => {
  return (
    <div className={styles.userList}>
      {options.map(option => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <div
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`${styles.userOptionContainer} ${isSelected ? styles.selected : ''} ${withPadding ? styles.withPadding : ''}`}
          >
            <UserOption
              withPadding={withPadding}
              selected={isSelected}
              label={option.label}
              email={option.email}
              avatarSrc={option.avatarSrc}
            />
          </div>
        );
      })}
    </div>
  );
};

export default memo(UserList);
