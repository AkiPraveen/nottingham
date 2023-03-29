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
  const isRed = marketPriceUsdCents < props.historyUsdCents[props.historyUsdCents[0]];

  return (
    <div className={"text-white flex flex-column w-6/12 " + (isRed ? "bg-red-500" : "bg-green-500")}>
      <div>{ticker}</div>
      <div>{quantity}</div>
      <div>{marketPriceUsdCents}</div>
    </div>
  )
}

export default StockChip