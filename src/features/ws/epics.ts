import { RootAction, RootState, Services } from 'MyTypes';
import { Epic } from 'redux-observable';
// import { from, of } from 'rxjs';
import { filter, tap, ignoreElements, throttleTime, } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { wsSend, wsReceive } from './actions';
//import { getInstruments, getOrders, getTrades, getUser } from './selectors';

export const wsErrorEpic: Epic<
RootAction,
RootAction,
RootState,
Services
> = (action$, state$, { ws, toast }) =>
action$.pipe(
  filter(isActionOf(wsReceive)),
  filter(action => action.payload._type === "Error"),
  tap((action) => {
    //console.log(`error : ${JSON.stringify(action)}`)
    toast.error(`Exchange error ${(action.payload as any).message || "No msg"}`)
  }),
  ignoreElements()
);

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

export const hydrateWsEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { ws }) =>
  action$.pipe(
    filter(isActionOf(wsReceive)),
    filter(action => action.payload._type === "Hello" || action.payload._type === "Order"),
    throttleTime(5*1000),
    tap(action => {
      ws.send({command: "get_instruments"})
      ws.send({command: "get_my_orders"})
      ws.send({command: "get_my_positions"})
    }),
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
