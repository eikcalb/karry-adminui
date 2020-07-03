import React, { useContext, useState, createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { APPLICATION_CONTEXT, DEFAULT_APPLICATION, VIEW_CONTEXT } from './lib';
import Toolbar from "./components/toolbar";
import { Body } from './components/body';


interface AppState {
  ready: boolean
}
/**
 * This is the main entry to OWA web application.
 */
class App extends React.PureComponent<{}, AppState> {
  static contextType = APPLICATION_CONTEXT
  context!: React.ContextType<typeof APPLICATION_CONTEXT>
  readonly ViewContext: any

  constructor(props: {}) {
    super(props)
    // initialize application state
    this.state = {
      ready: false
    }

    this.ViewContext = {
      setReady: (ready: boolean) => this.setState({ ready })
    }
  }

  componentDidMount() {
    this.context.ready.then(() => this.setState({ ready: true }))
  }

  render() {
    let ctx = this.context
    let { ready } = this.state

    return (
      <APPLICATION_CONTEXT.Provider value={DEFAULT_APPLICATION}>
        <VIEW_CONTEXT.Provider value={this.ViewContext}>
          <Toolbar />
          <Body showLoading={!ready} />
        </VIEW_CONTEXT.Provider>
      </APPLICATION_CONTEXT.Provider >
    );
  }
}

export default App;
