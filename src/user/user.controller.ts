import { Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '@/decorators/getUser.decorator';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('update-password')
  async updatePassword(@Res() res: Response, @GetUser() user, newPassword: string) {
    const data = await this.userService.updatePassword(user, newPassword);
    return res.status(data.code).send(data)
  }

  @Post('update-avatar')
  async updateAvatar(@Res() res: Response, @GetUser() user, newAvatar: string) {
    const data = await this.userService.updateAvatar(user, newAvatar);
    return res.status(data.code).send(data)
  }
}
