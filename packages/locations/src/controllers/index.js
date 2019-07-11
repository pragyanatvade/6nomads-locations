import {
  asyncReduceAndMerge, handleSuccess
} from '6nomads-utils';

const canFetchLocations = ({ deps: { _ }, actions: { executeAction } }) => ({
  fetchDocs: async ({ request }) => {
    const { query } = request;
    const queryObj = _.isString(query) ? JSON.parse(query) : query;
    const { locations = [] } = queryObj;
    const originsArr = [];
    const destinationsArr = [];
    let count = 0;
    _.forEach(JSON.parse(locations), (location) => {
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
    const { rows } = await executeAction(options);
    const minDistances = {};
    _.forEach(rows, (row, i) => {
      const { elements } = row;
      let smallestDistance = Number.MAX_SAFE_INTEGER;
      _.forEach(elements, (element, j) => {
        const origin = originsArr[i];
        const destination = destinationsArr[j];
        const distance = _.get(element, 'distance.value');
        if (distance < smallestDistance) {
          _.set(minDistances, origin, destination);
          smallestDistance = distance;
        }
      });
    });
    const resp = { data: minDistances };
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
