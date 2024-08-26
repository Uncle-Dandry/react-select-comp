import { Select } from '@/shared/ui';
import { Option } from '@/shared/ui/Select/Select';

import UserOption from './UserOption';
import UserList from './UserList';

import styles from './SelectSection.module.css';

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
    avatarSrc: 'src/assets/avatar-1.png',
  },
  {
    label: 'Alex',
    value: '2',
    email: 'example@gmail.com',
    avatarSrc: 'src/assets/avatar-2.png',
  },
  {
    label: 'Alex',
    value: '3',
    email: 'example@gmail.com',
    avatarSrc: 'src/assets/avatar-3.png',
  },
  {
    label: 'Alex',
    value: '4',
    email: 'example@gmail.com',
    avatarSrc: 'src/assets/avatar-2.png',
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
    avatarSrc: 'src/assets/avatar-1.png',
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
    avatarSrc: 'src/assets/avatar-3.png',
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

  // const handleCreateOption = (newOptionLabel: string) => {
  //   const newOption = {
  //     label: newOptionLabel,
  //     value: String(options.length + 1),
  //   };

  //   // Здесь можно вызвать API для сохранения нового опшена на сервере
  //   // например, await api.createOption(newOption);

  //   setOptions((prevOptions) => [...prevOptions, newOption]);
  // };

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
