import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import articles from '../features/articles/reducer';
import ws from '../features/ws/reducer';
import exchange from '../features/exchange/reducer';
const rootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    articles,
    ws,
    exchange,
  });

export default rootReducer;
