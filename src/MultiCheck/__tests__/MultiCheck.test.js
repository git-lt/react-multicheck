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
  describe('1. initialize', () => {
    it('1.1 renders the label if label provided', () => {
      render(
        <MultiCheck options={options} label="test" />,
      );
      const aboutAnchorNode = screen.getAllByText(/test/i);
      expect(aboutAnchorNode).toHaveLength(3);
    });
    it('1.2 render the label by options data', () => {
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
  describe('2. Select All', () => {
    it('2.1 `Select All` option if checked, all other options are checked', () => {
      render(
        <MultiCheck options={options} />,
      );
      
      fireEvent.click(screen.getByText('Select All'))
      const checkboxs = document.querySelectorAll('.multi-checkbox-input');
      Array.from(checkboxs).forEach(v => {
        expect(v.checked).toBeTruthy();
      })
    });

    it('2.2 `Select All` option if unchecked, all other options are unchecked', () => {
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

    it('2.3 if all other options are checked, `Select All` option it should be checked', () => {
      render(
        <MultiCheck options={options} />,
      );
      
      fireEvent.click(screen.getByText('aaa'));
      fireEvent.click(screen.getByText('bbb'));
      fireEvent.click(screen.getByText('ccc'));
      
      const checkAll = document.querySelector('.multi-checkbox-input');
      expect(checkAll).toBeChecked();
    });

    it('2.4 if any other option are unchecked, it should be unchecked', () => {
      class UncheckedCheckbox extends React.Component {
        state = {
          options: options.slice(),
          values: ['aaa', 'bbb', 'ccc']
        }
        onChange = (values) => {
          this.setState({ values })
        }
        render(){
          return (
            <MultiCheck options={this.state.options} values={this.state.values} onChange={this.onChange}/>
          )
        }
      }

      render(
        <UncheckedCheckbox />
      );
      
      fireEvent.click(screen.getByText('aaa'));
      fireEvent.click(screen.getByText('bbb'));
      fireEvent.click(screen.getByText('ccc'));
      
      const checkAll = document.querySelector('.multi-checkbox-input');
      expect(checkAll).not.toBeChecked();
    });
  
  });

  describe('3. Uncontrolled', () => {
    it(`3.1 only have options, it should be work`, () => {
      render(
        <MultiCheck options={options} />,
      );
      
      fireEvent.click(screen.getByText('aaa'))
      expect(screen.getByDisplayValue('111')).toBeChecked();
    })
    it(`3.2 options is string array, it should be work`, () => {
      render(
        <MultiCheck options={['abc', 'def']} />,
      );
      
      fireEvent.click(screen.getByText('abc'))
      expect(screen.getByDisplayValue('abc')).toBeChecked();
    })
  })
  describe('4. Columns', () => {
    it(`4.1 set 5 options and 2 columns, render it should be 3 columns`, () => {
      const opts = [
        {label: 'aaa', value: '111',},
        {label: 'bbb', value: '222',},
        {label: 'ccc', value: '333',},
        {label: 'ddd', value: '444',},
        {label: 'eee', value: '555',},
        {label: 'fff', value: '666',},
        {label: 'ggg', value: '777',},
        {label: 'hhh', value: '888',},
        {label: 'iii', value: '999',},
      ]
      render(
        <MultiCheck options={opts} columns={2} />,
      );
      const list = Array.from(document.querySelectorAll('.multi-checkbox-group-item'))
      expect(list).toHaveLength(3);

    })
    it(`4.2 checkbox item it should be from top to bottom`, () => {
      const opts = [
        {label: 'aaa', value: '111',},
        {label: 'bbb', value: '222',},
        {label: 'ccc', value: '333',},
        {label: 'ddd', value: '444',},
        {label: 'eee', value: '555',},
        {label: 'fff', value: '666',},
        {label: 'ggg', value: '777',},
        {label: 'hhh', value: '888',},
        {label: 'iii', value: '999',},
      ]
      render(
        <MultiCheck options={opts} columns={2} />,
      );
      const col2 = document.querySelectorAll('.multi-checkbox-group-item')[1];
      const values = Array.from(col2.querySelectorAll('input')).map(v =>v.value)
      expect(values).toEqual(['555', '666', '777', '888'])
    })
  })
});
