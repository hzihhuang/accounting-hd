import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagDto } from './dto/get-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  async create(tag: CreateTagDto) {
    return await this.tagRepository.save(tag);
  }

  async getTags(getTagDto: GetTagDto) {
    const { page = 1, pageSize = 10, type, keyword } = getTagDto;
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = { createdBy: IsNull() }; // 只查询系统标签
    if (type !== 'all') {
      where.type = type;
    }
    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }
    const [list, total] = await this.tagRepository.findAndCount({
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
    return await this.tagRepository.delete(id);
  }

  async batchRemove(ids: number[]) {
    return await this.tagRepository.delete({ id: In(ids) });
  }
}
