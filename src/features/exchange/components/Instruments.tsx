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
import * as R from 'ramda'
// const buyColor = '#cefdce'
// const sellColor = '#fdd3ce'

type DepthLevel = {
  symbol: string,
  bidQty: null | number,
  bidOdds: null | string,
  bidPrice: null | number,
  askPrice: null | number,
  askOdds: null | string,
  askQty: null | number,
  bidSweepQty: number,
  askSweepQty: number,
}
const buyColor = 'darkgreen'
const sellColor = 'darkred'
export const gcd = (num1: number, num2: number): number => {
  if (num1 === 0 || num2 === 0) { return 0 }
  if (num1 === num2) { return num1 }
  if (num1 > num2) { return gcd(num1 - num2, num2) }
  return gcd(num1, num2 - num1);
};

const probToOdds = (prob: number): string => {
  if (prob > 0 && prob < 1) { prob *= 100 }
  const f = gcd(Math.round(100 - prob), prob)
  return `${(100 - prob) / f}/${prob / f}`
}

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
    return instruments.map(ins => {
      const ladder = depth[ins.symbol] || []
      //console.log(`${i.symbol} ladder: ${JSON.stringify(ladder, null, 4)}`)
      const asks = ladder.filter(e => e[2] > 0).slice().reverse()
      const bids = ladder.filter(e => e[0] > 0)
      const bestBidQty = bids.length > 0 ? bids[0][0] : 0
      const bestBidPrice = bids.length > 0 ? bids[0][1] : 0
      const bestAskPrice = asks.length > 0 ? asks[0][1] : 0
      const bestAskQty = asks.length > 0 ? asks[0][2] : 0
      const depthLen = Math.max(bids.length, asks.length)
      let moreLevels: Array<DepthLevel> = [];
      let askSweepQty = bestAskQty
      let bidSweepQty = bestBidQty
      for (let i = 1; i < depthLen; i++) {
        let [bidQty, bidPrice] = (i < bids.length) ? [bids[i][0], bids[i][1]] : [null, null]
        let [askPrice, askQty] = (i < asks.length) ? [asks[i][1], asks[i][2]] : [null, null]
        if (askQty) askSweepQty += askQty
        if (bidQty) bidSweepQty += bidQty
        moreLevels.push({
          symbol: ins.symbol,
          bidQty, bidOdds: bidPrice && !ins.symbol.match(/\*$/) ? probToOdds(bidPrice) : null, bidPrice,
          askPrice, askOdds: askPrice && !ins.symbol.match(/\*$/) ? probToOdds(100 - askPrice) : null, askQty,
          bidSweepQty, askSweepQty,
        })
      }
      return {
        ...ins, bestBidQty, bestBidOdds: !bestBidPrice || ins.symbol.match(/\*$/) ? '' : probToOdds(bestBidPrice), bestBidPrice,
        bestAskPrice, bestAskQty, bestAskOdds: !bestAskPrice || ins.symbol.match(/\*$/) ? '' : probToOdds(100 - bestAskPrice),
        moreLevels,
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
type ExpanderProps = {
  isExpanded: boolean | undefined,

}
const BuyButtonNum = (cn: string) => (props: { row: Tradeable | DepthLevel, value: number }) => props.row[cn] ? <BuyRA>{props.value.toFixed(0)} </BuyRA> : <div />
const SellButtonNum = (cn: string) => (props: { row: Tradeable | DepthLevel, value: number }) => props.row[cn] ? <SellRA>{props.value.toFixed(0)} </SellRA> : <div />
const BuyButtonStr = (cn: string) => (props: { row: Tradeable | DepthLevel, value: string }) => props.row[cn] ? <BuyRA>{props.value} </BuyRA> : <div />
const SellButtonStr = (cn: string) => (props: { row: Tradeable | DepthLevel, value: string }) => props.row[cn] ? <SellRA>{props.value} </SellRA> : <div />

const bidHitCol = {
  Header: 'Hit', width: 40, filterable: false,
  Cell: (props: { row: Tradeable, value: number }) => (props.row.bestBidQty ? <SellRA>Hit</SellRA> : <div />)
}
const askLiftCol = {
  Header: 'Lift', width: 40, filterable: false,
  Cell: (props: { row: Tradeable, value: number }) => (props.row.bestAskQty ? <BuyRA>Lift</BuyRA> : <div />)
}

const bidSwpCol = {
  Header: 'Sweep', accessor: 'bSwp', width: 40, filterable: false,
  Cell: (props: { row: DepthLevel, value: number }) => (props.row.bidQty ? <SellRA>Sweep</SellRA> : <div />)
}
const askSwpCol = {
  Header: 'Sweep', accessor: 'aSwp', width: 40, filterable: false,
  Cell: (props: { row: DepthLevel, value: number }) => (props.row.askQty ? <BuyRA>Sweep</BuyRA> : <div />)
}
const atCol = { Header: () => <RA>@</RA>, width: 14, filterable: false, Cell: () => <span style={{ fontSize: '10px' }}>@</span> }
const bidQtyCol = (cn: string) => ({
  Header: () => <RA>Qty</RA>, width: 40, filterable: false, accessor: cn,
  Cell: (props: { row: Tradeable, value: number }) => props.row[cn] ? <BuyRA>{props.value.toFixed(0)}</BuyRA> : <div />
})
const bidOddsCol = (cn: string) => ({ Header: () => <RA>Odds</RA>, width: 45, filterable: false, accessor: cn, Cell: BuyButtonStr(cn) })
const bidPriceCol = (cn: string) => ({ Header: () => <RA>Bid</RA>, width: 25, filterable: false, accessor: cn, Cell: BuyButtonNum(cn) })
const askPriceCol = (cn: string) => ({ Header: () => <RA>Ask</RA>, width: 25, filterable: false, accessor: cn, Cell: SellButtonNum(cn) })
const askOddsCol = (cn: string) => ({ Header: () => <RA>Odds</RA>, width: 45, filterable: false, accessor: cn, Cell: SellButtonStr(cn) })
const askQtyCol = (cn: string) => ({ Header: () => <RA>Qty</RA>, width: 40, filterable: false, accessor: cn, Cell: SellButtonNum(cn) })
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
  expander: true,
  Header: '+/-',
  width: 20,
  filterable: false,
  Expander: ({ isExpanded, ...rest }: ExpanderProps) =>
    <div>
      {isExpanded
        ? <span>&#10134;</span>
        : <span>&#10133;</span>}
    </div>,
  style: {
    cursor: "pointer",
    fontSize: 12,
    padding: "0",
    textAlign: "center",
    userSelect: "none"
  },
},
  bidHitCol,
bidQtyCol('bestBidQty'),
bidOddsCol('bestBidOdds'),
bidPriceCol('bestBidPrice'),
  atCol,
askPriceCol('bestAskPrice'),
askOddsCol('bestAskOdds'),
askQtyCol('bestAskQty'),
  askLiftCol]
const noHdr = (o: {}) => R.omit(['Header'], o)

//  
const Tbl: React.FC<Props> = (props) => {
  const data = Object.values(props.tradeables)

  //style={{ width: "100%", height: "100%", overflowX: 'hidden', overflowY: 'scroll' }}
  //console.log(`Instrument Tbl render`)
  return <ReactTable className='-striped' style={{ fontSize: '12px' }}
    filterable
    data={data as any}
    columns={columns}
    SubComponent={(subprops: { original: Tradeable }) => {
      const row = subprops.original
      console.log(row)
      return (
        <div style={{ padding: "1px" }}>
          <ReactTable className='-striped' style={{ fontSize: '12px' }}
            showPagination={false}
            pageSize={row.moreLevels.length}
            data={row.moreLevels}
            columns={[
              { Cell: '', width: 220 },
              noHdr(bidSwpCol),
              noHdr(bidQtyCol('bidQty')),
              noHdr(bidOddsCol('bidOdds')),
              noHdr(bidPriceCol('bidPrice')),
              noHdr(atCol),
              noHdr(askPriceCol('askPrice')),
              noHdr(askOddsCol('askOdds')),
              noHdr(askQtyCol('askQty')),
              noHdr(askSwpCol),
            ]}
            getTdProps={(state: any, row: undefined | { original: DepthLevel }, column: undefined | { id: string, Header: string }, instance: any) => {
              return {
                onClick: (e: Event, handleOriginal: Function) => {
                  console.log(`row clicked`, row, column)
                  if (row && column && column.id === 'bSwp') {
                    const { symbol, bidPrice, bidSweepQty } = row.original
                    console.log(`Hit clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: false, quantity: bidSweepQty, limit_price: bidPrice,
                      max_show_size: props.currOrder.max_show_size
                    })
                  }
                  if (row && column && (column.id === 'bidPrice' || column.id === 'bidQty' || column.id === 'bidOdds')) {
                    const { symbol, bidPrice } = row.original
                    console.log(`bbpq clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: true, quantity: props.currOrder.quantity, limit_price: bidPrice,
                      max_show_size: props.currOrder.max_show_size
                    })
                  }
                  if (row && column && (column.id === 'askPrice' || column.id === 'askQty' || column.id === 'askOdds')) {
                    const { symbol, askPrice } = row.original
                    console.log(`bapq clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: false, quantity: props.currOrder.quantity, limit_price: askPrice,
                      max_show_size: props.currOrder.max_show_size
                    })
                  }
                  if (row && column && column.id === 'aSwp') {
                    const { symbol, askPrice, askSweepQty } = row.original
                    console.log(`Lift clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: true, quantity: askSweepQty, limit_price: askPrice,
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
            const { symbol, bestBidPrice, bestBidQty } = row.original
            console.log(`Hit clicked`)
            props.handleClick({
              symbol: symbol, is_buy: false, quantity: bestBidQty, limit_price: bestBidPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && (column.id === 'bestBidPrice' || column.id === 'bestBidQty' || column.id === 'bestBidOdds')) {
            const { symbol, bestBidPrice } = row.original
            console.log(`bbpq clicked`)
            props.handleClick({
              symbol: symbol, is_buy: true, quantity: props.currOrder.quantity, limit_price: bestBidPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && (column.id === 'bestAskPrice' || column.id === 'bestAskQty' || column.id === 'bestAskOdds')) {
            const { symbol, bestAskPrice } = row.original
            console.log(`bapq clicked`)
            props.handleClick({
              symbol: symbol, is_buy: false, quantity: props.currOrder.quantity, limit_price: bestAskPrice,
              max_show_size: props.currOrder.max_show_size
            })
          }
          if (row && column && column.Header === 'Lift') {
            const { symbol, bestAskPrice, bestAskQty } = row.original
            console.log(`Lift clicked`)
            props.handleClick({
              symbol: symbol, is_buy: true, quantity: bestAskQty, limit_price: bestAskPrice,
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
      <div className="dragHandle" style={{ cursor: 'arrow', backgroundColor: 'paleturquoise', color: 'black', width: '100%' }}>
        {/* <label  style={{ fontWeight: 'normal' }}> */}
        <span style={{ fontWeight: 'bold' }}>Instruments.</span>
        Click on price/qty columns to passively join bid/ask, on Hit/Lift to get done immediately
         {/* </label> */}
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
