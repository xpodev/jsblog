import { Comment } from "src/comment";
import { OmitMethods, WithComments, WithTimeStamps } from ".";
import { BlogPost } from "./post";
import { Post } from "src";

export type BlogComment<C = false> = WithTimeStamps & {
  id: string;
  content: string;
  parent: BlogComment<C> | BlogPost;
} & (C extends true ? WithComments : {});

export type BlogCommentDocument<C = false> = OmitMethods<BlogComment<C>>;

export type CreateComment = Partial<BlogCommentDocument> & {
    content: string;
};