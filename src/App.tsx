import React, { useContext, useState, createContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { APPLICATION_CONTEXT, DEFAULT_APPLICATION, VIEW_CONTEXT } from './lib';
import Toolbar from "./components/toolbar";
import { Body } from './components/body';
import { User } from './lib/user';
import { ToastProvider } from 'react-toast-notifications';

const AUTO_HIDE_TOAST_TIMEOUT = 4000;

interface AppState {
  ready: boolean,
  loading: boolean
}
/**
 * This is the main entry to the web application.
 */
function App() {
  const [state, setState] = useState<AppState>({
    ready: false,
    loading: false
  })
  const [signedIn, setSignedInUser] = useState<User | undefined>(undefined)

  const viewContext = {
    setSignedInUser,
    signedIn,
    setLoading: (loading) => setState({ ...state, loading })
  }

  useEffect(() => {
    DEFAULT_APPLICATION.ready.then(() => {
      if (DEFAULT_APPLICATION.signedIn()) {
        setSignedInUser(DEFAULT_APPLICATION.user)
      } else {
        setSignedInUser(undefined)
      }
      setState({ ...state, ready: true })
    }).finally(() => {
      DEFAULT_APPLICATION.logoutListener = () => viewContext.setSignedInUser(undefined)
    })
  }, [])

  return (
    <ToastProvider autoDismiss autoDismissTimeout={AUTO_HIDE_TOAST_TIMEOUT} placement='top-center'>
      <APPLICATION_CONTEXT.Provider value={DEFAULT_APPLICATION}>
        <VIEW_CONTEXT.Provider value={viewContext}>
          <Toolbar hidden={!state.ready} />
          <Body showLoading={!state.ready || state.loading} />
        </VIEW_CONTEXT.Provider>
      </APPLICATION_CONTEXT.Provider>
    </ToastProvider>
  )
}

export default App;
