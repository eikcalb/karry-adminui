import React from 'react';
import logo from './logo.svg';
import './App.css';
import { APPLICATION_CONTEXT } from './lib';
import Toolbar from "./components/toolbar";

class App extends React.PureComponent {
  static context = APPLICATION_CONTEXT

  render() {
    return (
      <>
        <Toolbar />
        <div className="App container">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
        </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
        </a>
          </header>
        </div>
      </>
    );
  }
}

export default App;
