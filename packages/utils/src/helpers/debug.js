export const debug = ({ deps: { debug: debugMethod }, scope = 'cradle*' }) => {
  debugMethod.enable(scope);
  return ({
    debug: debugMethod(scope)
  });
};
export default debug;
