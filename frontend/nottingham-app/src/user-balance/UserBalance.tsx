import React from "react";

export type UserBalanceProps = {
  backendUrl: string;
  authToken: string;
}

const UserBalance = (props:UserBalanceProps) => {

  const {backendUrl, authToken} = props;

  // Balance in USD cents
  const [userBalanceUsdCents, setUserBalanceUsdCents] = React.useState<number>(0)

  const fetchUserBalance = () => {
    // Next, fetch user balance
    fetch(`${backendUrl}/users/balance_usd_cents`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken,
      },
    }).then(async response => {
      const data = await response.json();

      // check if response was not 200
      if (response.status !== 200) {
        console.log('balance fetch failed:', data);
        alert(`balance fetch failed: ${data.message}`)
        return;
      }

      console.log('balance data:', data);
      const foundUserBalanceUsdCents = data['balance_usd_cents']
      console.log('found user balance:', foundUserBalanceUsdCents);
      setUserBalanceUsdCents(foundUserBalanceUsdCents);
    }).catch((error) => {
      console.log('balance fetch failed:', error);
      alert(`Could not fetch your balance: ${error.toString()}`)
    })
  }

  // fetch user balance
  //TODO adjust this to not use an empty deps array
  React.useEffect(() => {
    fetchUserBalance();
  })

  return (
    <h1 className={"text-white mt-5"}>
      your nottingham brokerage account currently contains <span className={"font-bold"}>{(userBalanceUsdCents / 100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span> (it is not insured in the slightest, good luck if we lose it)
    </h1>
  )
}

export default UserBalance