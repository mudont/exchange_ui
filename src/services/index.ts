import * as logger from './logger-service';
import * as articles from './articles-api-client';
import * as toast from './toast-service';
import * as localStorage from './local-storage-service';
import * as ws from './ws'

export default {
  logger,
  localStorage,
  toast,
  api: {
    articles,
  },
  ws: ws.default(),
};
