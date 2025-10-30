import { BadRequestException, Body, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/admin/decorators/User.decorator';
import { Response } from 'express';
import { UpdatePasswordDto } from '@/admin/user/dto/update-password.dto';
import { AdminController } from '@/admin/AdminController';
import { CreateAdminUserDto } from '@/admin/user/dto/create-admin-user.dto';
import { Public } from '@/admin/decorators/Public.decorator';

@AdminController('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateAdminUserDto) {
    if (!body) throw new BadRequestException('请求参数错误');
    const user = await this.userService.register(body);
    return { user };
  }

  @Public()
  @Post('login')
  async login(@Body() body) {
    const { username, password } = body;
    const user = await this.userService.validateUser({ username, password });
    if (!user) {
      throw new BadRequestException('用户或密码错误');
    }
    const permissions = await this.userService.getUserPermissions(user.id);
    const roles = await this.userService.getUserRoles(user.id);
    const token = await this.userService.generateToken(user, roles);
    return {
      token,
      user,
      permissions, // 用户所有权限编码数组
      roles, // 用户所有角色编码数组
    };
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

  @Post('refresh-token')
  async refresh(@Req() req) {
    const oldToken = req.headers.authorization?.split(' ')[1];
    return this.userService.refreshToken(oldToken);
  }

  @Get('get-async-routes')
  async getAsyncRoutes(@User('id') userId: number) {
    return this.userService.getAsyncRoutes(userId);
  }
}
