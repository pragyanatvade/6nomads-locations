import utilityMethods from '../methods';

const { reduceAndMerge } = utilityMethods;

const handleRest = async ({ request, axios, axiosRetry }) => {
  const {
    base, url, method, headers, params: { body, path, query }
  } = request;
  const client = axios.create({ baseURL: base });
  axiosRetry(client, { retries: 3 });
  const {
    data, status, statusText, headers: respHeaders
  } = await client({
    method, url, data: body, headers, params: { ...path, ...query }
  });
  return {
    ...data, status, statusText, headers: respHeaders
  };
};

const supportedProtocols = {
  rest: async ({
    protocol, request, axios, axiosRetry
  }) => {
    const resp = await handleRest({ request, axios, axiosRetry });
    return { protocol, request, ...resp };
  }
};

export const canExecuteAction = ({ deps: { _, axios, axiosRetry } }) => ({
  executeAction: async (params) => {
    const { protocol } = params;
    const request = _.get(params, protocol);
    if (_.isFunction(supportedProtocols[protocol])) {
      const resp = await supportedProtocols[protocol]({
        protocol, request, axios, axiosRetry
      });
      return resp;
    }
    return params;
  }
});

export const actions = async ({ deps }) => {
  const { _ } = deps;
  const methods = await reduceAndMerge(
    canExecuteAction
  )({ deps });
  const omitKeys = ['deps'];
  return ({
    actions: _.omit(methods, omitKeys)
  });
};

export default actions;
