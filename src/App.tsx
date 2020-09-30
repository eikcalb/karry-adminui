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
    DEFAULT_APPLICATION.ready.then(() => {
      if (DEFAULT_APPLICATION.signedIn()) {
        setState({ ...state, user: DEFAULT_APPLICATION.user as User, ready: true })
      } else {
        setState({ ...state, ready: true })
      }
    })
  }, [])

  return (
    <ToastProvider autoDismiss autoDismissTimeout={AUTO_HIDE_TOAST_TIMEOUT} placement='bottom-center'>
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
