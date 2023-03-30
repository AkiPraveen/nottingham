import React from 'react';
import Login from './login/Login';
import TradingPortal from "./trading-portal/TradingPortal";

// load environment variables from .env file
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? ''

function App() {

  // log if backend URL is not found
  if (BACKEND_URL === '') {
    console.error('backend URL not found:', BACKEND_URL)
  }

  // store user authentication information in state
  const [authenticated, setAuthenticated] = React.useState(false);
  const [authToken, setAuthToken] = React.useState('');

  return (
    !authenticated ? (
      <Login
        backend_url={BACKEND_URL}
        setAuthenticated={setAuthenticated}
        setAuthToken={setAuthToken}/>
    ) : (
      <TradingPortal backendUrl={BACKEND_URL} authToken={authToken} />
    )
  );
}

export default App;
