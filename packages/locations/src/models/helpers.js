import { asyncReduceAndMerge } from '6nomads-utils';
import {
  canPostProcess,
  // canPreProcess,
  // canGetFilter,
  canGetFilterAndFetchDoc,
  canGetFilterAndFetchResponse,
  canParseQueryAndFetchDocs,
  canGetFilterAndDeleteDocs,
  canUpsertAndFetchDoc
} from '6nomads-dbal';

export const canGetFilter = ({ deps: { _ } }) => ({
  getFilter: async ({
    body, path, user, headers, query
  }) => {
    const { _request_id: requestId, name } = body;
    const { id } = path;
    let filter = {};
    if (!_.isEmpty(requestId)) filter = { _request_id: requestId };
    if (!_.isEmpty(name)) filter = { name };
    if (!_.isEmpty(id)) filter = { $or: [{ _request_id: id }, { name: id }, { _id: id }] };
    return ({
      filter, user, headers, input: { ...body, ...path, ...query }
    });
  }
});


export const canPreProcess = ({ deps: { _, generateId } }) => ({
  preProcess: async ({
    input, filter, user, headers, data
  }) => {
    const { _request_id: requestId, name } = input;
    if (_.isEmpty(requestId)) _.set(input, '_request_id', name);
    if (_.isEmpty(data)) {
      const id = generateId();
      _.set(input, '_id', id);
    }
    const merged = {
      ...data,
      ...input
    };
    return ({
      data: merged, filter, user, headers, input
    });
  }
});


export const behaviors = asyncReduceAndMerge(
  canUpsertAndFetchDoc,
  canGetFilterAndDeleteDocs,
  canParseQueryAndFetchDocs,
  canGetFilterAndFetchResponse,
  canGetFilterAndFetchDoc,
  canPostProcess,
  canPreProcess,
  canGetFilter,
);

export default behaviors;
