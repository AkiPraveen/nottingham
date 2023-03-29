import UserBalance from "../user-balance/UserBalance";
import React from "react";

export type UserAddFundsViewProps = {
  backendUrl: string;
  authToken: string;
}

const UserAddFundsView = (props: UserAddFundsViewProps) => {
  const {backendUrl, authToken} = props;

  const [amountToAdd, setAmountToAdd] = React.useState<number>(0);
  const [status, setStatus] = React.useState<string>('');

  const addFunds = () => {
    // Validate funds amount
    if (amountToAdd <= 0) {
      setStatus('Nice try, that money is not leaving your account.');
      return;
    }
    if (amountToAdd % 1 !== 0) {
      setStatus('Please add only whole number dollar amounts.');
      return;
    }

    // Send request to backend
    fetch(`${backendUrl}/users/add_balance_usd_cents`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // multiply dollar amount by 100 for cents
        balance_usd_cents: amountToAdd * 100
      })
    }).then(async response => {
      const data = await response.json();

      // check if response was not 200
      if (response.status !== 200) {
        console.log('add funds failed:', data);
        setStatus(`add funds failed: ${data.toString()}`)
        return;
      }

      console.log('add funds success:', data);
      setStatus(`Successfully added $${amountToAdd} to your account on ${new Date()}!`);
    }).catch((err) => {
      console.log('add funds failed:', err);
      setStatus(`add funds failed: ${err.toString()}`)
    })

  }

  return (
    <div className={"text-white"}>
      <UserBalance backendUrl={backendUrl} authToken={authToken}/>
      <h1 className={"mt-8 text-3xl"}>
        disclaimer
      </h1>
      <h3 className={"pb-8"}>
        Although none of the money you add here is insured in any capacity, the nottingham team encourages you to add as much money as you can to your account, because stocks always go up. In fact, you know what would be really awesome and not induce mass-panic at all? If you withdrew all of your money from your bank account, and transferred it here! :)
      </h3>
      <h1 className={"mt-8 text-3xl"}>
        specify amount to add (dollars)
      </h1>
      <div className={"mt-2"}>
        <input type={"number"} className={"focus:outline-none appearance-none bg-black text-white border border-white px-4  w-32"} value={amountToAdd} onChange={(e) => setAmountToAdd(parseInt(e.target.value))} />
      </div>

      <div className={"mt-8"}>
        <button onClick={addFunds} className={"bg-black text-white border border-white px-4 py-2 mt-2 hover:bg-white hover:text-black"}>
        yes, add ${amountToAdd} (cannot be transferred back)
        </button>
      </div>

      <div className={"mt-8"}>
        <h3>{status}</h3>
      </div>

    </div>
  )
}
export default UserAddFundsView;