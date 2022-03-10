/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import MultiCheck from '../MultiCheck';

const options = [
  {label: 'aaa', value: '111',},
  {label: 'bbb', value: '222',},
  {label: 'ccc', value: '333',},
]

// 1. The component has a label
// 2. The special `Select All` option
//    1. `Select All` option if checked, all other options are checked
//    2. if unchecked, all other options are unchecked
//    3. if all other options are checked, it should be checked
//    4. if any other option are unchecked, it should be unchecked
//    5. NOTE: there behaviour always work even if 'values' or 'onChange' not passed to the component or is `undefined`
// 3. The options support multiple-columns, and the direction is from top to bottom in each column

describe('MultiCheck', () => {
  describe('initialize', () => {
    it('renders the label if label provided', () => {
      render(
        <MultiCheck options={options} label="test" />,
      );
      const aboutAnchorNode = screen.getAllByText(/test/i);
      expect(aboutAnchorNode).toHaveLength(3);
    });
    it('render the label by options data', () => {
      render(
        <MultiCheck options={options} />,
      );
      const label1 = screen.getAllByText(/aaa/i);
      expect(label1).toHaveLength(1);

      const label2 = screen.getAllByText(/bbb/i);
      expect(label2).toHaveLength(1);

      const label3 = screen.getAllByText(/ccc/i);
      expect(label3).toHaveLength(1);
    });
  });
  describe('behaviour', () => {
    it('`Select All` option if checked, all other options are checked', () => {
      render(
        <MultiCheck options={options} />,
      );
      
      fireEvent.click(screen.getByText('Select All'))
      const checkboxs = document.querySelectorAll('.multi-checkbox-input');
      Array.from(checkboxs).forEach(v => {
        expect(v.checked).toBeTruthy();
      })
    });

    it('`Select All` option if unchecked, all other options are unchecked', () => {
      render(
        <MultiCheck options={options} />,
      );
      
      fireEvent.click(screen.getByText('Select All'));

      const checkboxs = document.querySelectorAll('.multi-checkbox-input');
      Array.from(checkboxs).forEach(v => {
        expect(v).toBeChecked();
      })

      fireEvent.click(screen.getByText('Select All'));
      Array.from(checkboxs).forEach(v => {
        expect(v).not.toBeChecked();
      })
    });

    it('if all other options are checked, `Select All` option it should be checked', () => {
      render(
        <MultiCheck options={options} />,
      );
      
      // fireEvent.change(screen.getByText('aaa'));
      // fireEvent.change(screen.getByText('bbb'));
      // fireEvent.change(screen.getByText('ccc'));
      
      // const checkAll = document.querySelector('.multi-checkbox-input');
      // expect(checkAll).toBeChecked();
    });
   
  });
});
