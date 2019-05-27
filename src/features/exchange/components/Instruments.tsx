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
import ReactTooltip from 'react-tooltip'
import { wsSend } from '../../ws/actions';
import * as R from 'ramda'
// const buyColor = '#cefdce'
// const sellColor = '#fdd3ce'
//type SymBsPriceArr = Array<MyOrder>
type SymBsPriceSumm = { myQty: number, myFilled: number, mySlice: number, ids: Array<number> }
type SymBsMap = { [limit_price: number]: SymBsPriceSumm }
type SymMap = { [bs: number]: SymBsMap }
type MyOrderMap = { [symbol: string]: SymMap }

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
  myBids?: SymBsPriceSumm | null,
  myAsks?: SymBsPriceSumm | null,
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
const myOrdersSelector = (state: RootState) => Object.values(state.ws.my_orders)
const tradeableSelector = createSelector(
  instrSelector,
  depthSelector,
  myOrdersSelector,
  (instruments, depth, myOrders) => {


    let myOrderMap: MyOrderMap = {} as { [symbol: string]: {} }

    for (let i = 0; i < myOrders.length; i++) {
      const { id, symbol, is_buy, limit_price, quantity, filled_quantity, curr_slice, status } = myOrders[i]
      if (status !== 'WORKING') continue
      if (!myOrderMap.hasOwnProperty(symbol)) myOrderMap[symbol] = {} as SymMap
      let symMap: SymMap = myOrderMap[symbol]
      const bs = is_buy ? 1 : 0
      if (!symMap.hasOwnProperty(bs)) symMap[bs] = {} as SymBsMap
      let symBsMap: SymBsMap = symMap[bs]
      if (!symBsMap.hasOwnProperty(limit_price)) symBsMap[limit_price] = { myQty: 0, myFilled: 0, mySlice: 0, ids: [] }
      let symBsPriceSumm: SymBsPriceSumm = symBsMap[limit_price]

      symBsPriceSumm.myQty += quantity
      symBsPriceSumm.myFilled += filled_quantity
      symBsPriceSumm.mySlice += curr_slice
      symBsPriceSumm.ids.push(id)
    }
    const getMyOrders = (symbol?: string, is_buy?: boolean, limit_price?: number | null) => {
      if (!(symbol && limit_price && (is_buy !== undefined && is_buy !== null))) return null
      if (!myOrderMap.hasOwnProperty(symbol)) return null
      const bs = is_buy ? 1 : 0
      if (!myOrderMap[symbol].hasOwnProperty(bs)) return null
      if (!myOrderMap[symbol][bs].hasOwnProperty(limit_price)) return null
      return myOrderMap[symbol][bs][limit_price]
    }
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
          myBids: getMyOrders(ins.symbol, true, bidPrice),
          myAsks: getMyOrders(ins.symbol, false, askPrice),
        })
      }
      console.log(`${ins.symbol} : myBids:`, getMyOrders(ins.symbol, true, bestBidPrice), getMyOrders(ins.symbol, false, bestAskPrice))
      return {
        ...ins, bestBidQty, bestBidOdds: !bestBidPrice || ins.symbol.match(/\*$/) ? '' : probToOdds(bestBidPrice), bestBidPrice,
        bestAskPrice, bestAskQty, bestAskOdds: !bestAskPrice || ins.symbol.match(/\*$/) ? '' : probToOdds(100 - bestAskPrice),
        myBids: getMyOrders(ins.symbol, true, bestBidPrice),
        myAsks: getMyOrders(ins.symbol, false, bestAskPrice),
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
  wsSend: typeof wsSend,
}
type ExpanderProps = {
  isExpanded: boolean | undefined,

}
const BuyButtonNum = (cn: string) => (props: { row: Tradeable | DepthLevel, value: number }) => props.row[cn] ? 
  <label data-tip="Click here to join the bid at this level"><BuyRA>{props.value.toFixed(0)} </BuyRA></label> : <div />
