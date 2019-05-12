import { Instrument } from 'MyModels';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import {
  loadInstrumentsAsync,
  createInstrumentAsync,
  updateInstrumentAsync,
  deleteInstrumentAsync,
  setCurrOrder,
} from './actions';

const reducer = combineReducers({
  currOrder: createReducer({symbol:'', is_buy: true, quantity: 1, 
                            max_show_size:500, limit_price:1})
  .handleAction([setCurrOrder], (state, action) => ({
    ...state,
    ...action.payload
  })),

  isLoadingInstruments: createReducer(false as boolean)
    .handleAction([loadInstrumentsAsync.request], (state, action) => true)
    .handleAction(
      [loadInstrumentsAsync.success, loadInstrumentsAsync.failure],
      (state, action) => false
    ),
  
  instruments: createReducer([] as ReadonlyArray<Instrument>)
    .handleAction(
      [
        loadInstrumentsAsync.success,
        createInstrumentAsync.success,
        updateInstrumentAsync.success,
        deleteInstrumentAsync.success,
      ],
      (state, action) => action.payload
    )
    .handleAction(createInstrumentAsync.request, (state, action) => [
      ...state,
      action.payload,
    ])
    .handleAction(updateInstrumentAsync.request, (state, action) =>
      state.map(i => (i.symbol === action.payload.symbol ? action.payload : i))
    )
    .handleAction(deleteInstrumentAsync.request, (state, action) =>
      state.filter(i => i.symbol !== action.payload.symbol)
    )
    .handleAction(deleteInstrumentAsync.failure, (state, action) =>
      state.concat(action.payload)
    ),
});

export default reducer;
