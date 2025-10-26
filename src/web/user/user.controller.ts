import { Body, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '@/web/decorators/getUser.decorator';
import { Response } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { WebController } from '@/web/WebController';

@WebController('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update-password')
  async updatePassword(
    @Res() res: Response,
    @GetUser('userId') userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const data = await this.userService.updatePassword(
      userId,
      updatePasswordDto,
    );
    return res.status(data.code).send(data);
  }

  @Post('update-avatar')
  async updateAvatar(
    @Res() res: Response,
    @GetUser('userId') userId: number,
    @Body() updateAvatar: UpdateAvatarDto,
  ) {
    const data = await this.userService.updateAvatar(userId, updateAvatar);
    return res.status(data.code).send(data);
  }
}
