import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/web/decorators/getUser.decorator';
import { Response } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.userService.register(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body) {
    const { username, password } = body;
    const user = await this.userService.validateUser({ username, password });
    if (!user) {
      throw new BadRequestException('用户或密码错误');
    }
    // 删除敏感字段
    const { password: _, ...safeUser } = user;

    const token = await this.userService.generateToken(user);
    return { token, user: safeUser };
  }

  @Post('update-password')
  async updatePassword(
    @Res() res: Response,
    @User('id') userId: number,
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
    @User('id') userId: number,
    @Body() updateAvatar: UpdateAvatarDto,
  ) {
    const data = await this.userService.updateAvatar(userId, updateAvatar);
    return res.status(data.code).send(data);
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const oldToken = req.headers.authorization?.split(' ')[1];
    return this.userService.refreshToken(oldToken);
  }
}
