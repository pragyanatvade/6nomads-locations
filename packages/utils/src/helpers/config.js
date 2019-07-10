import dotenv from 'dotenv';
import path from 'path';

export const config = () => {
  console.log(path.join(__dirname, '../../../../.env'));
  dotenv.config({ path: process.env.LOCATIONS_ENV_FILE || path.join(__dirname, '../../../../.env') });
  const serverConf = {
    env: JSON.parse(JSON.stringify(process.env))
  };
  return ({ ...serverConf });
};

export default config;
