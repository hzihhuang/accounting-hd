import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminUser } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/admin/user/jwt.strategy';
import { AdminRole } from '@/admin/user/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, AdminRole]),
    PassportModule,
    JwtModule.register({
      secret: 'hzihhuang',
      signOptions: { expiresIn: '7d' }, //7天
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
