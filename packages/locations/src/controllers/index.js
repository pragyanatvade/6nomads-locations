import {
  asyncReduceAndMerge, handleSuccess
} from '6nomads-utils';

const canFetchLocations = ({ deps: { _ }, actions: { executeAction } }) => ({
  createDoc: async ({ request }) => {
    const { body: { locations = [] } = {} } = request;
    const locationStr = _.reduce(locations, (acc, f) => `${acc}${f}|`, '');
    const origins = locationStr;
    const destinations = locationStr;

    const options = {
      protocol: 'rest',
      rest: {
        method: 'GET',
        base: 'https://maps.googleapis.com/maps/api/',
        url: 'distancematrix/json',
        params: {
          query: {
            units: 'imperial',
            origins,
            destinations,
            key: process.env.GOOGLE_MAP_API_KEY
          },
        }
      }
    };

    const record = await executeAction(options);
    return handleSuccess({ ...record });
  }
});

const controllers = async ({
  name, actions, deps
}) => {
  const methods = await asyncReduceAndMerge(canFetchLocations)({ name, actions, deps });
  return ({
    controllers: methods
  });
};

export default controllers;
