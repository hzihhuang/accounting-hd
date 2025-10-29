// entities/permission.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AdminRole } from './role.entity';

@Entity('admin_permissions')
export class AdminPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'permission_code', length: 100 })
  permissionCode: string;

  @Column({ name: 'permission_name', length: 100 })
  permissionName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_time' })
  createdAt: Date;

  // 关键：一个权限可以关联多个角色
  @ManyToMany(() => AdminRole, (role) => role.permissions)
  @JoinTable({
    name: 'admin_role_permissions',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: AdminRole[];
}
