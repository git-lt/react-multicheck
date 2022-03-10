import type { ChangeEvent, CSSProperties, ReactNode } from "react";

export interface Option {
  label: string;
  value: string;
}

export interface CheckboxGroupContext {
  label?: string;
  toggleOption?: (option: Option) => void;
  value?: any;
  registerValue: (val: string) => void;
  cancelValue: (val: string) => void;
}

export interface MultiCheckProps  {
  className?: string;
  options: Array<Option>;
  values?: Array<string>;
  label?: string;
  columns?: number;
  onChange?: (checkedValue: Array<Option>) => void;
}


export interface CheckboxProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  indeterminate?: boolean;
  value?: any;
  checked?: boolean;
  name?: string;
  skipGroup?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
