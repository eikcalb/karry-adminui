import React, { useContext, useState, createContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { APPLICATION_CONTEXT, DEFAULT_APPLICATION, VIEW_CONTEXT } from './lib';
import Toolbar from "./components/toolbar";
import { Body } from './components/body';
import { User } from './lib/user';


interface AppState {
  ready: boolean,
  user: User | null,
  loading: boolean
}
/**
 * This is the main entry to the web application.
 */
function App() {
  const [state, setState] = useState<AppState>({
    ready: false,
    user: null,
    loading: false
  })

  const viewContext = {
    setSignedInUser: (user: User) => setState({ ...state, user }),
    signedIn: state.user,
    setLoading: (loading) => setState({ ...state, loading })
  }

  useEffect(() => {
    DEFAULT_APPLICATION.ready.then(() => setState({ ...state, ready: true }))
  }, [])

  return (
    <APPLICATION_CONTEXT.Provider value={DEFAULT_APPLICATION}>
      <VIEW_CONTEXT.Provider value={viewContext}>
        <Toolbar />
        <Body showLoading={!state.ready || state.loading} />
      </VIEW_CONTEXT.Provider>
    </APPLICATION_CONTEXT.Provider >
  )
}

export default App;
