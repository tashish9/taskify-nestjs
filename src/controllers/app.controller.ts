import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  // @UseGuards(AuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
