import {
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  BatchRemoveCategoryDto,
  RemoveCategoryDto,
} from './dto/remove-category.dto';
import { AdminController } from '@/admin/AdminController';
import { User } from '@/admin/decorators/User.decorator';
import { Roles } from '@/admin/decorators/roles.decorator';
import { Role } from '@/admin/enums/role.enum';

@AdminController('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(@Query() getCategoryDto: GetCategoryDto) {
    return this.categoryService.getCategory(getCategoryDto);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User('id') userId,
  ) {
    return this.categoryService.create(createCategoryDto, userId);
  }

  // 修改
  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async remove(@Param() removeCategoryDto: RemoveCategoryDto) {
    return this.categoryService.remove(removeCategoryDto.id);
  }

  @Post('batch')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async removeAll(@Body() batchRemoveDto: BatchRemoveCategoryDto) {
    return this.categoryService.batchRemove(batchRemoveDto.ids);
  }
}
