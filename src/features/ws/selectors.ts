// import { createSelector } from 'reselect';

import { SandboxState } from './reducer';

export const getTrades = (state: SandboxState) => state.trades;
export const getInstruments = (state: SandboxState) => state.instruments;
export const getOrders = (state: SandboxState) => state.orders;
export const getUser = (state: SandboxState) => state.hello.username;
