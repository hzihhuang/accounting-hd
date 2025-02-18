import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOperator, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { GetBillsDto } from './dto/get-bills.dto';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
  ) { }

  create(userId: number, createBillDto: CreateBillDto) {
    const { type, amount, tagId, note } = createBillDto;
    const bill = this.billsRepository.create({
      type,
      amount,
      note,
      tag: { id: tagId },
      user: { id: userId },
    });
    return this.billsRepository.save(bill);
  }

  async findAll(userId: number, query: GetBillsDto) {
    const { type = 'all', tagId, startDate, endDate, page = 1, pageSize = 10 } = query;

    const where: FindOptionsWhere<Bill> = { user: { id: userId } };

    if (type !== 'all') {
      where.type = type;
    }
    if (tagId) {
      where.tag = { id: tagId };
    }
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(new Date(endDate));
    }

    const skip = pageSize > 0 ? (page - 1) * pageSize : undefined;
    const take = pageSize > 0 ? pageSize : undefined;

    const [data, total] = await this.billsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      data,
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
      throw new NotFoundException('账单不存在或无权限删除');
    }
    return this.billsRepository.remove(bill);
  }
}
