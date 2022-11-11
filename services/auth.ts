import CONSTANTS from '../config/constants';
import { sign, verify } from 'jsonwebtoken';
const { JWT_SECRET } = CONSTANTS;

export const createToken = () => {
  const payload = {
    sample: 'payload',
  };

  const tokenPayload = Object.assign({ time: new Date().getTime() }, payload);
  return sign(tokenPayload, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const authenticateUserWithToken = async (auth: string | undefined) => {
  if (!auth) {
    throw new Error('Access Denied');
  }
  const authParts = auth.split(' ');
  if (authParts.length !== 2) {
    throw new Error('Access Denied');
  }
  const [scheme, token] = authParts;
  if (!new RegExp('^Bearer$').test(scheme)) {
    throw new Error('Access Denied');
  }

  await verify(token, JWT_SECRET);

  console.log('authentication successful');
};
