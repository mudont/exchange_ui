import { createStandardAction } from 'typesafe-actions';
import { WsObject } from 'MyModels';


export const wsSend = createStandardAction('WS_SEND')<object>();
export const wsReceive = createStandardAction('WS_RECEIVE')<WsObject>();
export const wsClearBranch = createStandardAction('WS_CLEAR_BRANCH')<string>();
export const subscribeSymbol = createStandardAction('SUBSCRIBE_SYMBOL')<string>();
export const unsubscribeSymbol = createStandardAction('UNSUBSCRIBE_SYMBOL')<string>();