declare module 'MyTypes' {
  export type OrderFormValues = Pick<Order, 'symbol' | 'is_buy' | 'quantity' | 'max_show_size' | 'limit_price'> & {};
  export type MyOrder = {
    id: number,
    symbol: string,
    limit_price: number,
    order_time: string,
    quantity: number,
    filled_quantity: number,
    status: string,
    max_show_size: number,
  }
  export type MyPosition = {
    symbol: string,
    position: number,
    price: number,
    cost_basis: number,
    mkt_val: number,
    pnl: number,
    crash_risk: number,
  }
  //{"_type":"my_orders","id":138,"instrument":"IndPakWC19","
  // order_time":"2019-05-03 00:28:27.034882+00:00",
  // "quantity":40,"filled_quantity":0,"status":"WORKING","max_show_size":40}
}

declare module 'react-formik-ui';