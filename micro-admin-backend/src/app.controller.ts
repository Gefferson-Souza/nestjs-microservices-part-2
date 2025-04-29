import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
  ): Promise<Category> {
    this.logger.log(`Category: ${JSON.stringify(category)}`);
    return this.appService.create(category);
  }

  @MessagePattern('get-categories')
  async getCategories(
    @Payload() _id: string,
  ): Promise<Category[] | Category> {
    this.logger.log(`Category ID: ${_id}`);
    return this.appService.getCategories(_id);
  }
}
