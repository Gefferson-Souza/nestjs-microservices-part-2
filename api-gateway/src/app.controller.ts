import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { tap } from 'rxjs';

@UsePipes(ValidationPipe)
@Controller('api/v1')
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

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
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
}
