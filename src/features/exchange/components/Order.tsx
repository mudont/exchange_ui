import React from 'react';
import { Dispatch } from 'redux';
import { Form, FormikProps, Field, withFormik, ErrorMessage } from 'formik';
//import { Form, Radio /*, Input, Datepicker, Select, PhoneInput, Toggle, DropZone, Textarea, Checkbox, SubmitBtn, Button */} from 'react-formik-ui';
import { RootState, RootAction, OrderFormValues } from 'MyTypes';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import Autocomplete from 'react-autocomplete'

import { submitOrderAsync, setCurrOrder } from '../actions';
import { Instrument } from 'MyModels';
import { subscribeSymbol } from '../../ws/actions';
import { FuzzyChooser } from './FuzzyChooser'
// import { getPath } from '../../../router-paths';
import './Order.css';


const dispatchProps = (dispatch: Dispatch<RootAction>) => ({
  submitOrder: (values: OrderFormValues) => {
    dispatch(setCurrOrder(values))
    dispatch(submitOrderAsync.request({
      ...values,
    }))
  },
  // handleSymbolChange: (formAction: any) => {
  //   //dispatch(subAction)
  //   dispatch(formAction)
  // },
  dispatch,
});
const buyColor = '#cefdce'
const sellColor = '#fdd3ce'
// const menuStyle = {
//   borderRadius: '3px',
//   boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
//   background: 'rgba(255, 255, 255, 0.9)',
//   padding: '2px 0',
//   fontSize: '90%',
//   position: 'fixed' as any,
//   overflow: 'auto',
//   top: '100px',
//   //maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
// }
type Props = ReturnType<typeof dispatchProps> & {
  order: OrderFormValues & { flashRequestCount: number },
  instruments: ReadonlyArray<Instrument>,
};
const LABEL_WIDTH = '100px'
const label_style = { display: 'block', width: LABEL_WIDTH }

const InnerForm: React.FC<Props & FormikProps<OrderFormValues>> = props => {
  const { isSubmitting, order, instruments, values,
    setFieldValue, dispatch, errors, touched } = props;
  //const symbols = instruments.map(i => ({label: i.symbol}))
  const validateRange = (field: string, minVal: number, maxVal: number) => (value: number): string =>
    (value < minVal || value > maxVal) ? `${field} must be between ${minVal} and ${maxVal}` : ""
  const titleBgColor = values.is_buy === "1" ? 
          (order.flashRequestCount > 0 ? 'lightgreen' : buyColor) : 
          (order.flashRequestCount > 0 ? 'crimson' : sellColor)
  const formBgColor = order.flashRequestCount > 0 ? 
    (values.is_buy === "1" ? 'lightgreen' : 'crimson') : 
    '#d3edf8'
  return (
    <div style={{ backgroundColor: formBgColor, overflow: 'hidden', border: 1, }}>
      <label style={{
        display: 'block', textAlign: 'center', font: '10px', fontWeight: 'bold',
        backgroundColor: titleBgColor
      }}>
        Place Order Here
      </label>
      <Form>
        <div>
          <label htmlFor="symbol" style={label_style}>Symbol</label>
          <FuzzyChooser
            events={instruments}
            value={values.symbol}
            onBlur={(e: any) => {

              //console.log(`DEBUG subscribing ${e.target.value}`)
              dispatch(subscribeSymbol(e.target.value))
            }
            }
            onChange={(e: any, { newValue }) => {
              setFieldValue('symbol', newValue)
            }
            }
          />

          <ErrorMessage name="symbol" />
        </div>

        <div>
          {/* <label htmlFor="is_buy" style={label_style}>Buy?</label> */}
          <Field key="is_buy" component="select" name="is_buy">
            <option value="1">Buy</option>
            <option value="0">Sell</option>
          </Field>

          <ErrorMessage name="is_buy" />
        </div>

        <div>
          <label htmlFor="limit_price" style={label_style}>Price Limit</label>
          <Field
            key="limit_price"
            name="limit_price"
            placeholder="LimitPrice"
            component="input"
            type="number"
            validate={validateRange('LimitPrice', 1, 99)}
            required
            autoFocus
            className={
              errors.limit_price && touched.limit_price ? 'text-input error' : 'text-input'
            }
          />
          <ErrorMessage name="limit_price" />
        </div>

        <div>
          <label htmlFor="quantity" style={label_style}> Quantity</label>
          <Field
            key="quantity"
            name="quantity"
            placeholder="Quantity"
            component="input"
            type="number"
            validate={validateRange('Quantity', 1, 500)}
            required
            autoFocus
            className={
              errors.quantity && touched.quantity ? 'text-input error' : 'text-input'
            }
          />
          <ErrorMessage name="quantity" />
        </div>

        <div>
          <label htmlFor="max_show_size" style={label_style}> Max Show</label>
          <Field
            key="max_show_size"
            name="max_show_size"
            placeholder="MaxShowSize"
            component="input"
            type="number"
            validate={validateRange('MaxShowSize', 25, 1000)}
            autoFocus
            className={
              errors.max_show_size && touched.max_show_size ? 'text-input error' : 'text-input'
            }
          />
          <ErrorMessage name="max_show_size" />
        </div>
        <button key="submit" type="button" disabled={isSubmitting} onClick={() => { props.handleSubmit() }}>
          Submit
      </button>
      </Form>
      <div style={{ backgroundColor: '#eee' }}>
        <hr />
        <br />
        Examples of ultra-safe <br />
        orders that won't lose,<br />
        probably won't get<br />
        filled either:
       <pre style={{ backgroundColor: 'lightsteelblue', fontWeight: 900 }}>
          Symbol: England*<br />
          Buy <br />
          Price Limit: 1<br />
          Quantity: 1<br />
          Max Show: 500<br />
        </pre>

        <pre style={{ backgroundColor: 'lightsteelblue', fontWeight: 900 }}>
          Symbol: Afghanistan*<br />
          Sell <br />
          Price Limit: 99<br />
          Quantity: 1<br />
          Max Show: 500<br />
        </pre>
        To get a feel for the
      site,<br />
        Feel free to fill out <br />
        and Submit either<br />
        of those examples above.<br />
        You will see your orders<br />
        in the MyOrders window<br />
        Then try canceling them<br />
        by clicking on the Red<br />
        X in the MyOrders window.<br />
        <br />
        A more interesting order,<br />
        might be:
      <pre style={{ backgroundColor: 'lightsteelblue', fontWeight: 900 }}>
          Symbol: IndWChamp19<br />
          Buy <br />
          Price Limit: 22<br />
          Quantity: 100<br />
          Max Show: 500<br />
        </pre>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  username: state.ws.hello.username,
  instruments: Object.values(state.ws.instruments),
  order: state.exchange.currOrder,
});

export default compose(
  connect(
    mapStateToProps,
    dispatchProps
  ),
  withFormik<Props, OrderFormValues>({
    enableReinitialize: true,
    // initialize values
    mapPropsToValues: ({ order: data }) => ({
      symbol: (data && data.symbol) || '',
      is_buy: (data && data.is_buy ? "1" : "0"),
      quantity: (data && data.quantity) || 0,
      max_show_size: (data && data.max_show_size) || 0,
      limit_price: (data && data.limit_price) || 0,
      flashRequestCount: (data && data.flashRequestCount) || 0,
    }),
    handleSubmit: (values, form) => {
      const cleanedValues = { ...values, is_buy: (values.is_buy === "1" ? true : false) }

      form.props.submitOrder(cleanedValues);
      form.setSubmitting(false);
    },
  })
)(InnerForm);
