import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PostsController],
  imports: [CommonModule],
})
export class ApiModule {}
