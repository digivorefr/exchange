import React from 'react';
import logo from '../images/logo.svg';
import RatesWrapper from '../features/rates/RatesWrapper';
import { Counter } from '../features/counter/Counter';
import Exchange from '../features/exchange/Exchange';

export default function App(): JSX.Element {
  return (
    <RatesWrapper>
      <div className="App">
        <header className="App__header">
          {/* <img src={logo} className="App-logo" alt="logo" width="100" />
          <Counter />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <span>
            <span>Learn </span>
            <a
              className="App-link"
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React
            </a>
            <span>, </span>
            <a
              className="App-link"
              href="https://redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux
            </a>
            <span>, </span>
            <a
              className="App-link"
              href="https://redux-toolkit.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redux Toolkit
            </a>
            ,<span> and </span>
            <a
              className="App-link"
              href="https://react-redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Redux
            </a>
          </span> */}
          header
        </header>
        <main className="App__main">
          <Exchange />
        </main>
      </div>
    </RatesWrapper>
  );
}