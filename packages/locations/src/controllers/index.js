import {
  asyncReduceAndMerge, handleSuccess
} from '6nomads-utils';

const canFetchLocations = ({ deps: { _ }, actions: { executeAction } }) => ({
  createDoc: async ({ request }) => {
    const { body: { locations = [] } = {} } = request;
    const originsArr = [];
    const destinationsArr = [];
    let count = 0;
    _.forEach(locations, (location) => {
      if (count % 2 === 0) originsArr.push(location);
      else destinationsArr.push(location);
      count += 1;
    });
    const origins = _.reduce(originsArr, (acc, f) => `${acc}${f}|`, '');
    const destinations = _.reduce(destinationsArr, (acc, f) => `${acc}${f}|`, '');

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

    const resp = { data: record };
    return handleSuccess({ ...resp });
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
