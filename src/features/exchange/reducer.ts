import { Instrument } from 'MyModels';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import {
  loadInstrumentsAsync,
  createInstrumentAsync,
  updateInstrumentAsync,
  deleteInstrumentAsync,
} from './actions';

const reducer = combineReducers({
  isLoadingInstruments: createReducer(false as boolean)
    .handleAction([loadInstrumentsAsync.request], (state, action) => true)
    .handleAction(
      [loadInstrumentsAsync.success, loadInstrumentsAsync.failure],
      (state, action) => false
    ),
  instruments: createReducer([] as Instrument[])
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
