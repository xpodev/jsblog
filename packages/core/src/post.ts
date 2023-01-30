import { TimeStamps } from "./timestamps";
import { Comment } from ".";
import { BlogPostDocument, CreatePost } from "./types/post";
import { BlogError } from "./errors";
import { BlogDatabaseAdapter } from "./types/adapter";
import {
  BlogComment,
  BlogCommentDocument,
  CreateComment,
} from "./types/comment";

export class Post extends TimeStamps implements BlogPostDocument {
  id: string;
  title: string;
  content: string;
  comments: BlogComment[];
  canComment: boolean;

  constructor(post: CreatePost, private readonly adapter: BlogDatabaseAdapter) {
    super(post);
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.comments = (post.comments ?? []).map(
      (comment) => new Comment({ ...comment, parent: this }, this.adapter)
    );
    this.canComment = post.canComment ?? Post.defaults.canComment;
  }

  async addComment(comment: CreateComment): Promise<BlogComment> {
    this.verifyNotDeleted(`Post ${this.id} is deleted`);

    const newComment = new Comment(
      Object.assign(
        {
          id: await this.adapter.newId(),
          parent: this,
        },
        comment
      ),
      this.adapter
    );
    await newComment.save();
    return newComment;
  }

  async removeComment(id: string): Promise<void> {
    this.verifyNotDeleted(`Post ${this.id} is deleted`);

    const commentIndex = this.comments.findIndex(
      (comment) => comment.id === id
    );
    if (commentIndex === -1) {
      // do we really want to throw an error here?
      // maybe we should just return
      throw new BlogError(`Comment with id ${id} not found in post ${this.id}`);
    }
    this.comments.splice(commentIndex, 1);
    await this.adapter.deleteComment(id);
  }

  async save() {
    return await this.adapter.savePost(this.toJSON());
  }

  async delete(): Promise<void> {
    await this.adapter.deletePost(this.id);
  }

  async update(post: Partial<BlogPostDocument>) {
    for (const key in post) {
      if (!this.hasOwnProperty(key)) {
        throw new BlogError(
          `Error while updating post: ${key} is not a valid property.`
        );
      }
    }

    // Note: if the post has `updatedAt` property, it will override the value set by the `update`
    // of the TimeStamps class.
    Object.assign(this, post);

    return await this.save();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      comments: this.comments,
      canComment: this.canComment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  private static defaults = {
    canComment: true,
  };

  static setDefaults(defaults: Partial<typeof Post.defaults>): void {
    Object.assign(this.defaults, defaults);
  }
}
