import { combineEpics } from 'redux-observable';

import * as app from '../features/app/epics';
import * as articles from '../features/articles/epics';
import * as ws from '../features/ws/epics';
import * as exchange from '../features/exchange/epics';

export default combineEpics(
    ...Object.values(app),
    ...Object.values(articles),
    ...Object.values(ws),
    ...Object.values(exchange),
    );
