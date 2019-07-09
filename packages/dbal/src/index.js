import sourceMap from 'source-map-support';
import * as dbBehaviors from './adapters/mongoose';

sourceMap.install();

module.exports = dbBehaviors;
