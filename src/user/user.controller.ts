import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '@/decorators/public.decorator';
import { AuthService } from '@/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  // 定义一个异步的注册方法，接收请求体、会话和响应对象作为参数
  async register(@Body() body, @Res() res) {
    if (!body) return res.status(400).send({ message: '请求参数错误' });
    const { username, password } = body;
    const user = await this.userService.register({ username, password });
    // 如果用户注册成功
    return res.status(200).send({ message: '注册成功', user });
  }

  @Public()
  @Post('login')
  async login(@Body() body, @Res() res) {
    const { username, password } = body;
    const user = await this.userService.validateUser({ username, password });
    if (!user) {
      return res.status(401).send({ message: '用户或密码错误' });
    }
    const token = await this.authService.generateToken(user);
    return res.send({ message: '登录成功', token });
  }
}
