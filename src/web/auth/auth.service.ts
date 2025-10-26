import { CreateUserDto } from '@/web/user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 生成 token
  async generateToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async register(createUserDto: CreateUserDto) {
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
        { expiresIn: '7d' }, // 重新设置 30 天有效期
      );
      return newToken;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  // 校验用户（登录时用）
  async validateUser(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }
}
