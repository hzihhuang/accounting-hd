import { UserInfo } from '@/auth/jwt.strategy';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async updatePassword(curUser: UserInfo, newPassword: string) {
    // 查询有没有这个用户
    const user = await this.userRepository.findOne({ where: { id: curUser.userId } }) as User;
    const isPasswordValid = await bcrypt.compare(newPassword, user.password);
    if (!isPasswordValid) return { code: 400, message: '新密码不能与原密码一致' };
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(curUser.userId, { password: hashNewPassword })
    return { code: 200, message: '修改密码成功' };
  }

  async updateAvatar(curUser: UserInfo, newAvatar: string) {
    await this.userRepository.update(curUser.userId, { avatar: newAvatar })
    return { code: 200, message: '修改头像成功' };
  }
}
