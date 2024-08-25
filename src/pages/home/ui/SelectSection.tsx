import { Select } from '@/shared/ui';
// import Select from './Select';

import styles from './SelectSection.module.css';
import { useState } from 'react';
import { Option } from '@/shared/ui/Select/Select';
import UserOption from './UserOption';

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
    label: 'Alex',
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
];

const selectsConfig = [
  {
    title: 'Select',
    props: {
      placeholder: 'Choose an option',
      options: optionsConfig,
    },
  },
  {
    title: 'Select',
    props: {
      searchable: true,
      placeholder: 'Choose an option',
      options: optionsConfig,
    },
  },
  {
    title: 'Multi Select',
    props: {
      searchable: true,
      multiple: true,
      placeholder: 'Choose an option',
      options: optionsConfig,
    },
  },
  {
    title: 'Combobox',
    props: {
      searchable: true,
      combobox: true,
      placeholder: 'Choose an option',
      options: optionsConfig,
    },
  },
  {
    title: 'Multi Combobox',
    props: {
      searchable: true,
      combobox: true,
      multiple: true,
      placeholder: 'Choose an option',
      options: optionsConfig,
    },
  },
  {
    title: 'Select with Custom Option',
    props: {
      searchable: true,
      multiple: true,
      placeholder: 'Choose an option',
      options: customOptions,
      optionRender: UserOption,
    },
  },
];

const SelectSection = () => {
  // const [options, setOptions] = useState([...optionsConfig]);

  const handleChange = (value: string | number) => {
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
      {selectsConfig.map(({ title, props }) => (
        <div
          className={styles.selectSectionWrapper}
          key={title}
        >
          <h2>
            {title}
          </h2>

          <Select {...props} />
        </div>
      ))}

      {/* <div className={styles.selectSectionWrapper}>
        <h2>
          
        </h2>

        <Select
          multiple
          placeholder="Choose an option"
          options={customOptions}
          optionRender={UserOption}
        />
      </div> */}
    </section>
  );
};

export default SelectSection;
