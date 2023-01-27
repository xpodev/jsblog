import { WithComments, WithTimeStamps, OmitMethods } from ".";

export type BlogPost = WithComments &
  WithTimeStamps & {
    id: string;
    title: string;
    content: string;
  };

export type BlogPostDocument = OmitMethods<BlogPost>;

export type CreatePost = Partial<BlogPostDocument> & {
  id: string;
  title: string;
  content: string;
}
