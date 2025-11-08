import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetLineDto } from './dto/get-line.dto';
import { GetWeeksDto } from './dto/get-weeks-dto';
import { GetMonthsDto } from './dto/get-months-dto';
import { GetBarDto } from './dto/get-bar.dto';

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  /**
   * 获取日期所在的周数 (ISO 8601 标准，周一开始)
   */
  private getWeekNumber(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7; // 将周日(0)转换为6，周一(1)转换为0
    target.setDate(target.getDate() - dayNr + 3); // 调整到该周的周四
    const firstThursday = target.valueOf();
    target.setMonth(0, 1); // 设置为1月1日
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7)); // 调整到第一个周四
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000); // 1周 = 604800000毫秒
  }

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  private formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

  async getBar(query: GetBarDto, userId: number) {
    const { type, startDate, endDate } = query;

    // 构建查询
    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select([
        'category.id',
        'category.name',
        'category.type',
        'SUM(bill.price) as total',
      ])
      .where('bill.userId = :userId', { userId })
      .setParameters({ userId });

    // 按类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 时间筛选
    if (startDate) {
      qb.andWhere('bill.date >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('bill.date <= :endDate', { endDate });
    }

    // 按分类分组并按总金额降序排列
    qb.groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.type')
      .orderBy('total', 'DESC');

    const result = await qb.getRawMany();

    // 格式化返回数据
    return result.map((item) => ({
      id: item.category_id,
      name: item.category_name,
      value: Number(item.total) || 0,
    }));
  }

  async getLine(query: GetLineDto, userId: number) {
    const { type, mode = 'day', startDate, endDate } = query;

    // 必须提供日期范围
    if (!startDate || !endDate) {
      throw new Error('必须提供 startDate 和 endDate');
    }

    // 根据 mode 设置日期格式化
    let dateFormat: string;
    switch (mode) {
      case 'day':
        dateFormat = "DATE_FORMAT(bill.date, '%Y-%m-%d')";
        break;
      case 'month':
        dateFormat = "DATE_FORMAT(bill.date, '%Y-%m')";
        break;
      case 'year':
        dateFormat = "DATE_FORMAT(bill.date, '%Y')";
        break;
      default:
        dateFormat = "DATE_FORMAT(bill.date, '%Y-%m-%d')"; // 默认按天
    }

    // 构建查询
    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select([`${dateFormat} as name`, `SUM(bill.price) as value`])
      .where('bill.userId = :userId', { userId })
      .andWhere('bill.date >= :startDate', { startDate })
      .andWhere('bill.date <= :endDate', { endDate })
      .setParameters({ userId, startDate, endDate });

    // 按类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 分组和排序
    qb.groupBy(`${dateFormat}`).orderBy('name', 'ASC');

    const result = await qb.getRawMany();

    // 格式化返回数据
    return result.map((item) => ({
      name: item.name,
      value: Number(item.value) || 0,
    }));
  }

  async getWeeks(query: GetWeeksDto, userId: number) {
    const { type } = query;
    const currentYear = new Date().getFullYear();

    // 构建查询
    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select([
        'YEARWEEK(bill.date, 1) as weekNumber', // 1 表示周一开始
        'MIN(bill.date) as startDate',
        'MAX(bill.date) as endDate',
        'COUNT(bill.id) as billCount',
      ])
      .where('bill.userId = :userId', { userId })
      .andWhere('YEAR(bill.date) = :year', { year: currentYear })
      .setParameters({ userId, year: currentYear });

    // 按类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 分组和排序
    qb.groupBy('YEARWEEK(bill.date, 1)').orderBy('weekNumber', 'DESC');

    const weeks = await qb.getRawMany();

    // 获取当前周和上周信息
    const now = new Date();
    const currentWeekNumber = this.getWeekNumber(now);
    const lastWeekNumber = currentWeekNumber - 1;

    // 格式化返回数据
    const result = weeks.map((week) => {
      const weekNum = Number(week.weekNumber.toString().slice(4)); // 提取周数
      const year = Number(week.weekNumber.toString().slice(0, 4));

      let label: string;
      if (year === currentYear) {
        if (weekNum === currentWeekNumber) {
          label = '本周';
        } else if (weekNum === lastWeekNumber) {
          label = '上周';
        } else {
          label = `第${weekNum}周`;
        }
      } else {
        label = `${year}年第${weekNum}周`;
      }

      return {
        label,
        start: this.formatDate(week.startDate),
        end: this.formatDate(week.endDate),
        weekNumber: weekNum,
        year: year,
        billCount: Number(week.billCount),
      };
    });

    return result;
  }

  async getMonths(query: GetMonthsDto, userId: number) {
    const { type } = query;
    const now = new Date();

    // 构建查询
    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select([
        'YEAR(bill.date) as year',
        'MONTH(bill.date) as monthNumber',
        'MIN(bill.date) as startDate',
        'MAX(bill.date) as endDate',
        'COUNT(bill.id) as billCount',
      ])
      .where('bill.userId = :userId', { userId })
      .andWhere('YEAR(bill.date) = :year', { year: now.getFullYear() })
      .setParameters({ userId, year: now.getFullYear() });

    // 按类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 分组和排序
    qb.groupBy('YEAR(bill.date)')
      .addGroupBy('MONTH(bill.date)')
      .orderBy('year', 'DESC')
      .addOrderBy('monthNumber', 'DESC');

    const months = await qb.getRawMany();

    // 获取当前月份信息
    const currentMonth = now.getMonth() + 1; // 月份从1开始
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // 月份名称映射
    const monthNames = [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月',
    ];

    // 格式化返回数据
    const result = months.map((month) => {
      const year = Number(month.year);
      const monthNum = Number(month.monthNumber);

      let label: string;
      if (year === currentYear) {
        if (monthNum === currentMonth) {
          label = '本月';
        } else if (monthNum === lastMonth && year === lastMonthYear) {
          label = '上月';
        } else {
          label = monthNames[monthNum - 1];
        }
      } else {
        label = `${year}年${monthNames[monthNum - 1]}`;
      }

      // 计算月份的开始和结束日期
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0); // 下个月的第0天就是本月的最后一天

      return {
        label,
        start: this.formatDate(startDate),
        end: this.formatDate(endDate),
        monthNumber: monthNum,
        year: year,
        monthName: monthNames[monthNum - 1],
        billCount: Number(month.billCount),
      };
    });

    return result;
  }

  async getYears(query: GetMonthsDto, userId: number) {
    const { type } = query;

    // 构建查询，获取用户有账单数据的所有年份
    const qb = this.billRepository
      .createQueryBuilder('bill')
      .leftJoin('bill.category', 'category')
      .select([
        'YEAR(bill.date) as year',
        'COUNT(bill.id) as billCount',
        'MIN(bill.date) as firstBillDate',
        'MAX(bill.date) as lastBillDate',
      ])
      .where('bill.userId = :userId', { userId });

    // 按类型筛选
    if (type) {
      qb.andWhere('category.type = :type', { type });
    }

    // 分组和排序
    qb.groupBy('YEAR(bill.date)').orderBy('year', 'DESC');

    const years = await qb.getRawMany();

    // 获取当前年份
    const currentYear = new Date().getFullYear();

    // 格式化返回数据
    const result = years.map((yearData) => {
      const year = Number(yearData.year);

      let label: string;
      if (year === currentYear) {
        label = '今年';
      } else if (year === currentYear - 1) {
        label = '去年';
      } else {
        label = `${year}年`;
      }

      // 计算年份的开始和结束日期
      const start = `${year}-01-01`;
      const end = `${year}-12-31`;

      return {
        label,
        year: year,
        start: start,
        end: end,
        billCount: Number(yearData.billCount),
        firstBill: this.formatDate(yearData.firstBillDate), // 该年实际第一笔账单
        lastBill: this.formatDate(yearData.lastBillDate), // 该年实际最后一笔账单
      };
    });

    return result;
  }
}
