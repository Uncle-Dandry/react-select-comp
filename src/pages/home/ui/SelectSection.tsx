import { Select } from '@/shared/ui';
import { Option } from '@/shared/ui/Select/Select';

import avatarFirstSrc from '@/assets/avatar-1.png';
import avatarSecondSrc from '@/assets/avatar-2.png';
import avatarThirdSrc from '@/assets/avatar-3.png';

import UserOption from './UserOption';
import UserList from './UserList';

import styles from './SelectSection.module.css';

// only for demonstration. remove before add in lib

const optionsConfig = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
  { label: 'Option 6', value: '6' },
];

const customOptions: Option[] = [
  {
    label: 'Соловьёв Александр',
    value: '1',
    email: 'example@gmail.com',
    avatarSrc: avatarFirstSrc,
  },
  {
    label: 'Alex',
    value: '2',
    email: 'example@gmail.com',
    avatarSrc: avatarSecondSrc,
  },
  {
    label: 'Alex',
    value: '3',
    email: 'example@gmail.com',
    avatarSrc: avatarThirdSrc,
  },
  {
    label: 'Alex',
    value: '4',
    email: 'example@gmail.com',
    avatarSrc: avatarSecondSrc,
  },
  {
    label: 'Alex',
    value: '5',
    email: 'example@gmail.com',
  },
  {
    label: 'Alex',
    value: '6',
    email: 'example@gmail.com',
    avatarSrc: avatarFirstSrc,
  },
  {
    label: 'G',
    value: '7',
    email: 'example@gmail.com',
  },
  {
    label: 'Alex',
    value: '8',
    email: 'example@gmail.com',
    avatarSrc: avatarThirdSrc,
  },
];

const selectsConfig = [
  {
    title: 'Select',
    props: {
      placeholder: 'Placeholder',
      options: optionsConfig,
    },
  },
  {
    title: 'Searchable Select',
    props: {
      searchable: true,
      placeholder: 'Placeholder',
      options: optionsConfig,
    },
  },
  {
    title: 'Multi Select',
    props: {
      searchable: true,
      multiple: true,
      placeholder: 'Placeholder',
      options: optionsConfig,
    },
  },
  {
    title: 'Combobox',
    props: {
      searchable: true,
      combobox: true,
      placeholder: 'Placeholder',
      options: optionsConfig,
    },
  },
  {
    title: 'Multi Combobox',
    props: {
      searchable: true,
      combobox: true,
      multiple: true,
      placeholder: 'Placeholder',
      options: optionsConfig,
    },
  },
  {
    title: 'Select with Custom Option',
    props: {
      searchable: true,
      multiple: true,
      placeholder: 'Placeholder',
      options: customOptions,
      optionRender: UserOption,
    },
  },
];

const SelectSection = () => {
  const handleChange = (value: string | number | (string | number)[]) => {
    console.log('Selected value:', value);
  };

  const handleCreateOption = async (value: string): Promise<boolean> => {
    try {
      // Here you can use API
      // await api.createOption(newOption);
  
      return Boolean(value);
    } catch (error) {
      console.error('Error during option creation:', error);
      return false;
    }
  };

  return (
    <section className={styles.selectSectionRoot}>
      {selectsConfig.map(({ title, props }, index) => (
        <div
          className={styles.selectSectionWrapper}
          key={`${title}-${index}`}
        >
          <h2>
            {title}
          </h2>

          <Select {...props} />
        </div>
      ))}

      <div className={styles.selectSectionWrapper}>
        <h2>
          User List without Padding
        </h2>

        <Select
          searchable
          multiple
          placeholder="Placeholder"
          options={customOptions}
          onChange={handleChange}
          dropdownRender={({ options, selectedValues, onSelect }) => (
            <UserList
              options={options}
              selectedValues={selectedValues}
              onSelect={onSelect}
            />
          )}
        />
      </div>

      <div className={styles.selectSectionWrapper}>
        <h2>
          User List with Padding
        </h2>

        <Select
          searchable
          multiple
          placeholder="Placeholder"
          hint="Hint"
          options={customOptions}
          dropdownRender={(dropdownProps) => (
            <UserList
              withPadding
              {...dropdownProps}
            />
          )}
        />
      </div>
    </section>
  );
};

export default SelectSection;
