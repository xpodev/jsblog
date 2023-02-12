import { Blog } from '@jsblog/core';
import { MongoAdapter } from '@jsblog/mongodb';

export const BlogProvider = {
  provide: Blog,
  useFactory: async () => {
    const adapter = new MongoAdapter({
      uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jsblog-test',
    });

    const blog = new Blog({ adapter });
    await blog.init();
    return blog;
  },
};
