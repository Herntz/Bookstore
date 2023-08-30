import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { GenreModule } from './genre/genre.module';
import { CurentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    GenreModule,
  ],
  controllers: [],
  providers: [],
  
})
export class AppModule { 
   configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(CurentUserMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
}}
