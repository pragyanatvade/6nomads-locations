import _ from 'lodash';


const generateHash = (str) => {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i); // eslint-disable-line
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0; // eslint-disable-line
};

export const getPortNumber = (params) => {
  const { str = params, digits = 4 } = params || {};
  const hash = generateHash(str);
  const port = _.padEnd(hash % (10 ** digits), digits, '0');
  return port;
};

export default getPortNumber;
