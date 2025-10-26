import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/web/user/entities/user.entity';
import { Tag } from '@/web/tags/entities/tag.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['income', 'expense'] as const })
  type: 'income' | 'expense'; // 标签类型，收入 or 支出

  @Column('float')
  amount: number; // 金额

  @Column({ nullable: true })
  note: string; // 备注

  @ManyToOne(() => Tag, (tag) => tag.bills, { onDelete: 'SET NULL' })
  tag: Tag; // 分类（如：餐饮、购物）

  @ManyToOne(() => User, (user) => user.bills, { onDelete: 'CASCADE' })
  user: User;

  // 账单时间
  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;
}
