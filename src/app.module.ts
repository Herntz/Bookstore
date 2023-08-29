import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
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
