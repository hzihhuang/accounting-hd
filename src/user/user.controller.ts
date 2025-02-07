import { Controller, Post, Body, Session, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  // 定义一个异步的注册方法，接收请求体、会话和响应对象作为参数
  async register(@Body() body, @Session() session, @Res() res) {
    if (!body) return res.status(400).send({ message: '请求参数错误' });
    const { username, password } = body;
    await this.userService.register({ username, password });
    // 如果用户注册成功
    return res.status(200).send({ message: 'User registered successfully' });
  }

  @Post('login')
  async login(@Body() body, @Session() session, @Res() res) {
    const { username, password } = body;
    const user = await this.userService.validateUser({ username, password });

    if (!user) {
      return res.status(401).send({ message: '用户或密码错误' });
    }
    session.user = { id: user.id, username: user.username };
    return res.send({ message: '登录成功', user: session.user });
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
