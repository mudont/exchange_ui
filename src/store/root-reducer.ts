import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import articles from '../features/articles/reducer';
import ws from '../features/ws/reducer';
const rootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    articles,
    ws,
  });

export default rootReducer;
