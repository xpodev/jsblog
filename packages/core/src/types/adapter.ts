import { Post } from "..";
import { Comment } from "../comment";
import { Provider } from ".";
import { BlogCommentDocument } from "./comment";
import { BlogPostDocument } from "./post";

export interface BlogDatabaseAdapter {
    /**
     * An optional method to initialize the adapter.
     * This is useful for connecting to a database.
     * This method is called when the blog is initialized.
     * 
     * @returns A promise that resolves when the adapter is initialized.
     */
    init?(): Provider<void>;
    /**
     * A method to generate a new id for a post or comment.
     * 
     * @returns A promise or value that resolves to a string.
     */
    newId(): Provider<string>;

    getPosts(): Provider<Post[]>;
    /**
     * Get a post by id.
     * 
     * @param id The id of the post to get.
     * @returns A promise that resolves to the post.
     */
    getPost(id: string): Provider<Post>;
    /**
     * Save a post to the database.
     * 
     * @param post The post to save.
     * @returns A promise that resolves to the saved post.
     */
    savePost(post: BlogPostDocument): Provider<Post>;
    /**
     * Delete a post from the database.
     * 
     * @param id The id of the post to delete.
     * @returns A promise that resolves when the post is deleted.
     */
    deletePost(id: string): Provider<void>;

    getComments(): Provider<Comment[]>;
    /**
     * Get a comment by id.
     * 
     * @param id The id of the comment to get.
     * @returns A promise that resolves to the comment.
     */
    getComment(id: string): Provider<Comment>;
    /**
     * Save a comment to the database.
     * 
     * @param comment The comment to save.
     * @returns A promise that resolves to the saved comment.
     */
    saveComment(comment: BlogCommentDocument): Provider<Comment>;
    /**
     * Delete a comment from the database.
     * 
     * Note: This should also delete any replies to the comment.
     * 
     * @param id The id of the comment to delete.
     * @returns A promise that resolves when the comment is deleted.
     */
    deleteComment(id: string): Provider<void>;
}