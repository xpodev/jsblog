import { OmitMethods, WithComments, WithTimeStamps } from ".";
import { BlogPost } from "./post";

/**
 * A comment on a post or another comment.
 *
 * @template C Whether or not the comment can have comments.
 */
export type BlogComment<C = false> = WithTimeStamps & {
  /**
   * The id of the comment.
   */
  id: string;
  /**
   * The content of the comment.
   *
   */
  content: string;
  /**
   * The parent of the comment.
   * This can be either a post or another comment.
   */
  parent: BlogComment<C> | BlogPost;
} & (C extends true ? WithComments : {});

/**
 * A comment document, that can be saved to the database.
 */
export type BlogCommentDocument<C = false> = OmitMethods<
  Omit<BlogComment<C>, "parent"> & { parentId: string }
>;

/**
 * The properties required to create a comment.
 */
export type CreateComment = Partial<BlogCommentDocument> & {
  /**
   * The content of the comment.
   */
  content: string;
};
