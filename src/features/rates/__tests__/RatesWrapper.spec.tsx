import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './../../../app/store';
import RatesWrapper from './../RatesWrapper';

jest.useFakeTimers();

it('renders Exchange component', () => {
  const spy = jest.spyOn(store, 'dispatch');
  const { getByText } = render(
    <Provider store={store}>
      <RatesWrapper>
        <p>children</p>
      </RatesWrapper>
    </Provider>
  );
  expect(getByText(/children/)).toBeInTheDocument();
  expect(spy).toHaveBeenCalled();
});

it('should call store to retrieve data from API', () => {
  jest.spyOn(global, 'setInterval');
  const spy = jest.spyOn(store, 'dispatch');
  render(
    <Provider store={store}>
      <RatesWrapper>
        <p>children</p>
      </RatesWrapper>
    </Provider>
  );
  expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  expect(spy).toHaveBeenCalledTimes(1);
});
