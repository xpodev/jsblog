import { BlogError } from "./errors";
import { Post } from "./post";
import { BlogDatabaseAdapter } from "./types/adapter";
import { CreatePost } from "./types/post";

export interface BlogOptions {
  adapter: BlogDatabaseAdapter;
  post?: {
    canComment: boolean;
  };
  comment?: {
    canReply: boolean;
  };
}

export class Blog {
  private adapter: BlogDatabaseAdapter;
  constructor(options: BlogOptions);
  constructor(
    {
      adapter,
      post = {
        canComment: true,
      },
      comment = {
        canReply: true,
      },
    } = {} as BlogOptions
  ) {
    if (!adapter) {
      throw new BlogError("No adapter provided");
    }
    this.adapter = adapter;
    if (post) {
      Post.setDefaults(post);
    }
    if (comment) {
      // Comment.setDefaults(comment);
    }
  }

  async init() {
    await this.adapter.init?.();
    return this;
  }

  async getPost(id: string) {
    return await this.adapter.getPost(id);
  }

  async getPosts() {
    return await this.adapter.getPosts();
  }

  async createPost(post: Omit<CreatePost, "id">): Promise<Post> {
    const newPost = new Post(
      {
        id: await this.adapter.newId(),
        ...post,
      },
      this.adapter
    );
    return await newPost.save();
  }
}
