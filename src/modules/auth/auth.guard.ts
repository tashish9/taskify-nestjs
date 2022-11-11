import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import CONSTANTS from 'config/constants';
import { verify } from 'jsonwebtoken';
const { JWT_SECRET } = CONSTANTS;

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;
    if (!auth) {
      throw new UnauthorizedException('Access Denied');
    }
    const authParts = auth.split(' ');
    if (authParts.length !== 2) {
      throw new UnauthorizedException('Access Denied');
    }
    const [scheme, token] = authParts;
    if (!new RegExp('^Bearer$').test(scheme)) {
      throw new UnauthorizedException('Access Denied');
    }

    await verify(token, JWT_SECRET);
    console.log('authentication successful');
    return true;
  }
}
