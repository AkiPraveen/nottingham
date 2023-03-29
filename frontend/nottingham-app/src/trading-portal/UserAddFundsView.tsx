import UserBalance from "../user-balance/UserBalance";
import React from "react";

export type UserAddFundsViewProps = {
  backendUrl: string;
  authToken: string;
}

const UserAddFundsView = (props: UserAddFundsViewProps) => {
  const {backendUrl, authToken} = props;

  const [amountToAdd, setAmountToAdd] = React.useState<number>(0);

  const addFunds = () => {
    // TODO add funds code
    return;
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

    </div>
  )
}
export default UserAddFundsView;