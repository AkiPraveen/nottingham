import React from 'react';
import Login from './login/Login';
import TradingPortal from "./trading-portal/TradingPortal";

// TODO make this an env variable in production
const BACKEND_URL = "http://127.0.0.1:5000"

function App() {
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
