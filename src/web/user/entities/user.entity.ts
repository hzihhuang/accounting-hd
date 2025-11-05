import { Bill } from '@/web/bills/entities/bill.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  password: string;

  @Column({ length: 100, nullable: true }) // 允许为空
  nickname: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string; // 头像 URL

  @Column({
    type: 'tinyint',
    width: 1,
    default: 1,
    comment: '状态：1-正常，0-禁用',
  })
  status: number;

  @OneToMany(() => Bill, (bill) => bill.user, { cascade: true })
  bills: Bill[];

  @Column({ name: 'token_version', default: 1 })
  tokenVersion: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
