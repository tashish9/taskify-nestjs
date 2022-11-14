import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

import { Request } from 'express';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/signin')
  signIn() {
    return this.usersService.signin();
  }

  @Post('/signup')
  // @UseGuards(AuthGuard)
  signUp(@Req() req: Request) {
    return this.usersService.signUp(req.body);
  }

  @Get('/users')
  // @UseGuards(AuthGuard)
  users() {
    return this.usersService.users();
  }
}
