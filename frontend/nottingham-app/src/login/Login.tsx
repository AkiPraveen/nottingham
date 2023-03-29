import React from "react";

export type LoginProps = {
  setAuthenticated: (authenticated: boolean) => void;
  setAuthToken: (authToken: string) => void;
  backend_url: string;
}

type RegisterCredentials = {
  username: string;
  password: string;
}

const Login = (loginProps: LoginProps) => {
  const {setAuthenticated, setAuthToken} = loginProps;
  const {backend_url} = loginProps;

  // username and password
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  // error text
  const [errorText, setErrorText] = React.useState('');

  const handleLogin = () => {
    const credentials = {
      username: username,
      password: password
    }
    fetch(`${backend_url}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(async response => {

        const data = await response.json()

        // check if response was not 200
        if (response.status !== 200) {
          setErrorText(data.message);
          console.log('Login failed:', data);
          return;
        }

        console.log('Login success:', data);
        setAuthenticated(true);
        const authToken = data['auth-token'];
        setAuthToken(authToken);
        console.log('set auth token to:', authToken)
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorText(error);
      });
  }

  const handleRegister = () => {
    const credentials = {
      username: username,
      password: password
    }
    fetch(`${backend_url}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(async response => {

        const data = await response.json()

        // check if response was not 200
        if (response.status !== 200) {
          setErrorText(data.message);
          console.log('Registration failed:', data);
          return;
        }
        // Automatically login upon successful registration :)
        console.log('Registration success:', data);
        setAuthenticated(true);
        const authToken = data['auth-token'];
        setAuthToken(authToken);
        console.log('set auth token to:', authToken)
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorText(error);
      });
  }

  return (
    <div className="bg-black h-screen flex flex-column items-center justify-center font-dm-sans">
        <div className="pt-6 pb-8">
          <div className="flex justify-between mb-12">
            <div className="flex items-center">
              <h1 className={"text-white text-7xl"}>nottingham</h1>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="focus:outline-none appearance-none  w-full py-2 px-3 bg-black text-white" id="username"
                   type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="focus:outline-none appearance-none  w-full py-2 px-3 bg-black text-white mb-3"
                   id="password" type="password" placeholder="******************" />
              <p className="text-red text-xs italic">Please choose a password.</p>
          </div>
          <div className="flex items-center justify-around">
            <button className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4" type="button" onClick={handleRegister}>
              Register
            </button>
            <button className="bg-black hover:bg-white hover:text-black text-white font-bold py-2 px-4" type="button" onClick={handleLogin}>
              Sign In
            </button>
          </div>
          <div className="pt-6 text-red-500 text-center">
            <p className="text-sm">
              {errorText}
            </p>
          </div>
        </div>
      </div>
  );
}

export default Login;