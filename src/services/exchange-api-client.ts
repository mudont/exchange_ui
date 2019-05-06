import { Instrument } from 'MyModels';

import * as localStorage from './local-storage-service';
import axios from 'axios'

let instruments: Instrument[] = localStorage.get<Instrument[]>('instruments') || [];

const TIMEOUT = 750;

export function loadInstruments(): Promise<Instrument[]> {
  return new Promise((resolve, reject) => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    //console.log(`Getting instruments from ${process.env.REACT_APP_API_SERVER_URL}.`)
    axios.get(proxyurl + process.env.REACT_APP_API_SERVER_URL + 'exchange/get_instruments/', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
    })
      .then((response) => {
        const data = response.data as unknown as {symbol:string, name: string}[]
        //console.log(` Instrument data: ${JSON.stringify(data, null, 4)}`)
        return resolve(data.map(i => ({_type: 'Instrument', ...i})))
      })
      .catch(error => {
        //console.error(`Error getting instruments: ${error}`)
        return reject(error)
      })
  });
}

export function createInstrument(instrument: Instrument): Promise<Instrument[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      instruments = instruments.concat(instrument);
      resolve(instruments);
    }, TIMEOUT);
  });
}

export function updateInstrument(instrument: Instrument): Promise<Instrument[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      instruments = instruments.map(i => (i.symbol === instrument.symbol ? instrument : i));
      resolve(instruments);
    }, TIMEOUT);
  });
}

export function deleteInstrument(instrument: Instrument): Promise<Instrument[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        reject("Intentional Delete failure 70% of the time. Keep trying. It should work")
      } else {
        instruments = instruments.filter(i => i.symbol !== instrument.symbol);
        resolve(instruments);
      }
    }, TIMEOUT);
  });
}
