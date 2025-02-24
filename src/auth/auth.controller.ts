import { BadRequestException, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Public } from '@/decorators/public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    if (!body) throw new BadRequestException('请求参数错误');
    const user = await this.authService.register(body);
    return { user };
  }

  @Public()
  @Post('login')
  async login(@Body() body) {
    const { username, password } = body;
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new BadRequestException('用户或密码错误');
    }
    const token = await this.authService.generateToken(user);
    return { token, user };
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const oldToken = req.headers.authorization?.split(' ')[1];
    return this.authService.refreshToken(oldToken);
  }
}
