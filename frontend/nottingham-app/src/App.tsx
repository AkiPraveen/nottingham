import React from 'react';
import Login from './login/Login';
import TradingPortal from "./trading-portal/TradingPortal";

const BACKEND_URL = "http://127.0.0.1:5000"

function App() {

  // store user authentication in state
  const [authenticated, setAuthenticated] = React.useState(false);

  return (
    !authenticated ? (
      <Login
        backend_url={BACKEND_URL}
        setAuthenticated={setAuthenticated}
        authenticated={authenticated}/>
    ) : (
      <TradingPortal />
    )
  );
}

export default App;
