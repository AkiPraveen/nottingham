import React from "react";
import Emoji from "../util/Emoji";
import UserBalance from "../user-balance/UserBalance";

export type UserOrdersViewProps = {
  backendUrl: string;
  authToken: string;
}

const ORDER_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL',
}
type OrderType = keyof typeof ORDER_TYPES;

type OrderStatus = {
  success: boolean;
  message: string;
}

const UserOrdersView = (props: UserOrdersViewProps) => {
  const {backendUrl, authToken} = props;

  const [orderType, setOrderType] = React.useState<OrderType>(ORDER_TYPES.BUY as OrderType);
  const [orderQuantity, setOrderQuantity] = React.useState<number>(0);
  const [orderTicker, setOrderTicker] = React.useState<string>('');

  // To display order status
  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>({success: false, message: ''});


  // Place order
  const placeOrder = () => {
    // Verify order quantity is valid
    if (orderQuantity <= 0) {
      setOrderStatus(
        {
          success: false,
          message: 'Order quantity must be greater than 0.',
        }
      );
      return;
    }
    if (orderQuantity % 1 !== 0) {
      setOrderStatus(
        {
          success: false,
          message: 'Order quantity must be an integer.',
        }
      );
      return;
    }

    // Verify that a ticker was entered
    if (orderTicker === '') {
      setOrderStatus(
        {
          success: false,
          message: 'Please enter a ticker.',
        }
      );
      return;
    }

    console.log('placing order')

    // Place order request
    fetch(`${backendUrl}/positions/order`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker: orderTicker,
        quantity: orderQuantity,
        order_type: orderType,
      })
    }).then(async response => {
        const data = await response.json()

        // check if response was not 200
        if (response.status !== 200) {
          setOrderStatus(
            {
              success: false,
              message: data.message,
            }
          );
          console.log('Order failed:', data);
          return;
        }

        // If order was success, gather information
        const pricePerShareUsdCents = data.price_per_share_usd_cents;
        const orderTicker = data.ticker;
        const updatedPositionQuantity = data.updated_position_quantity;
        const updatedUserBalanceUsdCents = data.updated_user_balance_usd_cents;

        const message = `Order placed successfully at ${new Date()}. You now have ${updatedPositionQuantity} shares of ${orderTicker} at $${pricePerShareUsdCents / 100} per share. Your new balance is $${updatedUserBalanceUsdCents / 100}.`


        console.log('Order success:', data);
        setOrderStatus(
          {
            success: true,
            message: message,
          }
        );
      }).catch((error) => {
        console.log('Order failed:', error);
        setOrderStatus(
          {
            success: false,
            message: error.message,
          }
        );
      })

  }

  return (
    <div className={"text-white pb-8"}>
      <UserBalance backendUrl={backendUrl} authToken={authToken}/>
      <h1 className={"mt-8 text-3xl"}>
        disclaimer
      </h1>
      <h3 className={"pb-8"}>
        The nottingham team strongly encourages you to trade securities based on privileged knowledge you have. This behavior is doubly encouraged for highly-paid executives at public companies. Though we cannot personally be held responsible for the legal ramifications, we believe that if you are rich enough, you'll find a way to get out of any trouble you get into.
      </h3>
      <h1 className={"text-3xl"}>
        order type</h1>
      <h3>Select order type below. Buy orders trade money for stock, sell orders trade stock for money.</h3>
      <select
        className={"focus:outline-none text-xl bg-black text-white border border-white px-4 mb-8 mt-2 w-32"}
        value={orderType}
        onChange={(e) => setOrderType(e.target.value as OrderType)}
        name="order-type" id="order-type">
        <option value={ORDER_TYPES.BUY}>BUY</option>
        <option value={ORDER_TYPES.SELL}>SELL</option>
      </select>

      <h1 className={"text-3xl"}>
        order ticker</h1>
      <h3>Enter desired order ticker below.</h3>
      <input type={"text"} className={"focus:outline-none appearance-none bg-black text-white border border-white px-4  w-32"} value={orderTicker}
      onChange={(e) => setOrderTicker(e.target.value.toUpperCase())}/>


      <h1 className={"text-3xl mt-8"}>
        order quantity</h1>
      <h3>Enter desired order quantity below.</h3>
      <input type={"number"} className={"focus:outline-none appearance-none bg-black text-white border border-white px-4  w-32"} value={orderQuantity} onChange={(e) => setOrderQuantity(parseInt(e.target.value))} />


      <h1 className={"text-3xl  mb-2 mt-8"}>
        place market order
      </h1>
      <h3>Nottingham will attempt to place a market {orderType == ORDER_TYPES.BUY ? 'buy' : 'sell'} order with the given quantity, then provide an update regarding the status.</h3>
      <button onClick={placeOrder} className={"bg-black text-white border border-white px-4 py-2 mt-2 hover:bg-white hover:text-black"}>
       place
      </button>

      {orderStatus.message !== '' && (
        <h3 className={"mt-8" + (orderStatus.success ? ' text-green-500' : ' text-red-500')}>
          {orderStatus.success ? (<Emoji label={"success"} symbol={"✅"} />) : (<Emoji label={"failure"} symbol={"🛑"} />)}
          <br />
          {orderStatus.message}
        </h3>
        )
      }
    </div>
  )
}

export default UserOrdersView;