import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { User } from '../decorators/getUser.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('info')
  getInfo(@User('id') id: number) {
    return this.homeService.getInfo(id);
  }
}
