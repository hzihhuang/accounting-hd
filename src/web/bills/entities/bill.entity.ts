import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/web/user/entities/user.entity';
import { Category } from '@/admin/category/entities/category.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  price: number; // 金额

  @Column({ nullable: true })
  remark: string; // 备注

  @ManyToOne(() => Category, (category) => category.bills, {
    onDelete: 'SET NULL',
  })
  category: Category; // 分类（如：餐饮、购物）

  @ManyToOne(() => User, (user) => user.bills, { onDelete: 'CASCADE' })
  user: User;

  // 账单时间
  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
