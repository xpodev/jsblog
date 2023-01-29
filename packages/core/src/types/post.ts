import { WithComments, WithTimeStamps, OmitMethods } from ".";

interface _InternalBlogPost {
  /**
   * The id of the post.
   */
  id: string;
  /**
   * The title of the post.
   */
  title: string;
  /**
   * The content of the post.
   */
  content: string;
}

/**
 * A blog post.
 */
export type BlogPost = WithComments & WithTimeStamps & _InternalBlogPost;

/**
 * A blog post document, that can be saved to the database.
 */
export type BlogPostDocument = OmitMethods<BlogPost>;

/**
 * The properties required to create a post.
 */
export type CreatePost = Partial<BlogPostDocument> & Omit<_InternalBlogPost, "id">;
