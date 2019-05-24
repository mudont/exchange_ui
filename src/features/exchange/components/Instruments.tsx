import * as React from 'react';
import { RootState, OrderFormValues } from 'MyTypes';
import { connect } from 'react-redux'
import ReactTable from 'react-table'
// import FoldableTableHOC from 'react-table/lib/hoc/foldableTable'
//import './react_table_dark.css'
import { setCurrOrder } from '../actions';
//import ReactTooltip from 'react-tooltip'
import { unsubscribeSymbol } from '../../ws/actions';
//import { Instrument, Depth } from 'MyModels';
import { createSelector } from 'reselect'
//import eqProps from 'ramda/es/eqProps';
// const buyColor = '#cefdce'
// const sellColor = '#fdd3ce'
const buyColor = 'darkgreen'
const sellColor = 'darkred'
// const FoldableTable = FoldableTableHOC(ReactTable);
const RA: React.FC<{ children: any }> = ({ children }) => {
  return (<div style={{ textAlign: "right" }}> {children}</div>)
}
const BuyRA: React.FC<{ children: any }> = ({ children }) => {
  return (<button
    style={{
      backgroundColor: buyColor, borderRadius: 0,
      color: 'white', fontSize: 12, padding: "0px 0px", textAlign: "right", width: '100%'
    }}>
    {children}
  </button>)
}
const SellRA: React.FC<{ children: any }> = ({ children }) => {
  return (<button
    style={{
      backgroundColor: sellColor, borderRadius: 0,
      color: 'white', fontSize: 12, padding: "0px 0px", textAlign: "right", width: '100%'
    }}>
    {children}
  </button>)
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
      const asks = ladder.filter(e => e[2] > 0).slice().reverse()
      const bids = ladder.filter(e => e[0] > 0)
      const bestBidPrice = bids.length > 0 ? bids[0][1] : 0
      const bestBidQty = bids.length > 0 ? bids[0][0] : 0
      const bestAskPrice = asks.length > 0 ? asks[0][1] : 0
      const bestAskQty = asks.length > 0 ? asks[0][2] : 0
      //const depthLen = Math.max(bids.length - 1, asks.length - 1)
      
      return {
        ...i, bestBidQty, bestBidPrice, bestAskPrice, bestAskQty,
        bids: bids.filter((_, ix) => ix > 0),
        asks: asks.filter((_, ix) => ix > 0),
      }
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
  accessor: 'name', // Custom value accessors!
  foldable: true,
}, {
  Header: 'Hit',
  width: 25,
  filterable: false,
  Cell: () => <SellRA>Hit</SellRA>
}, {
  Header: () => <RA>BidQ</RA>,
  width: 40,
  filterable: false,
  accessor: 'bestBidQty',
  Cell: (props: { row: Tradeable, value: number }) =>
    <BuyRA>{props.value.toFixed(0)}</BuyRA>
}, {
  Header: () => <RA>Bid</RA>,
  width: 25,
  filterable: false,
  accessor: 'bestBidPrice',
  Cell: (props: { value: number }) => <BuyRA>{props.value.toFixed(0)} </BuyRA>
}, {
  Header: () => <RA>@</RA>,
  width: 14,
  filterable: false,
  Cell: () => <span style={{ fontSize: '10px' }}>@</span>
}, {
  Header: () => <RA>Ask</RA>,
  width: 25,
  filterable: false,
  accessor: 'bestAskPrice',
  Cell: (props: { value: number }) => <SellRA> {props.value.toFixed(0)}</SellRA>
}, {
  Header: () => <RA>AskQ</RA>,
  width: 40,
  filterable: false,
  accessor: 'bestAskQty',
  Cell: (props: { value: number }) => <SellRA>{props.value.toFixed(0)}</SellRA>
}, {
  Header: 'Lift',
  width: 25,
  filterable: false,
  Cell: () => <BuyRA>Lift</BuyRA>
}]

const Tbl: React.FC<Props> = (props) => {
  const data = Object.values(props.tradeables)

  //style={{ width: "100%", height: "100%", overflowX: 'hidden', overflowY: 'scroll' }}
  //console.log(`Instrument Tbl render`)
  return <ReactTable className='-striped' style={{ fontSize: '12px' }}
    filterable
    data={data as any}
    columns={columns}
    SubComponent={row => {
      return (
        <div style={{ padding: "1px" }}>
          <ReactTable className='-striped' style={{ fontSize: '12px' }}
            showPagination={false}
            pageSize={5}
            data={[[1, 2, 3, 4], [11, 22, 33, 44]]}
            columns={[
              { Cell: '', width: 225 },
              { Cell: 'Swp', width: 25 },
              { accessor: '0' },
              { accessor: '1' },
              { accessor: '2' },
            ]}
          />
        </div>)
    }}
    defaultFilterMethod={(filter, row, column) => {
      let rx: RegExp
      try {
        rx = new RegExp(filter.value, "i")
      } catch (e) {
        return false
      }
      return row[column.id].match(rx)
    }}
    getTdProps={(state: any, row: undefined | { original: Tradeable }, column: undefined | { id: string, Header: string }, instance: any) => {
      return {
        onClick: (e: Event, handleOriginal: Function) => {
          console.log(`row clicked`, column)
          if (row && column && column.Header === 'Hit') {
            const { symbol, bestBidPrice } = row.original
            console.log(`Hit clicked`)
            props.handleClick({
              symbol: symbol, is_buy: false, quantity: props.currOrder.quantity, limit_price: bestBidPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && (column.id === 'bestBidPrice' || column.id === 'bestBidQty')) {
            const { symbol, bestBidPrice } = row.original
            console.log(`bbpq clicked`)
            props.handleClick({
              symbol: symbol, is_buy: true, quantity: props.currOrder.quantity, limit_price: bestBidPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && (column.id === 'bestAskPrice' || column.id === 'bestAskQty')) {
            const { symbol, bestAskPrice } = row.original
            console.log(`bapq clicked`)
            props.handleClick({
              symbol: symbol, is_buy: false, quantity: props.currOrder.quantity, limit_price: bestAskPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && column.Header === 'Lift') {
            const { symbol, bestAskPrice } = row.original
            console.log(`Lift clicked`)
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
      <div style={{ backgroundColor: 'indianred', color: 'white', width: '100%' }}>
        <label className="dragHandle" style={{ fontWeight: 'normal' }}>
          Click on price columns to passively join bid/ask.
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
