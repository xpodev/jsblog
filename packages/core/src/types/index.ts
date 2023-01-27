export * from "./adapter";
import { BlogComment, BlogCommentDocument } from "./comment";
import { BlogPostDocument } from "./post";

export type Provider<T> = T | Promise<T>;

export interface WithComments {
    comments: BlogComment[];
    canComment: boolean;
    addComment(comment: BlogCommentDocument): Promise<BlogComment>;
    removeComment(id: string): Promise<void>;
}

export interface WithTimeStamps {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    update(...args: any[]): any;
    delete(): any;
    restore(): any;
}

export interface IBlog {
    posts: BlogPostDocument[];

    getPost(id: string): Promise<BlogPostDocument>;
    getPosts(): Promise<BlogPostDocument[]>;
    createPost(post: BlogPostDocument): Promise<BlogPostDocument>;
    updatePost(id: string, post: BlogPostDocument): Promise<BlogPostDocument>;
    deletePost(id: string): Promise<void>;
}

export type OmitMethods<T> = Pick<T, {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T]>;

