import React from 'react';
import RatesWrapper from '../features/rates/RatesWrapper';
import Exchange from '../features/exchange/Exchange';

export default function App(): JSX.Element {
  return (
    <RatesWrapper>
      <div className="App">
        <h1>Exchange</h1>
        <Exchange />
      </div>
    </RatesWrapper>
  );
}