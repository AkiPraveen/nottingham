import React from "react";
import StockChip from "../stock-chip/StockChip";

// User positions data, from one aggregate request
export type UserPositionsRequestData = {
  [ticker: string]: {
    quantity: number;
    market_price_usd_cents: number;
    history_usd_cents: number[];
  }
}

export type UserPositionsViewProps = {
  backendUrl: string;
  authToken: string;
}

const UserPositionsView = (props:UserPositionsViewProps) => {
  const {authToken, backendUrl} = props;

  const [userPositionsRequestData, setUserPositionsRequestData] = React.useState<UserPositionsRequestData>({})


  // fetch user positions
  React.useEffect(() => {

    // First, fetch the positions & their quantities
    fetch(`${backendUrl}/positions`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken,
      },
    }).then(async response => {
      const data = await response.json();

      // check if response was not 200
      if (response.status !== 200) {
        console.log('positions fetch failed:', data);
        alert(`positions fetch failed: ${data.message}`)
        return;
      }

      console.log('positions data:', data);
      const foundUserPositions = data
      console.log('found user positions:', foundUserPositions);
      setUserPositionsRequestData(foundUserPositions);
    })


  }, [authToken, backendUrl])

  return (
    <div>
      <h1>User Positions</h1>
      {Object.keys(userPositionsRequestData).map((ticker) => {
        return (
          <StockChip
            ticker={ticker}
            quantity={userPositionsRequestData[ticker]['quantity']}
            marketPriceUsdCents={userPositionsRequestData[ticker]['market_price_usd_cents']}
            historyUsdCents={userPositionsRequestData[ticker]['history_usd_cents']}
          />
        )
      })}
    </div>
  )

}

export default UserPositionsView