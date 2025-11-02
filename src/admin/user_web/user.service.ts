import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/web/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-user-web.dto';

@Injectable()
export class WebUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: GetUsersDto) {
    const { page = 1, pageSize = 10, keyword, status } = query;
    const where: any = {};
    if (keyword) {
      where.nickname = Like(`%${keyword}%`);
    }
    // 状态筛选
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [list, total] = await this.userRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC', // 按创建时间倒序
      },
      skip,
      take,
      select: ['id', 'username', 'nickname', 'email', 'avatar', 'status'], // 选择返回的字段
    });

    return {
      list,
      total,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
