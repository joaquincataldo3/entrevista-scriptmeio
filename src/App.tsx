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

  // Aca esta la high order fucntion que hablabamos y un ejemplo de como podria quedar mas generica, 
  // despues en vez de llamar directo al fetchdata lo llamas como adentro del useEffect y lo podes hacer para cualquier funcion que necesites y con la cantidad de parametros que quieras

  const transformToUppercase = (...args: any) => {
    const [fn, ...params] = args
    const upperCaseParams = params.map( (param: string) => param.toUpperCase())
    fn(...upperCaseParams)
  }

  // Esto se puede separara en varias funciones para modularizar el codigo
  // Funcion de fetchdata en modulo aparte (encargada de hacer un request y devolver el resultado)
  // funcion de iniciallizar los datos (llama a fetchadata y a pushratecloses) asi queda la logica desacoplada

  const fetchData = async (coin: string, exchangeRate: string, period_id: string) => {
    const response = await axios.get(`${apiUrl}/${exchangeRate}/${coin}/history?period_id=${period_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CoinAPI-Key': apiKey
      }
    });
    const data = response.data;
    pushRateCloses(data);
  }

  // Se pueden mejorar los nombres en general, van sugerencias pushrateCloses por parseCryptoData, rateCloses por price
  const pushRateCloses = (data: any) => {
    let rateClosesMatrix: any = [["Period Start", "Rate Close"]];
    for (let i = 0; i < data.length; i++) {
      let position = data[i];
      let rateClose = [position.time_period_start, position.rate_close]
      rateClosesMatrix.push(rateClose);
    }
    setData(rateClosesMatrix);
  }

  useEffect(() => {
    // Se llama asi, primer argumento la funcion y despues todos los parametros
    transformToUppercase(fetchData, coin, exchangeRate, periodId)
  }, [])

  // La grafica se podria haber hecho en un componente a parte y encapsular la logica del renderizado (estilos, opciones, etc) ahi
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
