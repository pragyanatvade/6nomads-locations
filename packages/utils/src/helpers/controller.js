import utilityMethods from '../methods';

const { asyncReduceAndMerge, handleError, handleSuccess } = utilityMethods;

export const canCreateDoc = ({ models: { upsertAndFetchDoc }, name, actions }) => ({
  createDoc: async ({ request, response }) => {
    const {
      params = {}, query = {}, body = {}, user, headers
    } = request;

    try {
      const record = await upsertAndFetchDoc({
        body, params, path: params, query, user, headers, actions
      });
      return handleSuccess({ ...record });
    } catch (error) {
      const display = 'Error occurred while creating a new document';
      return handleError({
        response,
        error,
        display,
        input: {
          body, path: params, query, user, headers, url: `/${name}`, method: 'post', protocol: 'rest'
        }
      });
    }
  }
});

export const canUpdateDoc = ({ models: { upsertAndFetchDoc }, name, actions }) => ({
  updateDoc: async ({ request, response }) => {
    const {
      params = {}, query = {}, body = {}, user, headers
    } = request;
    try {
      const record = await upsertAndFetchDoc({
        body, params, query, user, headers, path: params, actions
      });
      return handleSuccess(record);
    } catch (error) {
      const display = 'Error occurred while updating document';
      return handleError({
        response,
        error,
        display,
        input: {
          body, params, query, user, headers, url: `/${name}/:id`, method: 'put', protocol: 'rest'
        }
      });
    }
  }
});

export const canFetchDoc = ({ models: { getFilterAndFetchDoc }, name, actions }) => ({
  fetchDoc: async ({ request, response }) => {
    const {
      params = {}, query = {}, body = {}, user, headers
    } = request;
    try {
      const record = await getFilterAndFetchDoc({
        body, params, query, user, headers, path: params, actions
      });
      return handleSuccess(record);
    } catch (error) {
      const display = 'Error occurred while retrieving a document';
      return handleError({
        response,
        error,
        display,
        input: {
          body, params, query, user, headers, url: `/${name}/:id`, method: 'get', protocol: 'rest'
        }
      });
    }
  }
});

export const canFetchResponse = ({ models: { getFilterAndFetchResponse }, name, actions }) => ({
  fetchResponse: async ({ request, response }) => {
    const {
      params = {}, query = {}, body = {}, user, headers
    } = request;
    try {
      const record = await getFilterAndFetchResponse({
        body, params, query, user, headers, path: params, actions
      });
      return handleSuccess(record);
    } catch (error) {
      const display = 'Error occurred while retrieving the cached document response';
      return handleError({
        response,
        error,
        display,
        input: {
          body, params, query, user, headers, url: `/${name}/:id/response`, method: 'get', protocol: 'rest'
        }
      });
    }
  }
});

export const canFetchDocs = ({ models: { parseQueryAndFetchDocs }, name, actions }) => ({
  fetchDocs: async ({ request, response }) => {
    const {
      params = {}, query = {}, body = {}, user, headers
    } = request;
    try {
      const record = await parseQueryAndFetchDocs({
        body, params, query, user, headers, path: params, actions
      });
      return handleSuccess(record);
    } catch (error) {
      const display = 'Error occurred while retrieving the paginated documents';
      return handleError({
        response,
        error,
        display,
        input: {
          body, params, query, user, headers, url: `/${name}`, method: 'get', protocol: 'rest'
        }
      });
    }
  }
});

export const canDeleteDocs = ({ models: { getFilterAndDeleteDocs }, name, actions }) => ({
  deleteDocs: async ({ request, response }) => {
    const {
      params = {}, query = {}, body = {}, user, headers
    } = request;
    try {
      const record = await getFilterAndDeleteDocs({
        body, params, query, user, headers, path: params, actions
      });
      return handleSuccess(record);
    } catch (error) {
      const display = 'Error occurred while deleting the document';
      return handleError({
        response,
        error,
        display,
        input: {
          body, params, query, user, headers, url: `/${name}/:id`, method: 'delete', protocol: 'rest'
        }
      });
    }
  }
});

export const controllers = async ({
  deps: { _ }, models, name, actions
}) => {
  const methods = await asyncReduceAndMerge(
    canDeleteDocs,
    canFetchDocs,
    canFetchResponse,
    canFetchDoc,
    canUpdateDoc,
    canCreateDoc
  )({ models, actions, name });
  const omitKeys = ['models', 'actions', 'name'];
  return ({
    controllers: _.omit(methods, omitKeys)
  });
};

export default controllers;
