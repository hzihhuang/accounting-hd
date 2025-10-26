import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(userId: number, tag: CreateTagDto) {
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
    return await this.tagRepository.find({
      where: [
        { createdBy: IsNull() },
        { createdBy: { id: userId } }
      ]
    })
  }

  async remove(userId: number, tagId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId, createdBy: { id: userId } },
    });
    if (!tag) {
      throw new NotFoundException('标签不存在或无权限删除');
    }
    return this.tagRepository.remove(tag);
  }
}
