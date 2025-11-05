import { BadRequestException, Body, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '@/web/decorators/getUser.decorator';
import { Response } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { WebController } from '@/web/WebController';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@WebController('user')
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
    const token = await this.userService.generateToken(user);
    return { token, user };
  }

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

  @Post('refresh')
  async refresh(@Req() req) {
    const oldToken = req.headers.authorization?.split(' ')[1];
    return this.userService.refreshToken(oldToken);
  }
}
