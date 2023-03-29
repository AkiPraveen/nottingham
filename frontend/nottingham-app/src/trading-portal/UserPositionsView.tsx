import React from "react";

type UserPositionsData = {
  [ticker: string]: number
}

export type UserPositionsViewProps = {
  backendUrl: string;
  authToken: string;
}

const UserPositionsView = (props:UserPositionsViewProps) => {
  const {authToken, backendUrl} = props;

  const [userPositions, setUserPositions] = React.useState<UserPositionsData>({});

  // fetch user positions
  React.useEffect(() => {
    fetch(`${backendUrl}/positions`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken,
      }
    }).then(async response => {
      const data = await response.json();

      // check if response was not 200
      if (response.status !== 200) {
        console.log('positions fetch failed:', data);
        alert(`positions fetch failed: ${data.message}`)
        return;
      }

      console.log('positions data:', data);
      const foundUserPositions = data['owned_positions']
      console.log('found user positions:', foundUserPositions);
      setUserPositions(foundUserPositions);
    })
  }, [authToken, backendUrl])

  return (
    <div>
      <h1>User Positions</h1>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(userPositions).map((ticker) => {
            return (
              <tr key={ticker}>
                <td>{ticker}</td>
                <td>{userPositions[ticker]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
  )

}

export default UserPositionsView