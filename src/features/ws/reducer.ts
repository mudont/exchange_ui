import { RootAction, MyOrder, MyPosition, LeaderBoard } from 'MyTypes';
import { Trade, Order, Instrument, Depth, Hello } from 'MyModels';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as R from 'ramda';

import * as actions from './actions';


export type SandboxState = Readonly<{
  hello: Hello,
  instruments: ReadonlyMap<string, Instrument>,
  trades: ReadonlyArray<Trade>,
  orders: ReadonlyArray<Order>,
  depth: Readonly<Depth>,
  my_orders: ReadonlyMap<number, MyOrder>,
  my_positions: ReadonlyMap<string, MyPosition>,
  leaderboard: { 
    data: ReadonlyArray<LeaderBoard>,
    clearLeaderBoardOnNewData: boolean,
  },
}>;

const initLeaderboard = {data: new Array<LeaderBoard>(), clearLeaderBoardOnNewData: false}
//console.log(`hello Dflt syms: subs=${JSON.stringify(dfltSyms.values())}`)
const initHelloState: Hello = {
  _type: 'Hello',
  username: 'nobody', 
  credit_limit: 0,
  connected: false,
  subscribedSymbols: new Set([]),
  unsubscribedSymbols: new Set([]),
}
export default combineReducers<SandboxState, RootAction>({
  hello: (state=initHelloState, action) => {
    //console.log(`hello reducer: subs=${JSON.stringify(state.subscribedSymbols.values())}`)
    switch (action.type) {

      case getType(actions.wsReceive):
        if ('Hello' === action.payload._type) {
            return {...state, ...action.payload, connected: true};
        } else if ('Close' === action.payload._type) {
          return initHelloState;
        } else if ('my_orders' === action.payload._type ||
                   'my_positions' === action.payload._type
          ) {
            const row = action.payload as unknown as MyOrder|MyPosition
            const sym = row.symbol
            const syms = new Set([...Array.from(state.subscribedSymbols.values()), 
              sym ])
            return {...state, subscribedSymbols: syms}
        } else {
          return state;
        }

      case getType(actions.subscribeSymbol):
        const arr = [...Array.from(state.subscribedSymbols.values()), 
          action.payload ]
        const syms = new Set(arr)
          //console.log(`DEBUG0 pl:${action.payload} sub: ${JSON.stringify(Array.from(syms.values()))}`)
        const unwanted1 = new Set(
          [...Array.from(state.unsubscribedSymbols.values())
            .filter(sym => sym !== action.payload )])
        //console.log(`DEBUG1 pl:${action.payload} ` + 
        //  ` has: ${syms.has('Eng > Pak')}` +
         // `sub: ${JSON.stringify(Array.from(unwanted1.values()))}`)
        return {...state, subscribedSymbols: syms, unsubscribedSymbols: unwanted1}

      case getType(actions.unsubscribeSymbol):
        const syms2 = new Set([...Array.from(state.unsubscribedSymbols.values()),
           action.payload])
        //console.log(`DEBUG2 ${action.payload } unsub: ${JSON.stringify(syms2)}`)

        return {...state, unsubscribedSymbols: syms2}

      default:
        return state;
    }
  },
  trades: (state=[], action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Trade' === action.payload._type) {
          return [action.payload, ...state, ];
        } else {
          return state;
        }
      default:
        return state;
    }
  },
  orders: (state=[], action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Order' === action.payload._type) {
          return [...state, action.payload];
        } else {
          return state;
        }
      default:
        return state;
    }
  },
  instruments: (state=new Map<string, Instrument>(), action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Instrument' === action.payload._type) {
          const data = action.payload as unknown as Instrument
            return {...state, [data.symbol]: data};
        } else {
          return state;
        }
      default:
        return state;
    }
  },

  my_orders: (state=new Map<number, MyOrder>(), action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('my_orders' === action.payload._type) {
          const data = action.payload as unknown as MyOrder
          return {...state, [data.id]: data};
        } else {
          return state;
        }
      default:
        return state;
    }
  },

  my_positions: (state=new Map<string, MyPosition>(), action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('my_positions' === action.payload._type) {
          const data = action.payload as unknown as MyPosition
          return {...state, [data.symbol]: data};
        } else {
          return state;
        }
      default:
        return state;
    }
  },
  leaderboard: (state=initLeaderboard, action) => {
    switch (action.type) {

      case getType(actions.wsClearBranchOnNewData):
        if ('leaderboard' === action.payload) {
            return {...state, clearLeaderBoardOnNewData: true}
        }
        return state;
 
      case getType(actions.wsReceive):
        if ('leaderboard' === action.payload._type) {
          const data = action.payload as unknown as LeaderBoard
          if (state.clearLeaderBoardOnNewData) {
            return {...initLeaderboard, data:[data], clearLeaderBoardOnNewData: false}
          }
          return {...state, data: [...state.data, data]};
        } else {
          return state;
        }
      default:
        return state;
    }
  },

  depth: (state={}, action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Depth' === action.payload._type) {
          return {...state, ...(R.omit(['_type','ts'],action.payload) as Depth)}; // 
        } else {
          return state;
        }
      default:
        return state;
    }
  },
  
});
