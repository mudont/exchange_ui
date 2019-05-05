import React from 'react';
import { Dispatch } from 'redux';
import { Form, FormikProps, Field, withFormik, ErrorMessage } from 'formik';
//import { Form, Radio /*, Input, Datepicker, Select, PhoneInput, Toggle, DropZone, Textarea, Checkbox, SubmitBtn, Button */} from 'react-formik-ui';
import { RootState, RootAction, OrderFormValues } from 'MyTypes';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Autocomplete from 'react-autocomplete'

import { submitOrderAsync } from '../actions';
import { Instrument } from 'MyModels';
import { subscribeSymbol } from '../../ws/actions';
// import { getPath } from '../../../router-paths';


const dispatchProps = (dispatch: Dispatch<RootAction>) => ({
  submitOrder: (values: OrderFormValues) =>
    dispatch(submitOrderAsync.request({
      ...values,
    })),
  handleSymbolChange: (subAction: ReturnType<typeof subscribeSymbol>, 
    formAction: any) => {
    dispatch(subAction)
    //dispatch(formAction)
  },
});
const buyColor = '#cefdce'
const sellColor = '#fdd3ce'
const menuStyle = {
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '2px 0',
  fontSize: '90%',
  position: 'fixed' as any,
  overflow: 'auto',
  top: '100px',
  //maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
}
type Props = ReturnType<typeof dispatchProps> & {
  order: OrderFormValues,
  instruments: ReadonlyArray<Instrument>,
};
const LABEL_WIDTH = '100px'
const label_style = {display: 'block', width: LABEL_WIDTH}

const InnerForm: React.FC<Props & FormikProps<OrderFormValues>> = props => {
  const { isSubmitting, order, instruments, values,
    handleSymbolChange, setFieldValue } = props;
  const symbols = instruments.map(i => ({label: i.symbol}))
  return (
    <div style={{backgroundColor: '#d3edf8', overflow:'hidden', border: 1,}}>
      <label style={{display: 'block', textAlign: 'center', font:'10px', fontWeight: 'bold',backgroundColor: order.is_buy ? buyColor: sellColor}}> Order </label>
    <Form>
      <div>
        <label htmlFor="symbol" style={label_style}>Event</label>
        <Autocomplete
              key="symbol"
              getItemValue={(item) => item.label}
              items={symbols}
              renderItem={(item, isHighlighted) => <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>{item.label}</div>}
              value={values.symbol}
              onChange={(e) => handleSymbolChange(
                subscribeSymbol(e.target.value),
                setFieldValue('symbol', e.target.value))
              }
              onSelect={(val) => handleSymbolChange(
                subscribeSymbol(val),
                setFieldValue('symbol', val))}
              renderMenu={(items, value, style) => {
                return <div style={{ ...style, ...menuStyle }} children={items}/>
              }}
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
          required
          autoFocus
        />
        <ErrorMessage name="symbol" />
      </div>

      <div>
        <label htmlFor="quantity" style={label_style}> Quantity</label>
        <Field
          key="quantity"
          name="quantity"
          placeholder="Quantity"
          component="input"
          type="number"
          required
          autoFocus
        />
        <ErrorMessage name="symbol" />
      </div>

      <div>
        <label htmlFor="max_show_size" style={label_style}> Max Show</label>
        <Field
          key="max_show_size"
          name="max_show_size"
          placeholder="MaxShowSize"
          component="input"
          type="number"
          autoFocus
        />
        <ErrorMessage name="symbol" />
      </div>
      <button key="submit" type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </Form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  username: state.ws.hello.username,
  instruments: state.ws.instruments,
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
      is_buy: (data && data.is_buy ? "1" : "0") ,
      quantity: (data && data.quantity) || 0,
      max_show_size: (data && data.max_show_size) || 0,
      limit_price: (data && data.limit_price) || 0,
    }),
    handleSubmit: (values, form) => {
      const cleanedValues = {...values, is_buy: (values.is_buy === "1" ? true : false)}

      form.props.submitOrder(cleanedValues);
      form.setSubmitting(false);
    },
  })
)(InnerForm);