const SellButtonNum = (cn: string) => (props: { row: Tradeable | DepthLevel, value: number }) => props.row[cn] ? 
  <label data-tip="Click here to join the ask at this level"><SellRA>{props.value.toFixed(0)} </SellRA> </label>: <div />
const BuyButtonStr = (cn: string) => (props: { row: Tradeable | DepthLevel, value: string }) => props.row[cn] ? 
  <label data-tip="Click here to join the bid at this level"><BuyRA>{props.value} </BuyRA> </label>: <div />
const SellButtonStr = (cn: string) => (props: { row: Tradeable | DepthLevel, value: string }) => props.row[cn] ? 
  <label data-tip="Click here to join the bid at this level"><SellRA>{props.value} </SellRA></label> : <div />

const AggressFld = (myQuotes: SymBsPriceSumm, quoteQty: number | null, buy: boolean, label: string, wsSend: Function) => {

  console.log(`In Instr subTbl `, quoteQty, buy, myQuotes)
  if (myQuotes) {
    const { myQty, myFilled, mySlice, ids } = myQuotes
    const tooltip = `You have Order(s) of ${myQty} at this level, of which ${mySlice} are shown, and ${myFilled} filled. Click on X to cancel order(s)`
    return <div style={{ fontSize: 10 }} >
      <ReactTooltip />
      <button
        style={{
          backgroundColor: 'red', borderRadius: 0,
          color: 'white', fontSize: 10, padding: "0px 0px",
        }}
        onClick={() => ids.map((id: number) => wsSend({ command: 'cancel', id }))}
      >
        X
     </button>
      <span data-tip={tooltip}> {`${mySlice}/${myQty}|${myFilled}`} </span>

    </div>
  } else if (quoteQty) {
    const tooltip = `Click here to populate Order Form on left. Then click Submit in Order form to send an aggressive order and get filled`
    return <span data-tip={tooltip}> {buy ? <BuyRA>{label}</BuyRA> : <SellRA>{label}</SellRA>}</span>
  }
  return <span> </span>
}

const bidHitCol = (wsSend: Function) => ({
  Header: 'Hit', width: 55, filterable: false,
  Cell: (props: { original: Tradeable, row: Tradeable, value: number }) =>
    AggressFld(props.original.myBids, props.row.bestBidQty, false, 'Hit', wsSend)
})
const askLiftCol = (wsSend: Function) => ({
  Header: 'Lift', width: 55, filterable: false,
  Cell: (props: { original: Tradeable, row: Tradeable, value: number }) =>
    AggressFld(props.original.myAsks, props.row.bestAskQty, true, 'Lift', wsSend)
})

