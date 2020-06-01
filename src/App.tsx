import React from 'react';
import logo from './logo.svg';
import './App.css';
import { APPLICATION_CONTEXT } from './lib';
import Toolbar from "./components/toolbar";
import { Body } from './components/body';

class App extends React.PureComponent {
  static context = APPLICATION_CONTEXT

  render() {
    return (
      <>
        <Toolbar />
        <Body />
      </>
    );
  }
}

export default App;
