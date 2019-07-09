import methods from '../methods';

const { asyncReduceAndMerge } = methods;

export const model = async (conf) => {
  const {
    deps: { _ }, name, defaultDbBehaviors, schema, helpers
  } = conf;
  const omitKeys = [..._.keys(conf), 'name', 'schema', 'model'];

  const dbBehaviors = await asyncReduceAndMerge(
    helpers,
    defaultDbBehaviors
  )({ ...conf, name, schema });

  const behaviors = _.omit(dbBehaviors, omitKeys);

  return ({ models: behaviors });
};

export default model;
