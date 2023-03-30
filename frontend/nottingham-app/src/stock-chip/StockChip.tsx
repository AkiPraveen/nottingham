import { LineChart, Line } from 'recharts';


export type StockChipProps = {
  ticker: string;
  quantity: number;
  marketPriceUsdCents: number;
  historyUsdCents: number[];
}

const StockChip = (props: StockChipProps) => {
  const {ticker, quantity, marketPriceUsdCents, historyUsdCents} = props;

  // If the current price is less than the first element in the history, then the stock is red
  // If the stock is not red, it is green
  const isRed = (marketPriceUsdCents < props.historyUsdCents[0]);

  // console.log('ticker:' + ticker)
  // console.log('market price:' + marketPriceUsdCents)
  // console.log('history price:' + props.historyUsdCents[0])
  // console.log('is red:' + isRed)
  // console.log('------------------')

  const chartData =
    historyUsdCents.map(
      (price, index) => {
        return {
          index: index,
          price: price,
        }
      })

  console.log('chart data:', chartData)

  return (
    <div className={
      "text-white flex flex-column lg:w-8/12 md:w-10/12 sm:w-full h-36 mb-2 p-8" + (isRed ? " bg-red-500" : " bg-green-500")
    }>
      <div className={"w-4/12"}>
        <h3 className={"text-6xl"}>{ticker}</h3>
        <h3>{quantity} shares</h3>
      </div>
      <div className={"flex grow px-5"}>
        <LineChart width={280} height={100} data={
        chartData}>
          <Line type="monotone" dataKey="price"
          stroke={"#FFFFFF"} dot={false} activeDot={false}
                 />
        </LineChart>

      </div>
      <div className={"h-full flex items-center"}>
        <h1 className={"text-3xl"}>
          {(marketPriceUsdCents / 100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
        </h1>
      </div>
    </div>
  )
}

export default StockChip