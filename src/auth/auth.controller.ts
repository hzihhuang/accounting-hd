import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Public } from '@/decorators/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Body() body, @Res() res) {
    if (!body) return res.status(400).send({ message: '请求参数错误' });
    const { username, password } = body;
    const user = await this.authService.register({ username, password });
    // 如果用户注册成功
    return res.status(200).send({ message: '注册成功', user });
  }

  @Public()
  @Post('login')
  async login(@Body() body, @Res() res) {
    const { username, password } = body;
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      return res.status(401).send({ message: '用户或密码错误' });
    }
    const token = await this.authService.generateToken(user);
    return res.send({ message: '登录成功', token });
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const oldToken = req.headers.authorization?.split(' ')[1];
    return this.authService.refreshToken(oldToken);
  }
}
