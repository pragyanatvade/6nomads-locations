import _ from 'lodash';
import { send } from 'micro';

export const handleSuccess = ({
  data = {}, total = 0, meta = {}, query = {}
}) => {
  const resp = {
    success: true
  };

  if (_.isArray(data) && _.isNumber(total)) _.set(resp, 'paginate', { ...query, total });
  _.set(resp, 'meta', meta);
  _.set(resp, 'data', data);
  _.set(resp, 'message', {
    code: 200,
    debug: 'Request process successfully',
    display: 'Request processed successfully'
  });
  return resp;
};

export const handleError = ({
  error, code = 500, display, input, response
}) => {
  console.error(error.stack);
  const status = code;
  const defaultMessage = 'Error occured while handling the request';

  return send(response, status, {
    success: false,
    display,
    debug: {
      code: code || status,
      input,
      message: _.get(error, 'message', defaultMessage)
    }
  });
};


export default { handleSuccess, handleError };
