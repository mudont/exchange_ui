import { RootAction, RootState, Services } from 'MyTypes';
import { Epic } from 'redux-observable';
// import { from, of } from 'rxjs';
import { filter, tap, ignoreElements, } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { wsSend } from './actions';
//import { getInstruments, getOrders, getTrades, getUser } from './selectors';


export const sendWsEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { ws }) =>
  action$.pipe(
    filter(isActionOf(wsSend)),
    tap(action => ws.send(action.payload)),
    ignoreElements()
  );

  // export const initWs: Epic<
  //   RootAction,
  //   RootAction,
  //   RootState,
  //   Services
  // > = (action$, store, { api, ws }) =>
  // action$.pipe(
  //   first(),
  //   tap(() => ws.init(store.dispatch))
  // );
