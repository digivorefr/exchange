import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './../../../app/store';
import ExchangeInput from './../ExchangeInput';

test('renders Exchange component', () => {
  const { container, getByText } = render(
    <Provider store={store}>
      <ExchangeInput
        id="test"
        amount={{
          value: '50',
          currency: 'USD',
          status: '',
        }}
        onChangeAmount={() => null}
        onChangeCurrency={() => null}
      />
    </Provider>
  );

  expect(container.querySelector('.Exchange__input')).toBeInTheDocument();
  expect(getByText(/balance: USD/i)).toBeInTheDocument();
  expect((container.querySelector('.amount') as HTMLInputElement).value).toBe('50');
});

test('Add exceeded class when amount > balance', () => {
  const { container } = render(
    <Provider store={store}>
      <ExchangeInput
        id="test"
        amount={{
          value: '50',
          currency: 'USD',
          status: 'exceeded',
        }}
        onChangeAmount={() => null}
        onChangeCurrency={() => null}
      />
    </Provider>
  );

  expect(container.querySelector('.exceeded')).toBeInTheDocument();
});
