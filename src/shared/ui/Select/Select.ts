export interface Option<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  [key: string]: string | number | boolean | undefined | T;
}
