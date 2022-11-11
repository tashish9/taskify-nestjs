import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  // @UseGuards(AuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/signin')
  signIn() {
    return this.appService.signin();
  }
}
