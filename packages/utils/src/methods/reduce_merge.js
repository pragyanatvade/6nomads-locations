import Promise from 'bluebird'; // For environments without Promises.
import { compose, reverse, reduceRight } from 'lodash/fp'; // Or any functional utility library

const mergeFreeze = compose(
  Object.freeze,
  Object.assign,
);

const asyncReducer = (sum, fn) => Promise.resolve(fn(sum)).then(res => mergeFreeze({}, sum, res));

export const asyncReduceAndMerge = (...args) => (input = {}) => {
  let fns = args;
  if (Array.isArray(fns[0])) [fns] = args;
  return Promise.reduce(reverse(fns), asyncReducer, input);
};


const reducer = (fn, sum) => mergeFreeze({}, sum, fn(sum));

export const reduceAndMerge = (...args) => (input = {}) => {
  let fns = args;
  if (Array.isArray(fns[0])) [fns] = args;
  return reduceRight(reducer, input, fns);
};

export default asyncReduceAndMerge;
