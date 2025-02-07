import { Controller, Post, Body, Session, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('login')
  async login(@Body() body, @Session() session, @Res() res) {
    const { username, password } = body;
    const user = await this.userService.validateUser({ username, password });

    if (!user) {
      return res.status(401).send({ message: '邮箱或密码错误' });
    }

    session.user = { id: user.id, username: user.username };
    return res.send({ message: '登录成功', user: session.user });
  }

  @Post('me')
  async getProfile(@Session() session, @Res() res) {
    if (!session.user) {
      return res.status(401).send({ message: '未登录' });
    }
    return res.send({ user: session.user });
  }

  @Post('logout')
  async logout(@Session() session, @Res() res) {
    session.destroy((err) => {
      if (err) {
        return res.status(500).send({ message: '登出失败' });
      }
      return res.send({ message: '登出成功' });
    });
  }
}