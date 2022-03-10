import React, { useState, useEffect, createContext } from 'react';
import type {FC, ChangeEvent} from 'react';
import Checkbox from './Checkbox';
import type { CheckboxGroupContext, MultiCheckProps, Option } from './interface';
import { groupByColumn } from './utils';

import './MultiCheck.less';

const prefix = 'multi-checkbox';

export const GroupContext = createContext<CheckboxGroupContext | null>(null);

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. All the options (including the "Select All") should be split into several columns, and the order is from top to bottom in each column
 */
// type Props = {
//   // the label text of the whole component
//   label?: string,
//   // Assume no duplicated labels or values
//   // It may contain any values, so be careful for you "Select All" option
//   options: Option[],
//   // Always be non-negative integer.
//   // The default value is 1
//   // 0 is considered as 1
//   // We only check [0, 1, 2, ... 10], but it should work for greater number
//   columns?: number,
//   // Which options should be selected.
//   // - If `undefined`, makes the component in uncontrolled mode with no default options checked, but the component is still workable;
//   // - if not undefined, makes the component in controlled mode with corresponding options checked.
//   // - Assume no duplicated values.
//   // - It may contain values not in the options.
//   values?: string[]
//   // if not undefined, when checked options are changed, they should be passed to outside
//   // if undefined, the options can still be selected, but won't notify the outside
//   onChange?: (options: Option[]) => void,
// }

export const MultiCheck: FC<MultiCheckProps> = ({ 
  options = [], 
  columns = 1, 
  onChange, 
  children, 
  ...restProps 
}) => {

  // checked values
  const [value, setValue] = useState<string[]>(restProps.values || []);

  const [checkAll, setCheckAll] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  // set selected value when props.value changed
  useEffect(() => {
    if ('values' in restProps) {
      setValue(restProps.values || []);
      const isCheckAll = options.every(v => restProps.values?.includes(v.value));
      const isIndeterminate = options.some(v => restProps.values?.includes(v.value));
      setCheckAll(isCheckAll);
      setIndeterminate(isIndeterminate && !isCheckAll);
    }
  }, [restProps.values]);

  const cancelValue = (val: string) => {
    setValue(prevValues => prevValues.filter(v => v !== val));
  };

  const registerValue = (val: string) => {
    setValue(prevValues => [...prevValues, val]);
  };

  const toggleOption = (option: Option) => {
    const optionIndex = value.indexOf(option.value);
    const newValue = value.slice();
    if (optionIndex === -1) {
      newValue.push(option.value);
    } else {
      newValue.splice(optionIndex, 1);
    }
    if (!('values' in restProps)) {
      setValue(newValue);
    }
    const checkedOptions = options.filter(v => newValue.includes(v.value));
    if (checkedOptions.length > 0 && checkedOptions.length < options.length) {
      setIndeterminate(true);
    } else {
      setIndeterminate(false);
    }
    if (checkedOptions.length === 0) setCheckAll(false);
    onChange?.(checkedOptions);
  };

  const context = {
    toggleOption,
    value,
    registerValue,
    cancelValue,
    label: restProps.label,
  };

  function handleCheckedAll(e: ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setIndeterminate(false);
    setCheckAll(checked);
    const valuesAll = options.map(v => v.value);
    if (!('values' in restProps)) {
      setValue(checked ? valuesAll : []);
    }
    onChange?.(checked ? options : []);
  }

  if (Array.isArray(options)) {
    children = groupByColumn(options, columns).map((col, index) => {
      return (
        <div className={`${prefix}-group-item`} key={index}>
          {index === 0 && (
            <div key="checkall">
              <Checkbox skipGroup indeterminate={indeterminate} onChange={handleCheckedAll} checked={checkAll}>
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

  return <div className={`${prefix}-group`}>
    <GroupContext.Provider value={context}>{children}</GroupContext.Provider>
  </div>
}

export default MultiCheck;