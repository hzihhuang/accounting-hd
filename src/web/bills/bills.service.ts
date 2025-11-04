import { Injectable, NotFoundException } from '@nestjs/common';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { GetBillsDto } from './dto/get-bills.dto';
import { PatchBillDto } from './dto/patch-bill-dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
  ) {}

  async findAll(userId: number, query: GetBillsDto) {
    const {
      categoryId,
      date,
      startDate,
      endDate,
      page = 1,
      pageSize = 10,
    } = query;

    const where: FindOptionsWhere<Bill> = { user: { id: userId } };

    if (categoryId) {
      where.category = { id: categoryId };
    }
    if (startDate || endDate) {
      // 优先使用 startDate 和 endDate 进行范围查询
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
        where.createdAt = Between(start, end);
      } else if (start) {
        where.createdAt = MoreThanOrEqual(start);
      } else if (end) {
        where.createdAt = LessThanOrEqual(end);
      }
    } else if (date) {
      // 仅在 startDate 和 endDate 不存在时，才使用 date
      let start: Date, end: Date;

      if (/^\d{4}$/.test(date)) {
        // 识别 YYYY（查询整年）
        start = new Date(`${date}-01-01`);
        end = new Date(`${date}-12-31`);
      } else if (/^\d{4}-\d{2}$/.test(date)) {
        // 识别 YYYY-MM（查询整月）
        start = new Date(`${date}-01`);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1, 0); // 该月最后一天
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // 识别 YYYY-MM-DD（查询当天）
        start = new Date(date);
        end = new Date(date);
      } else {
        throw new Error('日期格式无效。使用YYYY、YYYY-MM或YYYY-MM-DD。');
      }
      // 设置时间范围
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      where.date = Between(start, end);
    }

    const skip = pageSize > 0 ? (page - 1) * pageSize : undefined;
    const take = pageSize > 0 ? pageSize : undefined;

    const [list, total] = await this.billsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take,
      relations: ['tag'],
    });

    return {
      list,
      total,
      totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 1,
      page,
      pageSize,
    };
  }

  async remove(userId: number, billId: number) {
    const bill = await this.billsRepository.findOne({
      where: { id: billId, user: { id: userId } },
    });
    if (!bill) {
      throw new NotFoundException('账单不存在');
    }
    return this.billsRepository.remove(bill);
  }

  async patch(userId: number, billId: number, updateBillDto: PatchBillDto) {
    const bill = await this.billsRepository.findOne({
      where: { id: billId, user: { id: userId } },
    });
    if (!bill) {
      throw new NotFoundException('账单不存在');
    }
    return this.billsRepository.save(Object.assign(bill, updateBillDto));
  }

  // 获取存在账单记录的日期列表 YYYY MM DD
  async getDates(userId: number) {
    const dates = await this.billsRepository
      .createQueryBuilder('bills')
      .select('bills.date')
      .where({ user: { id: userId } })
      .distinct(true)
      .getMany();
    return dates.map((item) => item.date);
  }
}
