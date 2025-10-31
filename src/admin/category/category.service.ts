import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { AdminUser } from '../user/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(category: CreateCategoryDto, adminUser: AdminUser) {
    return await this.categoryRepository.save({
      createdBy: adminUser,
      ...category,
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // 直接更新，不检查用户权限
    const result = await this.categoryRepository.update(
      { id }, // 只根据ID更新
      updateCategoryDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException('分类不存在');
    }

    return this.categoryRepository.findOne({ where: { id } });
  }

  async getCategory(getCategoryDto: GetCategoryDto) {
    const { page = 1, pageSize = 10, type, keyword } = getCategoryDto;
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {};
    if (type !== 'all') {
      where.type = type;
    }
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }
    const [list, total] = await this.categoryRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: {
        type: 'ASC',
        name: 'ASC',
      },
    });
    return {
      list,
      total,
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }

  async batchRemove(ids: number[]) {
    return await this.categoryRepository.delete({ id: In(ids) });
  }
}
