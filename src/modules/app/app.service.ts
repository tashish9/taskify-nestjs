import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import CONSTANTS from 'config/constants';

const { JWT_SECRET } = CONSTANTS;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  signin() {
    const payload = {
      sample: 'payload',
    };

    const tokenPayload = Object.assign({ time: new Date().getTime() }, payload);
    const token = sign(tokenPayload, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { token };
  }
}
