import React from "react";
import {ResponsiveContainer, LineChart, Line, Tooltip, XAxis, Legend, CartesianGrid, YAxis} from 'recharts';
import Emoji from "../util/Emoji";

export type UserSearchViewProps = {
  backendUrl: string;
  authToken: string;
}

// Research data pulled from YFinance via backend
type SearchResultRequestData = {
  research: {
    after_hours: boolean,
    analyst_rating: string,
    exchange: string,
    exchange_time: string,
    history_3mo: number[],
    history_5d: number[],
    history_all_time: number[],
    name: string,
  }
}

const UserSearchView = (props: UserSearchViewProps) => {

  const {backendUrl, authToken} = props;

  const [tickerName, setTickerName] = React.useState<string>('');

  const [searchResultRequestData, setSearchResultRequestData] = React.useState<SearchResultRequestData>({research: {
      after_hours: false,
      analyst_rating: '',
      exchange: '',
      exchange_time: '',
      history_3mo: [],
      history_5d: [],
      history_all_time: [],
      name: '',
    }})

  const [status, setStatus] = React.useState<string>('');

  const search = () => {
    // Verify that a ticker was entered
    if (tickerName === '') {
      alert('Please enter a ticker.');
      return;
    }

    // Send request to backend
    fetch(`${backendUrl}/positions/${tickerName}/research`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setSearchResultRequestData(data);
        })
        setStatus('success');
      } else {
        console.log('Error: ' + response.status);
        setStatus('error')
      }
    }).catch(
      (error) => {
        setStatus('error')
        console.log('Error: ' + error);
    });

  };


  return (
    <div className={"text-white"}>
      <h1 className={"mt-8 text-3xl"}>
        search stocks
      </h1>
      <h3 className={"mb-2"}>
        Enter a ticker name and press 'search' to see the latest stock information. (Powered by Yahoo Finance)
      </h3>
      <div>
        <input type={"text"} className={"focus:outline-none appearance-none bg-black text-white border border-white px-4  w-32"} value={tickerName}
               onChange={(e) => setTickerName(e.target.value)}/>
      </div>

      <div className={"flex flex-column"}>
        <button onClick={search} className={"bg-black text-white border border-white px-4 py-2 mt-2 hover:bg-white hover:text-black"}>
        search
        </button>
        <h1 className={"text-5xl mt-2 ml-2"}>
          {
            status === 'success' && (
              <Emoji label={"success"} symbol={"✅"}/>
            )
          }
          {
            status === 'error' && (
              <Emoji symbol={"❌"}  label={"failure"}/>
            )
          }
        </h1>
      </div>

      <div>
        {status === 'success' && (
          <div className={"mt-8"}>
            <hr />
            <h1 className={"mt-8 text-3xl"}>
              Viewing information for {searchResultRequestData.research.name}
            </h1>

            <h3>
              After hours: {searchResultRequestData.research.after_hours ? "yes" : "no"}
            </h3>
            <h3>
              Analyst rating: {searchResultRequestData.research.analyst_rating}
            </h3>
            <br />
            <h3>
              Exchange: {searchResultRequestData.research.exchange}
            </h3>
            <h3>
              Exchange Time: {searchResultRequestData.research.exchange_time}
            </h3>

            <h2 className={"mt-8 text-2xl"}>
              Performance history:
            </h2>

            <div className={"w-full"}>
              <h3 className={"mb-2"}>
                all time performance:
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={100} data={
                  (searchResultRequestData.research.history_all_time).map(
                    (price, index) => {
                      return {price: (price / 100), time: index}
                    }
                  )
                }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend />
                  <YAxis />
                  <XAxis dataKey="time" />
                  <Line type="monotone" dataKey="price" stroke="#FFFFFF" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={"w-full"}>
              <h3 className={"mb-2"}>
                3 month performance:
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={100} data={
                  (searchResultRequestData.research.history_3mo).map(
                    (price, index) => {
                      return {price: (price / 100), time: index}
                    }
                  )
                }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend />
                  <YAxis />
                  <XAxis dataKey="time" />
                  <Line type="monotone" dataKey="price" stroke="#FFFFFF" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={"w-full"}>
              <h3 className={"mb-2"}>
                5 day performance (15 min intervals):
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart width={800} height={100} data={
                  (searchResultRequestData.research.history_3mo).map(
                    (price, index) => {
                      return {price: (price / 100), time: (index * 15)}
                    }
                  )
                }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend />
                  <YAxis />
                  <XAxis dataKey="time" />
                  <Line type="monotone" dataKey="price" stroke="#FFFFFF" />
                </LineChart>
              </ResponsiveContainer>
            </div>


          </div>
        )}
      </div>

    </div>
  )
}

export default UserSearchView;