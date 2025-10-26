import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
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

  async updateAvatar(userId: number, updateAvatar: UpdateAvatarDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return { code: 404, message: '用户不存在' };
    await this.userRepository.update(user.id, {
      avatar: updateAvatar.newAvatar,
    });
    return { code: 200, message: '修改头像成功' };
  }
}
