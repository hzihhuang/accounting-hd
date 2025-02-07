import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
  ) {}

  create(userId: number, createBillDto: CreateBillDto) {
    const bill = this.billsRepository.create({
      ...createBillDto,
      user: { id: userId },
    });
    return this.billsRepository.save(bill);
  }

  async findAll(userId: number) {
    return this.billsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
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

  async getStatistics(userId: number, start: string, end: string) {
    return this.billsRepository
      .createQueryBuilder('bill')
      .select('bill.category, SUM(bill.amount) as totalAmount')
      .where('bill.userId = :userId', { userId })
      .andWhere('bill.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('bill.category')
      .getRawMany();
  }
}
