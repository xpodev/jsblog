import { BlogError } from "./errors";
import { TimeStamps } from "./timestamps";
import { BlogDatabaseAdapter } from "./types/adapter";
import { BlogCommentDocument, BlogComment, CreateComment } from "./types/comment";
import { BlogPost } from "./types/post";

export class Comment<T = true> extends TimeStamps implements BlogCommentDocument {
    id: string;
    content: string;
    parent: BlogComment<true> | BlogPost;
    
    constructor(comment: CreateComment, private readonly adapter: BlogDatabaseAdapter) {
        super(comment);
        this.id = comment.id;
        this.content = comment.content;
        this.parent = comment.parent as BlogComment<true> | BlogPost;
    }

    async delete() {
        this.parent.removeComment(this.id);
    }

    async save() {
        return await this.adapter.saveComment(this.toJSON());
    }

    async update(comment: Partial<BlogCommentDocument>) {
        for (const key in comment) {
            if (!this.hasOwnProperty(key)) {
                throw new BlogError(`Error while updating comment: ${key} is not a valid property.`);
            }
        }

        // Note: if the comment has `updatedAt` property, it will override the value set by the `update`
        // of the TimeStamps class.
        Object.assign(this, comment);

        return await this.save();
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            parent: this.parent,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }
}