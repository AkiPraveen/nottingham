import UserPositionsView from "./UserPositionsView";

export type TradingPortalProps = {
  backendUrl: string;
  authToken: string;
}

const TradingPortal = (props: TradingPortalProps) => {

  const {backendUrl, authToken} = props;

  return (
    <>
      <div>hello world</div>
      <UserPositionsView backendUrl={backendUrl} authToken={authToken} />
    </>
  )
}

export default TradingPortal