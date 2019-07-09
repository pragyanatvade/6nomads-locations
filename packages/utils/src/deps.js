import _ from 'lodash';
import debug from 'debug';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import micro from 'micro';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import transduce from 'transducers-js';
import jsonpath from 'jsonpath';
import specs from '@vadelabs/specs';
import methods from './methods';

const { compose } = methods;

const deps = {
  _,
  debug,
  mongoose,
  bluebird,
  micro,
  axios,
  axiosRetry,
  jsonpath,
  transduce,
  generateId: compose(_.toString, mongoose.Types.ObjectId),
  specs
};

export default deps;
