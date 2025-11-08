import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async getInfo(userId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const result = await this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.category', 'category')
      .select([
        // 总收入（所有时间的收入）
        'SUM(CASE WHEN category.type = "income" THEN bill.price ELSE 0 END) as totalIncome',
        // 总支出（所有时间的支出）
        'SUM(CASE WHEN category.type = "expense" THEN bill.price ELSE 0 END) as totalExpense',
        // 本月收入
        'SUM(CASE WHEN category.type = "income" AND bill.date BETWEEN :start AND :end THEN bill.price ELSE 0 END) as monthIncome',
        // 本月支出
        'SUM(CASE WHEN category.type = "expense" AND bill.date BETWEEN :start AND :end THEN bill.price ELSE 0 END) as monthPay',
      ])
      .where('bill.userId = :userId', { userId })
      .setParameters({ start: startOfMonth, end: endOfMonth })
      .getRawOne();

    return {
      balance:
        (Number(result.monthIncome) || 0) - (Number(result.monthPay) || 0),
      monthIncome: Number(result.monthIncome) || 0,
      monthPay: Number(result.monthPay) || 0,
    };
  }
}
