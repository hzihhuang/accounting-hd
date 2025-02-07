import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/user/entities/user.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // 支出/收入

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // 金额

  @Column()
  category: string; // 分类（如：餐饮、购物）

  @Column({ nullable: true })
  note: string; // 备注

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bills, { onDelete: 'CASCADE' })
  user: User;
}
