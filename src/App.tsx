import axios from 'axios';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import './App.css';

const coin = "ETH";
const exchangeRate = "USD";
const periodId = "10DAY";

function App() {

  const apiUrl = "https://rest.coinapi.io/v1/exchangerate";
  const apiKey = "F11A11C0-A6F5-4D6A-5433-42FF831C10B1";
  const [data, setData] = useState<any>([]);

  const transformToUppercase = (constants: string[]) => {
    for(let i = 0; i < constants.length; i++) {
      constants[i].toUpperCase();
    }
    return constants;
  }

  const fetchData = async (coin: string, exchangeRate: string, period_id: string) => {
    const constantsArray = [coin, exchangeRate, period_id];
    const arrayToUpper = transformToUppercase(constantsArray);
    const coinUpper = arrayToUpper[0];
    const exchangeRateUpper = arrayToUpper[1];
    const periodIdToUpper = arrayToUpper[2];
    const response = await axios.get(`${apiUrl}/${exchangeRateUpper}/${coinUpper}/history?period_id=${periodIdToUpper}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CoinAPI-Key': apiKey
      }
    });
    const data = response.data;
    pushRateCloses(data);
  }

  const pushRateCloses = (data: any) => {
    let rateClosesMatrix: any = [];
    let columnsName = ["Period Start", "Rate Close"];
    rateClosesMatrix.push(columnsName);
    for (let i = 0; i < data.length; i++) {
      let position = data[i];
      let rateClose = [position.time_period_start, position.rate_close]
      //rateClose.push(position.time_period_start);
      //rateClose.push(position.rate_close);
      rateClosesMatrix.push(rateClose);
    }
    setData(rateClosesMatrix);
  }

  useEffect(() => {
    fetchData(coin, exchangeRate, periodId);
  }, [])

  const options = {
    title: `${coin} Performance`,
    hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    chartArea: { width: "90%", height: "70%" },
  };

  return (
    <div className='global-container'>
      <div className="bitcoin-list-container">
          {
            data.length > 0 &&
            <Chart
              chartType="AreaChart"
              width="100%"
              height="400px"
              data={data}
              options={options}
            />
          }
      </div>
    </div>
  )
}

export default App
