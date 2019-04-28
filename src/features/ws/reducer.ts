import { RootAction } from 'MyTypes';
import { Trade, Order, Instrument, Depth, Hello } from 'MyModels';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as R from 'ramda';

import * as actions from './actions';


export type SandboxState = Readonly<{
  hello: Hello,
  instruments: ReadonlyArray<Instrument>;
  trades: ReadonlyArray<Trade>;
  orders: ReadonlyArray<Order>;
  depth: Readonly<Depth>;
}>;

export default combineReducers<SandboxState, RootAction>({
  hello: (state={_type: 'Hello', username: 'nobody'}, action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Hello' === action.payload._type) {
            return action.payload;
        } else {
          return state;
        }
      default:
        return state;
    }
  },
  instruments: (state=[], action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Instrument' === action.payload._type) {
            return [...state, action.payload];
        } else {
          return state;
        }
      default:
        return state;
    }
  },
  trades: (state=[], action) => {
    switch (action.type) {
      case getType(actions.wsReceive):
        if ('Trade' === action.payload._type) {
          return [...state, action.payload];
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
