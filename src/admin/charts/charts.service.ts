import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/admin/category/entities/category.entity';
import { Repository } from 'typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetTrendDto } from './dto/get-trend.dto';
import { GetCategoryCountDto } from './dto/get-category-count.dto';
import { GetDashboardDto } from './dto/get-dashboard.dto';

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getDashboard(query: GetDashboardDto) {
    const { userId, startDate, endDate } = query;

    const billQb = this.billRepository.createQueryBuilder('bill');

    // 总金额
    if (userId) billQb.andWhere('bill.createdById = :userId', { userId });
    if (startDate)
      billQb.andWhere('bill.createdAt >= :startDate', { startDate });
    if (endDate) billQb.andWhere('bill.createdAt <= :endDate', { endDate });

    const totalResult = await billQb
      .select('SUM(bill.price)', 'totalAmount')
      .getRawOne();

    const totalAmount = Number(totalResult?.totalAmount ?? 0);

    // 账单总数
    const totalBillsResult = await billQb
      .select('COUNT(bill.id)', 'count')
      .getRawOne();

    const totalBills = Number(totalBillsResult?.count ?? 0);

    // 分类总数（全局，和时间/用户无关）
    const totalCategoriesResult = await this.categoryRepository
      .createQueryBuilder('category')
      .select('COUNT(category.id)', 'count')
      .getRawOne();

    const totalCategories = Number(totalCategoriesResult?.count ?? 0);

    // 今日账单数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayBillsQb = this.billRepository
      .createQueryBuilder('bill')
      .where('bill.createdAt >= :today AND bill.createdAt < :tomorrow', {
        today,
        tomorrow,
      });

    if (userId) todayBillsQb.andWhere('bill.createdById = :userId', { userId });

    const todayBillsResult = await todayBillsQb
      .select('COUNT(bill.id)', 'count')
      .getRawOne();
    const todayBills = Number(todayBillsResult?.count ?? 0);

    return {
      totalAmount,
      totalBills,
      totalCategories,
      todayBills,
    };
  }

  async getCategory(query: GetCategoryDto) {
    const { startDate, endDate, userId } = query;

    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .leftJoin('bill.user', 'user') // 添加用户关联
      .select('category.id', 'id')
      .addSelect('category.name', 'category')
      .addSelect('category.type', 'type') // 添加分类类型
      .addSelect(
        `SUM(CASE WHEN category.type = 'income' THEN bill.price ELSE 0 END)`,
        'income',
      )
      .addSelect(
        `SUM(CASE WHEN category.type = 'expense' THEN bill.price ELSE 0 END)`,
        'expense',
      );

    // 用户筛选
    if (userId) qb.andWhere('user.id = :userId', { userId });

    // 时间筛选（使用账单日期）
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      qb.andWhere('bill.date >= :startDate', { startDate: start });
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('bill.date <= :endDate', { endDate: end });
    }

    qb.groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.type'); // 按类型分组

    const result = await qb.getRawMany();

    return result.map((r) => ({
      id: r.id,
      category: r.category,
      type: r.type, // 返回分类类型
      income: Number(r.income) || 0,
      expense: Number(r.expense) || 0,
    }));
  }
  async getCategoryCount(query: GetCategoryCountDto) {
    const { userId, startDate, endDate } = query;

    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select('category.id', 'id')
      .addSelect('category.name', 'category')
      .addSelect('COUNT(bill.id)', 'count');

    if (userId) qb.andWhere('bill.createdById = :userId', { userId });
    if (startDate) qb.andWhere('bill.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('bill.createdAt <= :endDate', { endDate });

    qb.groupBy('category.id').addGroupBy('category.name');

    const result = await qb.getRawMany();

    return result.map((r) => ({
      category: r.category,
      count: Number(r.count),
    }));
  }

  async getTrend(query: GetTrendDto) {
    const { mode = 'month', startDate, endDate, userId } = query;

    const dateFormat =
      mode === 'year'
        ? "DATE_FORMAT(bill.createdAt, '%Y')"
        : mode === 'month'
          ? "DATE_FORMAT(bill.createdAt, '%Y-%m')"
          : mode === 'week'
            ? "DATE_FORMAT(bill.createdAt, '%x-%v')" // 年份和周数，格式：2024-01
            : "DATE_FORMAT(bill.createdAt, '%Y-%m-%d')";

    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select(`${dateFormat}`, 'date')
      .addSelect(
        `SUM(CASE WHEN category.type = 'income' THEN bill.price ELSE 0 END)`,
        'income',
      )
      .addSelect(
        `SUM(CASE WHEN category.type = 'expense' THEN bill.price ELSE 0 END)`,
        'expense',
      );

    if (userId) qb.andWhere('bill.userId = :userId', { userId });
    if (startDate) qb.andWhere('bill.createdAt >= :startDate', { startDate });
    if (endDate) qb.andWhere('bill.createdAt <= :endDate', { endDate });

    qb.groupBy(`${dateFormat}`).orderBy('date', 'ASC');

    const result = await qb.getRawMany();

    return result.map((r) => ({
      date: r.date,
      income: Number(r.income) || 0,
      expense: Number(r.expense) || 0,
    }));
  }
}
