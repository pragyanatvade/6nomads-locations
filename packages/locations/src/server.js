import sourceMap from 'source-map-support';
import { defaultDbBehaviors } from 'cradle-dbal';

import {
  config, asyncReduceAndMerge, deps, debug, server, scope
} from 'cradle-utils';

import { name as packageName } from '../package.json';
import helpers from './models/helpers';
import schema from './models/schema';
import models from './models';
import routes from './routes';
import controllers from './controllers';

sourceMap.install();

asyncReduceAndMerge(
  server,
  routes,
  controllers,
  models,
  debug,
  scope,
  deps,
  config
)({
  packageName, defaultDbBehaviors, schema, helpers
});
