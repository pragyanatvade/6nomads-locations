import Boom from 'boom';
import _ from 'lodash';

export default ({
  error, data = {}, code = 500, display
}) => {
  console.error(error.stack);
  const err = new Boom(error.message, { statusCode: code, data });
  _.set(err, 'display', display);
  return err;
};
