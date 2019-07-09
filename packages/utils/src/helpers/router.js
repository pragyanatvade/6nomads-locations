import Router from 'micro-ex-router';
import methods from '../methods';

const { compose } = methods;
// import auth from './auth';

export const router = Router({
  parseBody: true, // Tells the router to parse the body by default
  limit: '1mb', // How much data is aggregated before parsing at max. It can be a Number of bytes or a string like '1mb'.
  encoding: 'utf8',
  acceptedMethods: ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] // The methods that will be handled by the router
});

export const routes = ({
  controllers: {
    createDoc, updateDoc, fetchDoc, fetchResponse, fetchDocs, deleteDocs, healthCheck
  }, name
}) => {
  const api = name;
  router.post(`/${api}`, (request, response) => compose(createDoc)({ request, response }));
  router.put(`/${api}/:id`, (request, response) => compose(updateDoc)({ request, response }));
  router.get(`/${api}/:id`, (request, response) => compose(fetchDoc)({ request, response }));
  router.get(`/${api}/:id/response`, (request, response) => compose(fetchResponse)({ request, response }));
  router.get(`/${api}`, (request, response) => compose(fetchDocs)({ request, response }));
  router.delete(`/${api}/:id`, (request, response) => compose(deleteDocs)({ request, response }));
  router.options(`/${api}*`, (request, response) => compose(healthCheck)({ request, response }));

  return ({ routes: router });
};


export default routes;
