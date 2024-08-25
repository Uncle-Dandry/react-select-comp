export interface Option<T = {}> {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: string | number | boolean | undefined | T;
}
