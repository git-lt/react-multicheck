import React, { createContext, useState, useEffect, memo, ChangeEvent } from 'react';
import type { FC, ReactNode } from 'react';
import Checkbox from './Checkbox';
const prefix = 'multi-checkbox';

export interface CheckboxOptionType {
  label: string;
  value: string;
}

export interface CheckboxGroupContext {
  name?: string;
  toggleOption?: (option: CheckboxOptionType) => void;
  value?: any;
  registerValue: (val: string) => void;
  cancelValue: (val: string) => void;
}

export interface AbstractCheckboxGroupProps {
  className?: string;
  options?: Array<CheckboxOptionType>;
}

export interface CheckboxGroupProps extends AbstractCheckboxGroupProps {
  defaultValue?: Array<string>;
  value?: Array<string>;
  name?: string;
  column?: number;
  onChange?: (checkedValue: Array<CheckboxOptionType>) => void;
  children?: ReactNode;
}

export const GroupContext = createContext<CheckboxGroupContext | null>(null);

function groupByColumn(list: CheckboxOptionType[], column: number) {
  if (!list.length) return [];
  if (column <= 1) return [list];
  const pageSize = Math.floor(list.length / column);
  let res = [];
  let temp = list.slice();
  while (temp.length) {
    res.push(temp.splice(0, pageSize));
  }
  return res;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  onChange,
  column = 1,
  options = [],
  defaultValue,
  children,
  ...restProps
}) => {
  // checked values
  const [value, setValue] = useState<string[]>(restProps.value || defaultValue || []);

  const [checkAll, setCheckAll] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);

  // set selected value when props.value changed
  useEffect(() => {
    if ('value' in restProps) {
      setValue(restProps.value || []);
      const isCheckAll = options.every(v => restProps.value?.includes(v.value));
      const isIndeterminate = options.some(v => restProps.value?.includes(v.value));
      setCheckAll(isCheckAll);
      setIndeterminate(isIndeterminate && !isCheckAll);
    }
  }, [restProps.value]);

  const cancelValue = (val: string) => {
    setValue(prevValues => prevValues.filter(v => v !== val));
  };

  const registerValue = (val: string) => {
    setValue(prevValues => [...prevValues, val]);
  };

  const toggleOption = (option: CheckboxOptionType) => {
    const optionIndex = value.indexOf(option.value);
    const newValue = value.slice();
    if (optionIndex === -1) {
      newValue.push(option.value);
    } else {
      newValue.splice(optionIndex, 1);
    }
    if (!('value' in restProps)) {
      setValue(newValue);
    }
    onChange?.(options.filter(v => newValue.includes(v.value)));
  };

  const context = {
    toggleOption,
    value,
    registerValue,
    cancelValue,
    name: restProps.name,
  };

  if (Array.isArray(options)) {
    children = groupByColumn(options, column).map((col, index) => {
      return (
        <div className={`${prefix}-group-item`} key={index}>
          {index === 0 && (
            <div key="checkall">
              <Checkbox indeterminate={indeterminate} onChange={handleCheckedAll} checked={checkAll}>
                Select All
              </Checkbox>
            </div>
          )}
          {col.map(option => {
            return (
              <div key={option.value.toString()}>
                <Checkbox value={option.value} checked={value.indexOf(option.value) !== -1}>
                  {option.label}
                </Checkbox>
              </div>
            );
          })}
        </div>
      );
    });
  }

  function handleCheckedAll(e: ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setIndeterminate(false);
    setCheckAll(checked);
    const valuesAll = options.map(v => v.value);
    if (!('value' in restProps) && checked) {
      setValue(checked ? valuesAll : []);
    }
    onChange?.(checked ? options : []);
  }

  return (
    <div className={`${prefix}-group`}>
      <GroupContext.Provider value={context}>{children}</GroupContext.Provider>
    </div>
  );
};

export default memo(CheckboxGroup);
