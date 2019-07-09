
export const asyncCompose = (...args) => (input) => {
  let fns = args;
  if (Array.isArray(args[0])) [fns] = args;
  return fns.reduceRight(
    (chain, func) => chain.then(func), Promise.resolve(input)
  );
};

export const compose = (...args) => (input) => {
  let fns = args;
  if (Array.isArray(args[0])) [fns] = args;
  return fns.reduceRight((arg, fn) => fn(arg), input);
};

export default asyncCompose;
