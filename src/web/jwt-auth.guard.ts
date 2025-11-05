import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/web/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // 先执行 JWT 验证
    const can = (await super.canActivate(context)) as boolean;
    if (!can) return false;
    // 进一步检查 tokenVersion 是否有效
    const request = context.switchToHttp().getRequest();
    const user = request.user; // payload 中的 user

    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: ['id', 'tokenVersion'],
    });

    if (!dbUser || dbUser.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('登录状态已失效，请重新登录');
    }

    return true;
  }
}
