import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/web/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { GetUsersDto } from './dto/get-user-web.dto';
import { Bill } from '@/web/bills/entities/bill.entity';
import { UpdateUserStatusDto } from './dto/update-status.dto';
import { CreateUserDto } from './dto/create-user-web.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Injectable()
export class WebUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
  ) {}

  async findAll(query: GetUsersDto) {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      status,
      needSummary,
      startDate,
      endDate,
    } = query;
    const where: any = {};

    if (keyword) {
      const ids = keyword
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id) && id > 0);

      if (ids.length > 0) {
        where.id = In(ids);
      }
    }

    // 状态筛选
    if (status !== undefined && status !== null) {
      where.status = status;
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [list, total] = await this.userRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
      select: [
        'id',
        'username',
        'nickname',
        'email',
        'avatar',
        'status',
        'createdAt',
      ],
    });

    let newList = list;
    if (needSummary) {
      const userIds = list.map((user) => user.id);

      if (userIds.length > 0) {
        // 构建账单查询条件
        const billQueryBuilder = this.billsRepository
          .createQueryBuilder('bill')
          .leftJoin('bill.category', 'category') // 关联分类表
          .select('bill.userId', 'userId')
          .addSelect('COUNT(bill.id)', 'totalBills')
          .addSelect(
            `SUM(CASE WHEN category.type = 'income' THEN bill.price ELSE 0 END)`,
            'totalIncome',
          )
          .addSelect(
            `SUM(CASE WHEN category.type = 'expense' THEN bill.price ELSE 0 END)`,
            'totalExpense',
          )
          .where('bill.userId IN (:...userIds)', { userIds });

        // 添加时间筛选
        if (startDate || endDate) {
          let start: Date | undefined, end: Date | undefined;
          if (startDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
          }
          if (endDate) {
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
          }
          if (start && end) {
            billQueryBuilder.andWhere('bill.date BETWEEN :start AND :end', {
              start,
              end,
            });
          } else if (start) {
            billQueryBuilder.andWhere('bill.date >= :start', { start });
          } else if (end) {
            billQueryBuilder.andWhere('bill.date <= :end', { end });
          }
        }

        const userStats = await billQueryBuilder
          .groupBy('bill.userId')
          .getRawMany();

        // 将统计信息合并到用户列表中
        newList = list.map((user) => {
          const stat = userStats.find((stat) => stat.userId === user.id);
          return {
            ...user,
            totalBills: stat ? parseInt(stat.totalBills) : 0,
            totalIncome: stat ? parseFloat(stat.totalIncome) : 0,
            totalExpense: stat ? parseFloat(stat.totalExpense) : 0,
          };
        });
      }
    }

    return {
      list: newList,
      total,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateStatus(id: number, updateStatusDto: UpdateUserStatusDto) {
    const { status } = updateStatusDto;

    // 1. 验证用户是否存在
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'status'], // 只选择需要的字段
    });

    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // 2. 检查状态是否已经是要设置的值（可选）
    if (user.status === status) {
      throw new BadRequestException(
        `用户状态已经是 ${status === 1 ? '正常' : '禁用'}`,
      );
    }

    return await this.userRepository.update(id, { status });
  }

  async updatePassword(id: number, updatePasswordDto: UpdateUserPasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;
    // 1️⃣ 查找用户（必须取出密码字段）
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    // 2️⃣ 校验旧密码是否正确
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('旧密码错误');
    }
    // 3️⃣ 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // 4️⃣ 更新数据库
    await this.userRepository.update(id, {
      password: hashedPassword,
      tokenVersion: () => 'token_version + 1',
    });
    return '密码修改成功';
  }

  async create(createUserDto: CreateUserDto) {
    const {
      username,
      password,
      nickname,
      email,
      avatar = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      status = 1,
    } = createUserDto;

    // 1. 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 2. 检查邮箱是否已存在（如果提供了邮箱）
    if (email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (existingEmail) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    // 3. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 创建用户
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      nickname: nickname || username, // 如果没有昵称，默认使用用户名
      email,
      avatar,
      status,
    });

    // 5. 保存到数据库
    const savedUser = await this.userRepository.save(user);

    // 6. 返回用户信息（排除密码）
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['bills'], // 加载关联数据
    });

    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    return await this.userRepository.remove(user);
  }

  async batchRemove(ids: number[]) {
    return await this.userRepository.delete({ id: In(ids) });
  }
}
