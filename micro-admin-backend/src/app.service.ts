import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/categories/category.interface';
import { Player } from './interfaces/players/player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async create(category: Category): Promise<Category> {
    try {
      const categoryData = {
        ...category,
        players: category.players || [],
      };
  
      const newCategory = await this.categoryModel.create(categoryData);
      return newCategory;
    } catch (err) {
      this.logger.error('Error creating category', err);
      throw new RpcException(err.message)
    }
  }

  async getCategories(_id:string): Promise<Category[] | Category> {
    try {
      const promise = (typeof _id === 'string' ? this.categoryModel.findById(_id) : this.categoryModel.find()) as Promise<Category[] | Category>;
      const categories: Category[] | Category = await promise;

      return categories;
    } catch (err) {
      this.logger.error('Error getting categories', err);
      throw new RpcException(err.message)
    }

  }
}
