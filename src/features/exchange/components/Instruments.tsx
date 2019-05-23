import * as React from 'react';
import { RootState, OrderFormValues } from 'MyTypes';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { setCurrOrder } from '../actions';
//import ReactTooltip from 'react-tooltip'
import { unsubscribeSymbol } from '../../ws/actions';
//import { Instrument, Depth } from 'MyModels';
import { createSelector } from 'reselect'
//import eqProps from 'ramda/es/eqProps';
const buyColor = '#cefdce'
const sellColor = '#fdd3ce'
const RA: React.FC<{ children: any }> = ({ children }) => {
  return (<div style={{ textAlign: "right" }}> {children}</div>)
}
const BuyRA: React.FC<{ children: any }> = ({ children }) => {
  return (<div style={{ backgroundColor: buyColor, fontWeight: 'bold', textAlign: "right" }}> {children}</div>)
}
const SellRA: React.FC<{ children: any }> = ({ children }) => {
  return (<div style={{ backgroundColor: sellColor, fontWeight: 'bold', textAlign: "right" }}> {children}</div>)
}

const instrSelector = (state: RootState) => Object.values(state.ws.instruments)
const depthSelector = (state: RootState) => state.ws.depth
const tradeableSelector = createSelector(
  instrSelector,
  depthSelector,
  (instruments, depth) => {
    return instruments.map(i => {
      const ladder = depth[i.symbol] || []
      //console.log(`${i.symbol} ladder: ${JSON.stringify(ladder, null, 4)}`)
      const asks = ladder.filter(e => e[2] > 0)
      const bids = ladder.filter(e => e[0] > 0)
      const bestBidPrice = bids.length > 0 ? bids[0][1] : 0
      const bestBidQty = bids.length > 0 ? bids[0][0] : 0
      const bestAskPrice = asks.length > 0 ? asks[asks.length - 1][1] : 0
      const bestAskQty = asks.length > 0 ? asks[asks.length - 1][2] : 0

      return { ...i, bestBidQty, bestBidPrice, bestAskPrice, bestAskQty }
    })
  }
)
type Tradeables = ReturnType<typeof tradeableSelector>
type Tradeable = Tradeables[0]
type Props = {
  tradeables: Tradeables,
  currOrder: OrderFormValues,
  handleClick: typeof setCurrOrder,
  unsubscribeSymbol: typeof unsubscribeSymbol,
}

const columns = [{
  Header: 'Symbol',
  width: 80,
  accessor: 'symbol' // String-based value accessors!
}, {
  id: 'name', // Required because our accessor is not a string
  Header: 'Name',
  width: 120,
  accessor: 'name' // Custom value accessors!
}, {
  Header: () => <RA>BidQty</RA>,
  width: 50,
  accessor: 'bestBidQty',
  Cell: (props: { row: Tradeable, value: number }) =>
    <BuyRA>
      <button
        style={{ backgroundColor: buyColor, fontSize: 12, padding: "0px 2px" }}>
        {props.value.toFixed(0)}
      </button>

    </BuyRA>
}, {
  Header: () => <RA>BidPrice</RA>,
  width: 50,
  accessor: 'bestBidPrice',
  Cell: (props: { value: number }) => <BuyRA>
    <button
      style={{ backgroundColor: buyColor, fontSize: 12, padding: "0px 2px" }}>
      {props.value.toFixed(0)}
    </button>

  </BuyRA>
}, {
  Header: () => <RA>AskPrice</RA>,
  width: 50,
  accessor: 'bestAskPrice',
  Cell: (props: { value: number }) => <SellRA>
    <button
      style={{ backgroundColor: sellColor, fontSize: 12, padding: "0px 2px" }}>
      {props.value.toFixed(0)}
    </button>

  </SellRA>
}, {
  Header: () => <RA>AskQty</RA>,
  width: 50,
  accessor: 'bestAskQty',
  Cell: (props: { value: number }) => <SellRA>
    <button
      style={{ backgroundColor: sellColor, fontSize: 12, padding: "0px 2px" }}>
      {props.value.toFixed(0)}
    </button>

  </SellRA>
}]

const Tbl: React.FC<Props> = (props) => {
  const data = Object.values(props.tradeables)

  //style={{ width: "100%", height: "100%", overflowX: 'hidden', overflowY: 'scroll' }}
  //console.log(`Instrument Tbl render`)
  return <ReactTable style={{ fontSize: '10px' }}
    filterable
    data={data as any}
    columns={columns}
    defaultFilterMethod={(filter, row, column) => {
      let rx: RegExp
      try {
        rx = new RegExp(filter.value, "i")
      } catch (e) {
        return false
      }
      return row[column.id].match(rx)
    }}
    getTdProps={(state: any, row: undefined | { original: Tradeable }, column: undefined | { id: string }, instance: any) => {
      return {
        onClick: (e: Event, handleOriginal: Function) => {
          console.log(`row clicked`, column)
          if (row && column && column.id === 'bestBidPrice') {
            const { symbol, bestBidPrice/*, bestAskPrice, bestBidQty, bestAskQty*/ } = row.original
            console.log(`bbp clicked`)
            props.handleClick({
              symbol: symbol, is_buy: false, quantity: props.currOrder.quantity, limit_price: bestBidPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && column.id === 'bestAskPrice') {
            const { symbol, bestAskPrice } = row.original
            console.log(`bbp clicked`)
            props.handleClick({
              symbol: symbol, is_buy: true, quantity: props.currOrder.quantity, limit_price: bestAskPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          // IMPORTANT! React-Table uses onClick internally to trigger
          // events like expanding SubComponents and pivots.
          // By default a custom 'onClick' handler will override this functionality.
          // If you want to fire the original onClick handler, call the
          // 'handleOriginal' function.
          if (handleOriginal) {
            handleOriginal()
          }
        }
      }
    }}
  />
}

const Instruments: React.FC<Props> = props => {
  //const { instruments, ladder, handleClick, unsubscribeSymbol } = props
  //console.log(`Instrument rendering`)
  return (
    <div
      style={{
        height: "100%", overflow: "hidden",
        // display:"flex", flexDirection: "column",
      }}>
      <div style={{ backgroundColor: buyColor, width: '100%' }}>
        <label className="dragHandle" style={{ fontWeight: 'bold' }}>
          Instruments. click on price columns to fill Order form.
         </label>
      </div>
      <div style={{ overflowX: 'hidden', height: '100%', width: '100%' }}>
        <Tbl {...props} />

      </div>
    </div>
  )
}


const mapStateToProps = (state: RootState, ) => ({
  tradeables: tradeableSelector(state),
  currOrder: state.exchange.currOrder,
});
const dispatchProps = {
  handleClick: setCurrOrder,
  unsubscribeSymbol: unsubscribeSymbol,
};

export default connect(mapStateToProps, dispatchProps)(Instruments);
