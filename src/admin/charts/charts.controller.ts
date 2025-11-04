import { Get, Query } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetTrendDto } from './dto/get-trend.dto';
import { GetCategoryCountDto } from './dto/get-category-count.dto';
import { GetDashboardDto } from './dto/get-dashboard.dto';
import { AdminController } from '@/admin/AdminController';

@AdminController('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  // 仪表盘统计
  @Get('dashboard')
  async getDashboard(@Query() query: GetDashboardDto) {
    return this.chartsService.getDashboard(query);
  }

  // 分类占比（金额）
  @Get('category')
  async getCategory(@Query() query: GetCategoryDto) {
    return this.chartsService.getCategory(query);
  }

  // 分类占比 (使用量)
  @Get('category-count')
  async getCategoryCount(@Query() query: GetCategoryCountDto) {
    return this.chartsService.getCategoryCount(query);
  }

  // 金额趋势
  @Get('trend')
  async getTrend(@Query() query: GetTrendDto) {
    return this.chartsService.getTrend(query);
  }
}
