import { Module } from '@nestjs/common';
import { BlogProvider } from './blog/blog';

const providers = [BlogProvider];
@Module({
  providers,
  exports: providers,
})
export class CommonModule {}
