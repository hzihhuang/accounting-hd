import { Get, Query } from '@nestjs/common';
import { WebUserService } from './user.service';
import { AdminController } from '@/admin/AdminController';
import { GetUsersDto } from './dto/get-user-web.dto';

@AdminController('web-user')
export class WebUserController {
  constructor(private readonly userService: WebUserService) {}
  @Get()
  async findAll(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }
}
