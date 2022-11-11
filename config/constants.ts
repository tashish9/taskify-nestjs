import { config } from 'dotenv';

config();

const CONSTANTS = {
  JWT_SECRET: 'a-jwt-secret',
  MONGO_URI: process.env.MONGO_URI,
};

export default CONSTANTS;
