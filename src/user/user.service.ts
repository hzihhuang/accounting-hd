import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 定义一个异步方法 register，用于注册新用户
  async register(createUserDto: CreateUserDto) {
    // 从传入的 CreateUserDto 对象中解构出 password 和 username
    const { password, username } = createUserDto;

    // 1️⃣ 先检查用户是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('用户已存在'); // 返回 400 错误
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.userRepository.save({ username, password: hashedPassword });
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
