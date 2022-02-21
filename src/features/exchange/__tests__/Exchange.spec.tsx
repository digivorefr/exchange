import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './../../../app/store';
import Exchange from './../Exchange';
import { refreshRates } from '../../rates/ratesSlice';
import * as rateAPI from '../../rates/ratesAPI';
import userEvent from '@testing-library/user-event'
import * as accounts from './../../accounts/accountsSlice';



describe('Exchange component', () => {

  jest.spyOn(rateAPI, 'fetchRates').mockResolvedValue({
    query: {
      base_currency: 'USD',
      timestamp: 123456789,
    },
    data: {
      GBP: 2,
      EUR: 0.5,
    },
  })

  beforeAll(async () => {
    await store.dispatch(refreshRates())
  })


  it('should render Exchange component', async () => {
    const { findByText } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );

    expect(await findByText(/Exchange/i)).toBeInTheDocument();
  });

  it('should compute values', async () => {
    const { container } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );
    userEvent.click(container.querySelector('#Exchange__input--From') as Element);
    userEvent.keyboard('10');

    expect((container.querySelector('#amount-From-input') as HTMLInputElement).value).toBe('10');
    expect((container.querySelector('#amount-To-input') as HTMLInputElement).value).toBe('20');

    userEvent.click(container.querySelector('#Exchange__input--To') as Element);
    userEvent.keyboard('.5');

    expect((container.querySelector('#amount-From-input') as HTMLInputElement).value).toBe('10.25');
    expect((container.querySelector('#amount-To-input') as HTMLInputElement).value).toBe('20.5');
  });

  it('should add exceeded status', async () => {
    const { container } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );

    userEvent.click(container.querySelector('#amount-From-input') as Element)
    userEvent.keyboard('101')

    expect(container.querySelector('#Exchange__input--From.exceeded')).toBeInTheDocument();
  });


  it('should reverse amounts', async () => {
    const { container } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );

    userEvent.click(container.querySelector('.revert') as Element)

    expect(container.querySelector('#Exchange__input--From .balance')?.innerHTML).toMatch(/GBP/)
    expect(container.querySelector('#Exchange__input--To .balance')?.innerHTML).toMatch(/USD/)
  });

  it('should check amount vs balance on revert', async () => {
    const { container } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );

    userEvent.click(container.querySelector('#amount-From-input') as Element)
    userEvent.keyboard('100')
    userEvent.click(container.querySelector('.revert') as Element)

    expect(container.querySelector('#Exchange__input--From.exceeded')).toBeInTheDocument()
  });


  it('should change currency', async () => {
    const { container } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );


    fireEvent.change(container.querySelector('#Exchange__input--From .select') as Element, { target: { value: 'GBP' } })
    expect(container.querySelector('#Exchange__input--From .balance')?.innerHTML).toMatch(/GBP/)

    fireEvent.change(container.querySelector('#Exchange__input--To .select') as Element, { target: { value: 'EUR' } })
    expect(container.querySelector('#Exchange__input--To .balance')?.innerHTML).toMatch(/EUR/)
  })

  it('should exchange currencies', async () => {

    const spy = jest.spyOn(accounts, 'exchange');

    const { container } = render(
      <Provider store={store}>
        <Exchange />
      </Provider>
    );

    userEvent.click(container.querySelector('#amount-From-input') as Element)
    userEvent.keyboard('100');
    fireEvent.submit(container.querySelector('.Exchange') as Element);

    expect(spy).toHaveBeenCalledWith({ "from": { "amount": "100", "currency": "USD" }, "to": "GBP" });

  })

})


