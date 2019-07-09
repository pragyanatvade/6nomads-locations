
import { asyncReduceAndMerge, asyncCompose } from 'cradle-utils';

export const connect = async (config) => {
  const {
    deps: { mongoose, bluebird },
    env: { LOCATIONS_DB_URL, DB_OPTIONS = { useNewUrlParser: true } },
    schema,
    name
  } = config;
  mongoose.Promise = bluebird;
  const { Schema } = mongoose;
  await mongoose.connect(LOCATIONS_DB_URL, DB_OPTIONS);
  const model = await mongoose.model(
    name,
    new Schema(
      {
        _id: { type: String },
        ...schema
      }, {
        timestamps: {
          createdAt: 'created_on',
          updatedAt: 'modified_on'
        },
        autoIndex: false
      }
    )
  );
  return { model, name };
};

export const canCreateDoc = ({ deps: { mongoose, _ }, name }) => ({
  createDoc: async ({ data, user, headers }) => {
    if (_.isEmpty(_.get(data, '_id'))) _.set(data, '_id', _.toString(mongoose.Types.ObjectId()));
    const collection = await mongoose.connection.db.collection(name);
    const resp = await collection.insert(data);
    return { data: resp, user, headers };
  }
});

export const canUpdateDoc = ({ deps: { mongoose }, name }) => ({
  updateDoc: async ({
    filter, update, options = {}, user, headers
  }) => {
    const collection = await mongoose.connection.db.collection(name);
    const data = await collection.updateMany(filter, update, options);
    return {
      data, filter, user, headers
    };
  }
});

export const canAtomicUpdate = ({ deps: { mongoose, _ }, name }) => ({
  atomicUpdate: async ({
    filter, update, options = {}, user, headers
  }) => {
    _.extend(options, {
      upsert: true, returnOriginal: false
    });
    const collection = await mongoose.connection.db.collection(name);
    const { value: data } = await collection.findOneAndUpdate(filter, update, options);
    return {
      data, user, headers, filter
    };
  }
});

export const canUpsertDoc = ({ atomicUpdate, deps: { _, mongoose } }) => ({
  upsertDoc: async ({
    filter, data, user, headers
  }) => {
    if (_.isEmpty(_.get(data, '_id'))) _.set(data, '_id', _.toString(mongoose.Types.ObjectId()));
    const resp = await atomicUpdate({
      filter, update: { $set: data }, user, headers
    });
    return { ...resp };
  }
});

export const canFetchDocs = ({ deps: { mongoose, _ }, name }) => ({
  fetchDocs: async ({
    filter, skip = 0, limit = 24, sort = { _id: -1 }, count = true, user, headers, input
  }) => {
    const collection = await mongoose.connection.db.collection(name);
    const promises = [];

    if (count) {
      let countQuery = {};
      if (_.isEmpty(filter)) {
        countQuery = collection.estimatedDocumentCount();
      } else {
        countQuery = collection.countDocuments(filter);
      }
      promises.unshift(countQuery);
    }

    const query = collection.find(filter);
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    promises.unshift(query.toArray());
    const [data, total = 0] = await Promise.all(promises);
    return {
      data, total, user, headers, filter, skip, limit, sort, input
    };
  }
});

export const canDeleteDocs = ({ deps: { _ }, model, name }) => ({
  deleteDocs: async ({
    filter, input, user, headers
  }) => {
    if (_.isEmpty(filter)) return {};
    const collection = await model.connection.db.collection(name);
    const data = await collection.deleteMany(filter);
    return {
      data, filter, input, user, headers
    };
  }
});

export const canFetchDoc = ({ fetchDocs, deps: { _ } }) => ({
  fetchDoc: async ({
    filter, user, headers, input
  }) => {
    if (_.isEmpty(filter)) return {};
    const resp = await fetchDocs({
      filter, skip: 0, limit: 1, count: false, input, user, headers
    });
    return { ..._.omit(resp, ['data']), data: _.get(resp, 'data.[0]', {}) };
  }
});

export const canFetchResponse = ({ fetchDoc, deps: { _ } }) => ({
  fetchResponse: async ({
    filter, user, headers, input
  }) => {
    if (_.isEmpty(filter)) return {};
    const resp = await fetchDoc({
      filter, user, headers, input
    });
    return { ...resp };
  }
});

export const canGetFilter = ({ deps: { _ } }) => ({
  getFilter: async ({
    body, params, path, query, user, headers
  }) => {
    const { _request_id: requestId } = body;
    const { id } = params || path;
    const filter = {};
    if (!_.isEmpty(requestId)) _.set(filter, '_request_id', requestId);
    if (!_.isEmpty(id)) _.set(filter, '_id', id);
    return {
      filter, user, headers, input: { ...body, ...params, ...query }
    };
  }
});

export const canPreProcess = () => ({
  preProcess: async ({
    input, filter, user, headers, data
  }) => {
    const merged = { ...data, ...input };
    return ({
      data: merged, filter, user, headers, input
    });
  }
});

export const canPostProcess = () => ({
  postProcess: async params => ({ ...params })
});

export const canParseQuery = () => ({
  parseQuery: async () => ({})
});

export const defaultDbBehaviors = asyncReduceAndMerge(
  canParseQuery,
  canUpsertDoc,
  canAtomicUpdate,
  canDeleteDocs,
  canFetchResponse,
  canFetchDoc,
  canFetchDocs,
  canUpdateDoc,
  canCreateDoc,
  connect
);

export const canGetFilterAndFetchDoc = ({ getFilter, fetchDoc, postProcess }) => ({
  getFilterAndFetchDoc: asyncCompose(postProcess, fetchDoc, getFilter)
});
export const canGetFilterAndFetchResponse = ({ getFilter, fetchResponse, postProcess }) => ({
  getFilterAndFetchResponse: asyncCompose(postProcess, fetchResponse, getFilter)
});
export const canParseQueryAndFetchDocs = ({ parseQuery, fetchDocs, postProcess }) => ({
  parseQueryAndFetchDocs: asyncCompose(postProcess, fetchDocs, parseQuery)
});
export const canGetFilterAndDeleteDocs = ({ getFilter, deleteDocs }) => ({
  getFilterAndDeleteDocs: asyncCompose(deleteDocs, getFilter)
});
export const canUpsertAndFetchDoc = ({
  getFilterAndFetchDoc, upsertDoc, postProcess, preProcess
}) => ({
  upsertAndFetchDoc: asyncCompose(postProcess, upsertDoc, preProcess, getFilterAndFetchDoc)
});

export default defaultDbBehaviors;
