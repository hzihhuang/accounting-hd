import { Bill } from '@/bills/entities/bill.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users') // 指定表名为 "users"
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Bill, (bill) => bill.user)
  bills: Bill[]; // 关联账单（一个用户可以有多个账单）

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}