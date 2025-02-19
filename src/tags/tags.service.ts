import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import os from 'os';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }
  async create(tag: CreateTagDto, userId: number) {
    const { isPrivate, ...prop } = tag;
    if (tag.isPrivate) {
      return await this.tagRepository.save({
        ...prop,
        createdBy: { id: userId }
      });
    }
    return await this.tagRepository.save(prop);
  }

  async getTags(userId: number) {
    const tags = await this.tagRepository.find({
      where: [
        { createdBy: IsNull() },
        { createdBy: { id: userId } }
      ]
    });
    // 处理图片路径问题
    const newTags: Tag[] = tags.map(tag => ({ ...tag, icon: `http://localhost:3000/images/tags/${tag.icon}` }))
    // 收入
    const incomeTags = newTags.filter(tag => tag.type === 'income');
    // 支出
    const expenseTags = newTags.filter(tag => tag.type === 'expense');
    return {
      incomeTags,
      expenseTags
    }
  }

  async remove(id: number, userId: number) {
    return await this.tagRepository.delete({
      id,
      createdBy: { id: userId }
    });
  }
}
