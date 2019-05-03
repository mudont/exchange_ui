declare module 'MyTypes' {
  export type OrderFormValues = Pick<Order, 'symbol' | 'is_buy' | 'quantity' | 'max_show_size' | 'limit_price'> & {};
}

declare module 'react-formik-ui';