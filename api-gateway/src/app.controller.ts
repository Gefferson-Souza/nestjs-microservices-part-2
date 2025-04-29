import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { lastValueFrom, Observable, Subscription } from 'rxjs';

@UsePipes(ValidationPipe)
@Controller('api/v1/categories')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin123@localhost:5672'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('')
  createCategory(@Body() createCategoryDto: CreateCategoryDto): void {
    this.clientAdminBackend
      .emit('create-category', createCategoryDto)
      .pipe()
      .subscribe({
        next: (response) => {
          this.logger.log(
            `Categoria criada com sucesso: ${JSON.stringify(response)}`,
          );
        },
        error: (error) => {
          this.logger.error(`Erro ao criar categoria: ${error}`);
        },
      });
  }

  @Get('')
  async getCategories(@Query('_id') _id: string): Promise<any> {
    const resp:any = await lastValueFrom(
      this.clientAdminBackend.send('get-categories', { _id }),
    );

    return resp;
  }
}
