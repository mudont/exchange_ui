import { routerActions } from 'connected-react-router';
import * as articlesActions from '../features/articles/actions';
import * as wsActions from '../features/ws/actions';
import * as exchangeActions from '../features/exchange/actions';

export default {
  router: routerActions,
  articles: articlesActions,
  ws: wsActions,
  exchange: exchangeActions,
};
