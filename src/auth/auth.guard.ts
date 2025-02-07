import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {

  private readonly whiteList = ['/user/login', '/user/register']; // 白名单


  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (this.whiteList.includes(request.url)) return true; // 白名单直接通过验证

    // 检查 session 是否存在 user
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('请先登录');
    }

    return true; // 通过验证
  }
}