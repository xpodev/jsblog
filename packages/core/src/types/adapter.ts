import { Post } from "..";
import { Comment } from "../comment";
import { Provider } from ".";
import { BlogCommentDocument } from "./comment";
import { BlogPostDocument } from "./post";

export interface BlogDatabaseAdapter {
    init?(): Provider<void>;
    newId(): Provider<string>;

    getPosts(): Provider<Post[]>;
    getPost(id: string): Provider<Post>;
    savePost(post: BlogPostDocument): Provider<Post>;
    deletePost(id: string): Provider<void>;

    getComments(): Provider<Comment[]>;
    getComment(id: string): Provider<Comment>;
    saveComment(comment: BlogCommentDocument): Provider<Comment>;
    deleteComment(id: string): Provider<void>;
}