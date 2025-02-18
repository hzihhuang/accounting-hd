import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Public } from '@/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    if (!body) return res.status(400).send({ message: '请求参数错误' });
    const user = await this.authService.register(body);
    // 如果用户注册成功
    return res.send({ message: '注册成功', user });
  }

  @Public()
  @Post('login')
  async login(@Body() body, @Res() res) {
    const { username, password } = body;
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      return res.status(400).send({ message: '用户或密码错误' });
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
