import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const privateKey = fs.readFileSync(path.join(__dirname, '../../private.key'));
const publicKey = fs.readFileSync(path.join(__dirname, '../../public.pem'));


/**
 * Generates a JWT access token
 *
 * @param  {Object}  data Data that should be encoded within JWT token
 * @return {String}       Returns the JWT access token
 */
export const generate = async ({ data }) => {
  try {
    const token = await jwt.sign(data, privateKey, { algorithm: 'RS256' });
    return token;
  } catch (error) {
    throw error;
  }
};

/**
 * Validates the JWT access token and returns the encoded value
 *
 * @param  {String}  token Token which needs to be validated and decoded
 * @return {Object}        Returns decoded object
 */

export const verify = async ({ token }) => {
  try {
    const doc = await jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return doc;
  } catch (error) {
    throw error;
  }
};

export default {
  generate,
  verify
};
