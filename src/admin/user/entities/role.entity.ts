// entities/role.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { AdminUser } from './user.entity';
import { AdminPermission } from './permission.entity';

@Entity('admin_roles')
export class AdminRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_code', unique: true, length: 50 })
  roleCode: string;

  @Column({ name: 'role_name', length: 50 })
  roleName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 多对多关系：角色属于多个用户
  @ManyToMany(() => AdminUser, (user) => user.roles)
  users: AdminUser[];

  // 一个角色有多个权限
  @ManyToMany(() => AdminPermission, (permission) => permission.roles)
  permissions: AdminPermission[];
}
