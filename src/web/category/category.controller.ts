import { WebController } from '@/web/WebController';
import { CategoryService } from './category.service';
import { Get } from '@nestjs/common';

@WebController('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }
}
