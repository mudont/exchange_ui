import { RootAction, MyOrder, MyPosition } from 'MyTypes';
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
}>;
const dfltSyms = new Set([])
//console.log(`hello Dflt syms: subs=${JSON.stringify(dfltSyms.values())}`)
const initHelloState: Hello = {
  _type: 'Hello',
  username: 'nobody', 
  connected: false,
  subscribedSymbols: dfltSyms
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
        const syms = new Set([...Array.from(state.subscribedSymbols.values()), 
          action.payload ])
        return {...state, subscribedSymbols: syms}
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
