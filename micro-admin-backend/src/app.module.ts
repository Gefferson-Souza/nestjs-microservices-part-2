import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import PlayerSchema from './interfaces/players/Player.schema';
import CategorySchema from './interfaces/categories/category.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin123@localhost:27017/admin'),
    MongooseModule.forFeature([
      { name: 'Player', schema: PlayerSchema },
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
