import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetTrendDto } from './dto/get-trend.dto';

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async getCategory(query: GetCategoryDto, userId: number) {
    const { startDate, endDate, type } = query;

    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .leftJoin('bill.user', 'user')
      .select('category.id', 'id')
      .addSelect('category.name', 'name')
      .addSelect(`SUM(bill.price)`, 'value'); // ✅ 只统计当前类型的总金额

    // 用户筛选
    qb.andWhere('user.id = :userId', { userId });

    // 分类类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 时间筛选（账单日期）
    if (startDate) {
      qb.andWhere('bill.date >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('bill.date <= :endDate', { endDate });
    }

    // 按分类分组
    qb.groupBy('category.id').addGroupBy('category.name');

    // 按金额降序排列（可选）
    qb.orderBy('value', 'DESC');

    const result = await qb.getRawMany();

    // 格式化输出
    return result.map((r) => ({
      id: r.id,
      name: r.name,
      value: Number(r.value) || 0,
    }));
  }

  async getTrend(query: GetTrendDto, userId: number) {
    const { mode = 'month', startDate, endDate, type } = query;

    // 日期格式化（按模式选择）
    const dateFormat =
      mode === 'year'
        ? "DATE_FORMAT(bill.date, '%Y')"
        : mode === 'month'
          ? "DATE_FORMAT(bill.date, '%Y-%m')"
          : mode === 'week'
            ? "DATE_FORMAT(bill.date, '%x-%v')" // 年-周数，例如 2025-45
            : "DATE_FORMAT(bill.date, '%Y-%m-%d')";

    // 构建查询
    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select(`${dateFormat}`, 'date')
      .addSelect(`SUM(bill.price)`, 'value'); // ✅ 只统计当前类型金额

    // 用户筛选
    qb.andWhere('bill.userId = :userId', { userId });

    // 分类类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 时间筛选（账单日期）
    if (startDate) qb.andWhere('bill.date >= :startDate', { startDate });
    if (endDate) qb.andWhere('bill.date <= :endDate', { endDate });

    // 分组 + 排序
    qb.groupBy(`${dateFormat}`).orderBy('date', 'ASC');

    const result = await qb.getRawMany();

    return result.map((r) => ({
      date: r.date,
      value: Number(r.value) || 0,
    }));
  }
}
