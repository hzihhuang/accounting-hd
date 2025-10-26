import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from '@/admin/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordDto } from '@/admin/user/dto/update-password.dto';
import { CreateAdminUserDto } from '@/admin/user/dto/create-admin-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly userRepository: Repository<AdminUser>,
    private jwtService: JwtService,
  ) {}

  // 生成 token
  async generateToken(user: AdminUser) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async register(createUserDto: CreateAdminUserDto) {
    const { password, username } = createUserDto;
    // 1️⃣ 先检查用户是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('用户已存在'); // 返回 400 错误
    }

    // 2️⃣ 加密密码并保存
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.userRepository.save({ username, password: hashedPassword });
  }

  async refreshToken(oldToken: string) {
    try {
      const payload = this.jwtService.verify(oldToken, {
        ignoreExpiration: true,
      });
      // 生成新 token
      const newToken = this.jwtService.sign(
        { sub: payload.sub, username: payload.username },
        { expiresIn: '7d' }, // 重新设置 7 天有效期
      );
      return newToken;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  // 校验用户（登录时用）
  async validateUser(createUserDto: CreateAdminUserDto) {
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return { code: 404, message: '用户不存在' };
    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.newPassword,
      updatePasswordDto.oldPassword,
    );
    if (!isPasswordValid)
      return { code: 400, message: '新密码不能与原密码一致' };
    const hashNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );
    await this.userRepository.update(userId, { password: hashNewPassword });
    return { code: 200, message: '修改密码成功' };
  }

  async getAsyncRoutes(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return { code: 404, message: '用户不存在' };
    return user.roles;
  }

  // 获取用户所有角色编码
  async getUserRoles(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    return user?.roles.map((role) => role.roleCode) || [];
  }

  // 获取用户所有权限编码
  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) return [];

    const permissions = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        if (permission.status === 1) {
          permissions.add(permission.permissionCode);
        }
      });
    });

    return Array.from(permissions);
  }
}
