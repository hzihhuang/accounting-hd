// entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AdminRole } from './role.entity';
import { Category } from '@/admin/category/entities/category.entity';

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, comment: '用户名（登录用）' })
  username: string;

  @Column({ length: 255, comment: '加密后的密码' })
  password: string;

  @Column({ length: 50, nullable: true, comment: '昵称（显示用）' })
  nickname: string;

  @Column({
    name: 'avatar_url',
    length: 255,
    nullable: true,
    comment: '头像URL',
  })
  avatarUrl: string;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态：1-正常，0-禁用',
  })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @OneToMany(() => Category, (tag) => tag.createdBy)
  categorys: Category[];

  @ManyToMany(() => AdminRole, (role) => role.users)
  @JoinTable({
    name: 'admin_user_roles', // 关联表名
    joinColumn: { name: 'user_id', referencedColumnName: 'id' }, // 当前表在关联表中的列
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }, // 对方表在关联表中的列
  })
  roles: AdminRole[];
}
