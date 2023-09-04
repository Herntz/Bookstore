import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeOrmFilter } from './exceptions/tyeorm.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 //app.setGlobalPrefix('api/v1');
 app.useGlobalPipes(new ValidationPipe({whitelist:true}));

 app.useGlobalFilters(new TypeOrmFilter())
  
 const config = new DocumentBuilder()
   .setTitle('Api for the backend university ')
   .setDescription(`
   this api is designed for the backend university 
   CREATED RESSOURCE: 201
   RETRIEVE RESOURCE: 200
   NOT FOUND RESOURCE:404
   BAD REQUEST :      400
   FORBIDEN RESOURCE :401
   `)
   .setVersion('1.0')
   .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
