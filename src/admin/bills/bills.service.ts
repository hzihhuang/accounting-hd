import { Injectable, NotFoundException } from '@nestjs/common';
import { Bill } from '@/web/bills/entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateBillDto } from './dto/create-bill.dto';
import { GetBillsDto } from './dto/get-bills.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Category } from '@/admin/category/entities/category.entity';
import { User } from '@/web/user/entities/user.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBillDto: CreateBillDto) {
    const { price, categoryId, remark, date, userId } = createBillDto;
    const bill = this.billsRepository.create({
      price,
      remark,
      category: { id: categoryId },
      user: { id: userId },
      date:
        date ||
        new Date()
          .toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\//g, '-'),
    });
    return this.billsRepository.save(bill);
  }

  async findAll(query: GetBillsDto) {
    const {
      page = 1,
      pageSize = 10,
      type,
      keyword,
      categoryIds,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortBy = 'date',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.billsRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.category', 'category')
      .leftJoinAndSelect('bill.user', 'user');

    // 类型筛选
    if (type && type !== 'all') {
      queryBuilder.andWhere('category.type = :type', { type });
    }

    // 分类筛选
    if (categoryIds) {
      const ids = categoryIds
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id) && id > 0);

      if (ids.length > 0) {
        queryBuilder.andWhere('bill.categoryId IN (:...ids)', { ids });
      }
    }

    // 金额筛选
    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('bill.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice !== undefined) {
      queryBuilder.andWhere('bill.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      queryBuilder.andWhere('bill.price <= :maxPrice', { maxPrice });
    }

    // 关键词搜索 - 查询用户的 nickname
    if (keyword) {
      const ids = keyword
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id) && id > 0);
      if (ids.length > 0) {
        queryBuilder.andWhere('user.id IN (:...ids)', { ids });
      }
    }

    // 日期范围筛选
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
        queryBuilder.andWhere('bill.date BETWEEN :start AND :end', {
          start,
          end,
        });
      } else if (start) {
        queryBuilder.andWhere('bill.date >= :start', { start });
      } else if (end) {
        queryBuilder.andWhere('bill.date <= :end', { end });
      }
    }

    // 排序
    const sortField = sortBy === 'price' ? 'bill.price' : 'bill.date';
    queryBuilder.orderBy(sortField, sortOrder);
    queryBuilder.addOrderBy('bill.createdAt', 'DESC');

    // 分页
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [list, total] = await queryBuilder.getManyAndCount();

    // 处理分类被删除的情况
    const processedList = list.map((bill) => {
      const newBill = { ...bill } as any;
      if (bill.user) {
        newBill.user = {
          id: bill.user.id,
          username: bill.user.username,
          nickname: bill.user.nickname,
          email: bill.user.email,
          status: bill.user.status,
          avatar: bill.user.avatar,
        };
      }
      // 如果分类存在，只返回需要的字段
      if (bill.category) {
        newBill.category = {
          id: bill.category.id,
          name: bill.category.name,
          img: bill.category.img,
          type: bill.category.type,
        };
      }
      return newBill as Bill;
    });
    return {
      list: processedList,
      total,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async remove(id: number) {
    return await this.billsRepository.delete(id);
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    // 先验证账单是否存在
    const bill = await this.billsRepository.findOne({
      where: { id },
      relations: ['category', 'user'], // 加载关联关系
    });
    if (!bill) {
      throw new NotFoundException(`账单 ID ${id} 不存在`);
    }

    // 如果有 categoryId，验证分类是否存在并设置关联
    if (updateBillDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateBillDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `分类 ID ${updateBillDto.categoryId} 不存在`,
        );
      }
      bill.category = category;
    }

    // 如果有 userId，验证用户是否存在并设置关联
    if (updateBillDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateBillDto.userId },
      });
      if (!user) {
        throw new NotFoundException(`用户 ID ${updateBillDto.userId} 不存在`);
      }
      bill.user = user;
    }

    Object.assign(bill, updateBillDto);

    console.log(bill);

    // 使用 save 方法保存，这会自动处理关联关系
    return this.billsRepository.save(bill);
  }

  async batchRemove(ids: number[]) {
    if (!ids || ids.length === 0) {
      return { deleted: 0 };
    }

    const result = await this.billsRepository.delete({ id: In(ids) });
    return result;
  }
}
