import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WebUserService } from './user.service';
import { GetUsersDto } from './dto/get-user-web.dto';
import { UpdateUserStatusDto } from './dto/update-status.dto';
import { CreateUserDto } from './dto/create-user-web.dto';
import { BatchRemoveUserDto, RemoveUserDto } from './dto/delete-user-web.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { UpdateUserPasswordDto } from './dto/update-password.dto';

@Controller('web-user')
export class WebUserController {
  constructor(private readonly userService: WebUserService) {}

  @Get()
  async findAll(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }

  // 修改用户状态
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateUserStatusDto,
  ) {
    return this.userService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updatePassword(id, updateUserPasswordDto);
  }

  // 新增用户
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 删除用户
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async remove(@Param() removeUserDto: RemoveUserDto) {
    return this.userService.remove(removeUserDto.id);
  }

  // 批量删除
  @Post('batch')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async removeAll(@Body() batchRemoveDto: BatchRemoveUserDto) {
    return this.userService.batchRemove(batchRemoveDto.ids);
  }
}
