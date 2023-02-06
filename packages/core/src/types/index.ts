export * from "./adapter";
export * from "./comment";
export * from "./post";
import { BlogComment, BlogCommentDocument } from "./comment";
import { BlogPostDocument } from "./post";

/**
 * A type that can be a value or a promise.
 */
export type Provider<T> = T | Promise<T>;
/**
 * The return type of a function, whether it is a promise or not.
 */
export type NextValue<T extends (...args: any[]) => any> =
  ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>;

export interface WithComments {
  /**
   * The comments on the post/comment.
   */
  comments: BlogComment[];
  /**
   * Whether or not the post/comment can be commented on.
   * If false, the `addComment` and `removeComment` methods will throw an error.
   *
   * @default
   * post: true
   * comment: false
   */
  canComment: boolean;
  /**
   * Adds a comment to the post/comment, and saves it to the database.
   *
   * @param comment The comment to add
   * @returns A promise that resolves to the added comment
   */
  addComment(comment: BlogCommentDocument): Promise<BlogComment>;
  /**
   * Removes a comment from the post/comment, and deletes it from the database.
   * If the comment is not found in the parent, an error is thrown.
   * If the `canComment` property is false, an error is thrown.
   *
   * @param id The id of the comment to remove
   * @returns A promise that resolves when the comment is removed
   */
  removeComment(id: string): Promise<void>;
}

export interface WithTimeStamps {
  /**
   * The date the object was created.
   */
  createdAt: Date;
  /**
   * The date the object was last updated.
   */
  updatedAt: Date;
  /**
   * The date the object was deleted.
   * If the object has not been deleted, this will be null.
   */
  deletedAt: Date | null;
  /**
   * Update the object's properties.
   * This will set the `updatedAt` property to the current date.
   * If the object is deleted, this will throw an error.
   *
   * Note: The `updatedAt` property is changed before the object is updated, so if the method changes
   * the `updatedAt` property, it will be overwritten.
   */
  update(...args: any[]): any;
  /**
   * Delete the object and set the `deletedAt` property to the current date.
   */
  delete(): any;
  /**
   * Restore the object and set the `deletedAt` property to null.
   * If the object has not been deleted, this will throw an error.
   */
  restore(): any;
}

export interface IBlog {
  posts: BlogPostDocument[];

  /**
   * Get a post by id.
   *
   * @param id The id of the post to get.
   * @returns A promise that resolves to the post.
   */
  getPost(id: string): Promise<BlogPostDocument>;
  getPosts(): Promise<BlogPostDocument[]>;
  /**
   * Create a new post.
   *
   * @param post The post to create.
   * @returns A promise that resolves to the created post.
   */
  createPost(post: BlogPostDocument): Promise<BlogPostDocument>;
  /**
   * Update a post.
   *
   * @param id The id of the post to update.
   * @param post The new post data.
   * @returns A promise that resolves to the updated post.
   */
  updatePost(id: string, post: BlogPostDocument): Promise<BlogPostDocument>;
  /**
   * Delete a post.
   *
   * @param id The id of the post to delete.
   * @returns A promise that resolves when the post is deleted.
   */
  deletePost(id: string): Promise<void>;
}

/**
 * A type that omits methods from an object.
 *
 * @example
 * type Foo = {
 *  a: string;
 *  b: number;
 *  c(): void;
 * }
 *
 * type Bar = OmitMethods<Foo>;
 * // Bar = { a: string; b: number; }
 */
export type OmitMethods<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;

export type BlogDocument<T> = {
  toJSON(): T;
};

/**
 * A type that can be used to create a new instance of a class.
 * Basically, the constructor type.
 */
export type Type<T> = new (...args: any[]) => T;
