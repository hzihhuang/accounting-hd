import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/web/user/entities/user.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule], // 导出给全局使用
})
export class RepositoryModule {}
