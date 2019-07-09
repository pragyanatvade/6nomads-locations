import methods from '../methods';

const { getPortNumber } = methods;

export const server = ({
  deps, routes, name, debug
}) => {
  const { micro } = deps;
  const app = micro(routes);
  const port = process.env.PORT || getPortNumber(name);
  app.listen(port, () => {
    debug(`> ${name} server is running at ${port}`);
  });
};

export default server;
