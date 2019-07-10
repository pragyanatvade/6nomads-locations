import { asyncReduceAndMerge } from '6nomads-utils';

const canFetchLocations = () => ({
  createDoc: async ({ request, response }) => ({})
});

const controllers = async ({
  deps: { _ }, packageName
}) => {
  console.log('name', packageName);
  const methods = await asyncReduceAndMerge(canFetchLocations)({ name: packageName });
  return ({
    controllers: methods
  });
};

export default controllers;
