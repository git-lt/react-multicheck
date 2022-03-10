import React, { useContext } from 'react';
import type { FC  } from 'react';
import cls from 'classnames';
import { GroupContext } from './MultiCheck';
import type { CheckboxProps } from './interface';

import './MultiCheck.less';
const prefix = 'multi-checkbox';
const noop = () => {};

const Checkbox: FC<CheckboxProps> = ({ className, style, children, indeterminate = false, skipGroup=false, ...restProps }) => {
  const checkboxGroup = useContext(GroupContext);
  const checkboxProps: CheckboxProps = { ...restProps };

  if (checkboxGroup && !skipGroup) {
    checkboxProps.onChange = (...args) => {
      if (restProps.onChange) {
        restProps.onChange(...args);
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({ label: children as string, value: restProps.value });
      }
    };
    checkboxProps.value = restProps.value;
    checkboxProps.checked = checkboxGroup.value.includes(restProps.value);
  }

  const labelCls = cls(`${prefix}-wrapper`, className);
  const checkboxCls = cls(`${prefix}`, {
    [`${prefix}--checked`]: restProps.checked && !indeterminate,
    [`${prefix}--indeterminate`]: indeterminate,
  });

  return (
    <label className={labelCls}>
      <span className={checkboxCls}>
        <input {...checkboxProps} className="multi-checkbox-input" type="checkbox" />
        <span className="multi-checkbox-inner"></span>
      </span>
      <span>{skipGroup ? children : (checkboxGroup?.label || children)}</span>
    </label>
  );
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
