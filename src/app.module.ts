import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    GenreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
