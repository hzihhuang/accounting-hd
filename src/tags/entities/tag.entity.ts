import { Bill } from '@/bills/entities/bill.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string; // 标签名称，如 "餐饮"、"工资"

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense'; // 标签类型，收入 or 支出

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: string | null) => value, // 存入数据库时不处理
      from: (value: string) => value.startsWith('http') ? value : `http://localhost:3000/images/tags/${value}`,
    },
  })
  icon: string; // 可选：图标

  @OneToMany(() => Bill, (bill) => bill.tag)
  bills: Bill[];

  @ManyToOne(() => User, (user) => user.tags, { nullable: true, onDelete: 'CASCADE' })
  createdBy?: User; // 为空时表示公共标签，非空表示用户自定义标签

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}