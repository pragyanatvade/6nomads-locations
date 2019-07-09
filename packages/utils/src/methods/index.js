import { reduceAndMerge, asyncReduceAndMerge } from './reduce_merge';
import { compose, asyncCompose } from './compose';
import { getPortNumber } from './port_number';

import createError from './create_error';
import parseQuery from './parse_query';
import { handleSuccess, handleError } from './handle_response';
import parseVersion from './parse_version';
import jwt from './jwt';

module.exports = {
  reduceAndMerge,
  asyncReduceAndMerge,
  getPortNumber,
  compose,
  asyncCompose,
  createError,
  parseQuery,
  handleSuccess,
  handleError,
  parseVersion,
  jwt
};
