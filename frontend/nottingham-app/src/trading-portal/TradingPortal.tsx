import UserPositionsView from "./UserPositionsView";
import React from "react";
import UserOrdersView from "./UserOrdersView";
import UserAddFundsView from "./UserAddFundsView";

export type TradingPortalProps = {
  backendUrl: string;
  authToken: string;
}

const VIEWS = {
  USER_POSITIONS: 'USER_POSITIONS',
  USER_ORDERS: 'USER_ORDERS',
  USER_ADD_FUNDS: 'USER_ADD_FUNDS',
}

type TradingPortalState = keyof typeof VIEWS;

const TradingPortal = (props: TradingPortalProps) => {

  const {backendUrl, authToken} = props;

  const [currentView, setCurrentView] = React.useState<TradingPortalState>(VIEWS.USER_POSITIONS as TradingPortalState);

  // View selector handlers
  const selectUserPositions = () => {
    setCurrentView(VIEWS.USER_POSITIONS as TradingPortalState);
  }

  const selectUserOrders = () => {
    setCurrentView(VIEWS.USER_ORDERS as TradingPortalState);
  }

  const selectUserAddFunds = () => {
    setCurrentView(VIEWS.USER_ADD_FUNDS as TradingPortalState);
  }


  return (
    <div className={"bg-black min-h-screen p-10"}>
      <div className={"flex flex-column flex-start w-full"}>
        <div className={"hover:cursor-pointer"} onClick={selectUserPositions}>
          <h1 className={
            `text-white text-5xl " ${currentView == VIEWS.USER_POSITIONS ? "  underline" : ""}`}
          >positions</h1>
        </div>
        <div className={"hover:cursor-pointer ml-8"} onClick={selectUserOrders}>
          <h1 className={
            `text-white text-5xl " ${currentView == VIEWS.USER_ORDERS ? "  underline" : ""}`
          }>orders</h1>
        </div>
        <div className={"hover:cursor-pointer ml-8"} onClick={selectUserAddFunds}>
          <h1 className={
            `text-white text-5xl " ${currentView == VIEWS.USER_ADD_FUNDS ? "  underline" : ""}`
          }>add funds</h1>
        </div>
      </div>
      {
        (currentView === VIEWS.USER_POSITIONS) &&
        <UserPositionsView backendUrl={backendUrl} authToken={authToken} />
      }
      {
        (currentView === VIEWS.USER_ORDERS) &&
        <UserOrdersView backendUrl={backendUrl} authToken={authToken} />
      }
      {
        (currentView === VIEWS.USER_ADD_FUNDS) &&
        <UserAddFundsView backendUrl={backendUrl} authToken={authToken} />
      }
    </div>
  )
}

export default TradingPortal