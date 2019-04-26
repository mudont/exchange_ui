import { createStandardAction } from 'typesafe-actions';
import { WsObject } from 'MyModels';


export const wsSend = createStandardAction('WS_SEND')<object>();

export const wsReceive = createStandardAction('WS_RECEIVE')<WsObject>();
