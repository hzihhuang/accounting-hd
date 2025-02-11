import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Tag } from '@/tags/entities/tag.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // 支出/收入

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // 金额

  @Column({ nullable: true })
  note: string; // 备注

  @ManyToOne(() => Tag, (tag) => tag.bills, { onDelete: "SET NULL" })
  tag: Tag; // 分类（如：餐饮、购物）

  @ManyToOne(() => User, (user) => user.bills, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
