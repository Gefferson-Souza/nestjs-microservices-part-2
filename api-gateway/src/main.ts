import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import moment from 'moment-timezone';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TO-DO app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = () =>
    moment(this).tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

  const config = new DocumentBuilder()
    .setTitle('Microserviços com NestJS & RabbitMQ')
    .setDescription('Descrição da API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
