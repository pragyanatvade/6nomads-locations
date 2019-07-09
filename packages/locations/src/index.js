import sourceMap from 'source-map-support';

import models from './models';
import routes from './routes';

sourceMap.install();

module.exports = {
  models,
  routes
};
