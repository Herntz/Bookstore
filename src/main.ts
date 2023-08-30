import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 //app.setGlobalPrefix('api/v1');
 app.useGlobalPipes(new ValidationPipe({whitelist:true}));
 const config = new DocumentBuilder()
 .setTitle('API for backend online library')
 .setDescription(`
   this API is designed for the library backend
   CREATED RESSOURCE: 201
   RETRIEVE RESOURCE: 200
   NOT FOUND RESOURCE:404
   BAD REQUEST :      400
   FORBIDEN RESOURCE :401
   `)
 .setVersion('1.0')
 //.addBearerAuth()
 .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
