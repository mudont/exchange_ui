import { RootAction } from 'MyTypes';
import { Trade, Order, Instrument, Hello } from 'MyModels';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';

import * as actions from './actions';

export type SandboxState = Readonly<{
  hello: Hello,
  instruments: ReadonlyArray<Instrument>;
  trades: ReadonlyArray<Trade>;
  orders: ReadonlyArray<Order>;
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
  }
});
