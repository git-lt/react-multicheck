import React, { useContext } from 'react';
import type { FC, ChangeEvent, CSSProperties, ReactNode } from 'react';
import cls from 'classnames';
import { GroupContext } from './Group';
import './MultiCheck.less';

const prefix = 'multi-checkbox';

export type Option = {
  label: string;
  value: string;
};

export interface CheckboxProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  indeterminate?: boolean;
  value?: any;
  checked?: boolean;
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<CheckboxProps> = ({ className, style, children, indeterminate = false, ...restProps }) => {
  const checkboxGroup = useContext(GroupContext);
  const checkboxProps: CheckboxProps = { ...restProps };
  if (checkboxGroup) {
    checkboxProps.onChange = (...args) => {
      if (restProps.onChange) {
        restProps.onChange(...args);
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({ label: children as string, value: restProps.value });
      }
    };
    checkboxProps.value = restProps.value;
    checkboxProps.name = checkboxGroup.name;
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
      <span>{children}</span>
    </label>
  );
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
