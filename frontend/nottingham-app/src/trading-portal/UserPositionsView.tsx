import React from "react";
import StockChip from "../stock-chip/StockChip";
import UserBalance from "../user-balance/UserBalance";

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

  // Positions data
  const [userPositionsRequestData, setUserPositionsRequestData] = React.useState<UserPositionsRequestData>({})
  const [dataReceived, setDataReceived] = React.useState<boolean>(false);


  const fetchUserData = () => {
    // First, fetch the positions & their quantities
    fetch(`${backendUrl}/positions/`, {
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
      setDataReceived(true);
    })

  }

  // fetch user positions and balance
  React.useEffect(() => {
    fetchUserData();
  }, [authToken, backendUrl])

  return (
    <div>

      {Object.keys(userPositionsRequestData).length === 0 ? (
        <div className={"mt-8"}>
          {dataReceived ? (
            <h1 className={"text-white"}>You have no positions.</h1>
          ) : (
            <h1 className={"text-white"}>collecting securities data ...</h1>
            )}
        </div>
      ) : (
        <>
          <UserBalance backendUrl={backendUrl} authToken={authToken} />
        <div className={"mt-8"}>
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
        </>
      )}
    </div>
  )

}

export default UserPositionsView