const bidSwpCol = (wsSend: Function) => ({
  Header: 'Sweep', accessor: 'bSwp', width: 55, filterable: false,
  Cell: (props: { original: Tradeable, row: DepthLevel, value: number }) =>
    AggressFld(props.original.myBids, props.row.bidQty, false, 'Sweep', wsSend)
  // (props.row.bidQty ? <SellRA>Sweep</SellRA> : <div />)
})
const askSwpCol = (wsSend: Function) => ({
  Header: 'Sweep', accessor: 'aSwp', width: 55, filterable: false,
  Cell: (props: { original: Tradeable, row: DepthLevel, value: number }) =>
    AggressFld(props.original.myAsks, props.row.askQty, true, 'Sweep', wsSend)
  //(props.row.askQty ? <BuyRA>Sweep</BuyRA> : <div />)
})
const atCol = { Header: () => <RA>@</RA>, width: 14, filterable: false, Cell: () => <span style={{ fontSize: '10px' }}>@</span> }
const bidQtyCol = (cn: string) => ({Header: () => <RA>Qty</RA>, width: 40, filterable: false, accessor: cn, Cell: BuyButtonNum(cn)})
const bidOddsCol = (cn: string) => ({ Header: () => <RA>Odds</RA>, width: 45, filterable: false, accessor: cn, Cell: BuyButtonStr(cn) })
const bidPriceCol = (cn: string) => ({ Header: () => <RA>Bid</RA>, width: 25, filterable: false, accessor: cn, Cell: BuyButtonNum(cn) })
const askPriceCol = (cn: string) => ({ Header: () => <RA>Ask</RA>, width: 25, filterable: false, accessor: cn, Cell: SellButtonNum(cn) })
const askOddsCol = (cn: string) => ({ Header: () => <RA>Odds</RA>, width: 45, filterable: false, accessor: cn, Cell: SellButtonStr(cn) })
const askQtyCol = (cn: string) => ({ Header: () => <RA>Qty</RA>, width: 40, filterable: false, accessor: cn, Cell: SellButtonNum(cn) })
const columns = (props: Props) => [{
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
    <div style={{ color: 'white' }}>
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
bidHitCol(props.wsSend),
bidQtyCol('bestBidQty'),
bidOddsCol('bestBidOdds'),
bidPriceCol('bestBidPrice'),
  atCol,
askPriceCol('bestAskPrice'),
askOddsCol('bestAskOdds'),
askQtyCol('bestAskQty'),
askLiftCol(props.wsSend)]

const noHdr = (o: {}) => R.omit(['Header'], o)

//  
const Tbl: React.FC<Props> = (props) => {
  const data = Object.values(props.tradeables)

  //style={{ width: "100%", height: "100%", overflowX: 'hidden', overflowY: 'scroll' }}
  //console.log(`Instrument Tbl render`)
  return <ReactTable className='-striped' style={{ fontSize: '12px' }}
    filterable
    data={data as any}
    columns={columns(props)}
    collapseOnDataChange={false}
    collapseOnSortingChange={false}
    collapseOnPageChange={false}
    SubComponent={(subprops: { original: Tradeable }) => {
      const row = subprops.original
      console.log(row)
      return (
        <div style={{ padding: "1px" }}>
          <ReactTable style={{ fontSize: '12px' }}
            // collapseOnDataChange={false}
            // collapseOnSortingChange={false}
            // collapseOnPageChange={false}
            showPagination={false}
            pageSize={row.moreLevels.length}
            data={row.moreLevels}
            columns={[
              { Cell: '', width: 220 },
              noHdr(bidSwpCol(props.wsSend)),
              noHdr(bidQtyCol('bidQty')),
              noHdr(bidOddsCol('bidOdds')),
              noHdr(bidPriceCol('bidPrice')),
              noHdr(atCol),
              noHdr(askPriceCol('askPrice')),
              noHdr(askOddsCol('askOdds')),
              noHdr(askQtyCol('askQty')),
              noHdr(askSwpCol(props.wsSend)),
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
                    //return
                  }
                  if (row && column && (column.id === 'bidPrice' || column.id === 'bidQty' || column.id === 'bidOdds')) {
                    const { symbol, bidPrice } = row.original
                    console.log(`bbpq clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: true, quantity: props.currOrder.quantity, limit_price: bidPrice,
                      max_show_size: props.currOrder.max_show_size
                    })
                    //return
                  }
                  if (row && column && (column.id === 'askPrice' || column.id === 'askQty' || column.id === 'askOdds')) {
                    const { symbol, askPrice } = row.original
                    console.log(`bapq clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: false, quantity: props.currOrder.quantity, limit_price: askPrice,
                      max_show_size: props.currOrder.max_show_size
                    })
                    //return
                  }
                  if (row && column && column.id === 'aSwp') {
                    const { symbol, askPrice, askSweepQty } = row.original
                    console.log(`Lift clicked`)
                    props.handleClick({
                      symbol: symbol, is_buy: true, quantity: askSweepQty, limit_price: askPrice,
                      max_show_size: props.currOrder.max_show_size
                    })
                    //return
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
        <ReactTooltip />
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
  wsSend: wsSend,
};

export default connect(mapStateToProps, dispatchProps)(Instruments);
