export const scope = ({ deps: { _ }, packageName }) => {
  const name = _.split(packageName, '-')[1];
  return ({
    scope: `${packageName}*`,
    name
  });
};

export default scope;
