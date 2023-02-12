import { Blog } from '@jsblog/core';
import { Controller, Get } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly blog: Blog) {}

  @Get()
  async getPosts() {
    return this.blog.getPosts();
  }
}
