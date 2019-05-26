import { RootEpic } from 'MyTypes';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError, first, delay } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import {
  loadInstrumentsAsync,
  createInstrumentAsync,
  updateInstrumentAsync,
  deleteInstrumentAsync,
  submitOrderAsync,
  setCurrOrder,
  stopFlashingOrder,
} from './actions';
import { wsSend } from '../ws/actions'

export const submitOrderEpic: RootEpic = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(submitOrderAsync.request)),
    map((order) => {
      return wsSend({
        command: 'order',
        ...order.payload
      })
    })
  );// as Observable<any>;
export const loadInstrumentsEpic: RootEpic = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(loadInstrumentsAsync.request)),
    switchMap(() =>
      from(api.exchange.loadInstruments()).pipe(
        map(loadInstrumentsAsync.success),
        catchError(message => of(loadInstrumentsAsync.failure(message))),
      )
    )
  );// as Observable<any>;

export const createInstrumentsEpic: RootEpic = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(createInstrumentAsync.request)),
    switchMap(action =>
      from(api.exchange.createInstrument(action.payload)).pipe(
        map(createInstrumentAsync.success),
        catchError(message => of(createInstrumentAsync.failure(message)))
      )
    )
  );

export const updateInstrumentsEpic: RootEpic = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(updateInstrumentAsync.request)),
    switchMap(action =>
      from(api.exchange.updateInstrument(action.payload)).pipe(
        map(updateInstrumentAsync.success),
        catchError(message => of(updateInstrumentAsync.failure(message)))
      )
    )
  );

export const deleteInstrumentsEpic: RootEpic = (action$, state$, { api, toast }) =>
  action$.pipe(
    filter(isActionOf(deleteInstrumentAsync.request)),
    switchMap(action =>
      from(api.exchange.deleteInstrument(action.payload)).pipe(
        map(deleteInstrumentAsync.success),
        catchError(message => {
          toast.error(message);
          return of(deleteInstrumentAsync.failure(action.payload));
        })
      )
    )
  );

export const flashOnOrderChangeEpic: RootEpic = (action$, state$, { api, toast }) =>
  action$.pipe(
    filter(isActionOf(setCurrOrder)),
    delay(500),
    map(() => stopFlashingOrder())
  );

export const loadDataOnAppStart: RootEpic = (action$, store, { api }) =>
  action$.pipe(
    first(),
    map(loadInstrumentsAsync.request)
  );