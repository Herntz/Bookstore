import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { GenreEntity } from './entities/genre.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
