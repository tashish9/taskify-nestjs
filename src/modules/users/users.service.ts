import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import CONSTANTS from 'config/constants';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { z } from 'zod';

const { JWT_SECRET } = CONSTANTS;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {}

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

  signUp(userData: any) {
    const UserSignUpSchema = z.object({
      username: z.string().min(1),
    });

    UserSignUpSchema.parse(userData);

    const user = new User();
    user.username = userData.username;

    return this.usersRepository.save(user);
  }

  users() {
    return this.usersRepository.find();
  }
}
