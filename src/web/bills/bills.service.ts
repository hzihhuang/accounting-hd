import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetBillsDto } from './dto/get-bills.dto';
import { CreateBillDto } from './dto/create-bill.dto';
import { Category } from '@/admin/category/entities/category.entity';
import { DeleteBillDto } from './dto/delete-bill.dto';
import { UpdateBillDto } from './dto/update-bill-dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(getBillsDto: GetBillsDto, userId: number) {
    const { type, startDate, endDate } = getBillsDto;

    const query = this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.category', 'category')
      .where('bill.userId = :userId', { userId });

    // ✅ 按类型筛选（income / expense）
    if (type) {
      query.andWhere('category.type = :type', { type });
    }

    // ✅ 按日期范围筛选
    if (startDate && endDate) {
      query.andWhere('bill.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    } else if (startDate) {
      query.andWhere('bill.date >= :start', { start: startDate });
    } else if (endDate) {
      query.andWhere('bill.date <= :end', { end: endDate });
    }

    // ✅ 按账单日期排序（最新在前）
    query.orderBy('bill.date', 'DESC');

    const [list, total] = await query.getManyAndCount();
    return {
      list,
      total,
    };
  }

  async create(createBillDto: CreateBillDto, userId: number) {
    const { categoryId, price, remark, date } = createBillDto;

    // 检查分类是否存在
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 生成账单实例
    const bill = this.billRepository.create({
      price,
      remark,
      date:
        date ||
        new Date()
          .toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\//g, '-'),
      category,
      user: { id: userId } as any, // 简化写法，避免额外查用户
    });

    // 保存到账单表
    const savedBill = await this.billRepository.save(bill);

    return savedBill;
  }

  async remove(deleteBillDto: DeleteBillDto, userId: number) {
    const { id } = deleteBillDto;
    // 查找账单
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!bill) {
      throw new NotFoundException('账单不存在');
    }

    // 确保只能删除自己的账单
    if (bill.user.id !== userId) {
      throw new ForbiddenException('无权删除该账单');
    }

    return await this.billRepository.remove(bill);
  }

  async put(id: number, updateBillDto: UpdateBillDto, userId: number) {
    const { categoryId, price, remark, date } = updateBillDto;

    // 1️⃣ 查找账单
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

    if (!bill) {
      throw new NotFoundException('账单不存在');
    }

    // 2️⃣ 校验账单归属
    if (bill.user.id !== userId) {
      throw new ForbiddenException('无权修改该账单');
    }

    // 3️⃣ 检查分类是否存在
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    // 4️⃣ 更新账单字段
    bill.category = category;
    bill.price = price;
    bill.remark = remark ?? bill.remark;
    bill.date = date || bill.date; // ✅ 确保日期格式为 YYYY-MM-DD，不做 new Date 转换

    // 5️⃣ 保存并返回更新后的账单（包含分类）
    await this.billRepository.save(bill);

    return this.billRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async getDates(id: number) {
    const dates = await this.billRepository
      .createQueryBuilder('bill')
      .select("DATE_FORMAT(bill.date, '%Y-%m-%d')", 'date')
      .where('bill.userId = :userId', { userId: id })
      .distinct(true)
      .orderBy('date', 'DESC')
      .getRawMany();

    return dates.map((item) => item.date as string);
  }
}
