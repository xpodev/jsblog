import { BlogDatabaseAdapter, Comment, Post } from "@jsblog/core";
import { BlogCommentDocument } from "@jsblog/core/types/comment";
import { BlogPostDocument } from "@jsblog/core/types/post";
import { MongoClient, MongoClientOptions, Collection } from "mongodb";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  18
);

export interface MongoAdapterOptions extends MongoClientOptions {
  uri: string;
}

const mongoAdapterConfig = {
  postsCollectionName: "posts",
  commentsCollectionName: "comments",
};

type MongoAdapterConfig = typeof mongoAdapterConfig;

export class MongoAdapter implements BlogDatabaseAdapter {
  private client: MongoClient;
  private postsCollection: Collection<BlogPostDocument>;
  private commentsCollection: Collection<BlogCommentDocument>;

  constructor(options: MongoAdapterOptions, config?: MongoAdapterConfig);
  constructor(uri: string, config?: MongoAdapterConfig);
  constructor(
    options: MongoAdapterOptions | string,
    private readonly config = { ...mongoAdapterConfig }
  ) {
    if (typeof options === "string") {
      this.client = new MongoClient(options);
    } else {
      const { uri, ..._options } = options;
      this.client = new MongoClient(uri, _options);
    }
  }

  async init() {
    await this.client.connect();
    this.postsCollection = this.client
      .db()
      .collection(this.config.postsCollectionName);
    this.commentsCollection = this.client
      .db()
      .collection(this.config.commentsCollectionName);

    await this.postsCollection.createIndex({ id: 1 }, { unique: true });
    await this.commentsCollection.createIndex({ id: 1 }, { unique: true });
  }

  async newId() {
    return nanoid();
  }

  async getPosts() {
    const posts = await this.postsCollection.find().toArray();
    return posts.map((post) => new Post(post, this));
  }

  async getPost(id: string) {
    const post = await this.postsCollection.aggregate<Post>([
      {
        $match: {
          id,
        },
      },
      {
        $lookup: {
          from: this.config.commentsCollectionName,
          as: "comments",
          let: { id: "$id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$parentId", "$$id"],
                },
              },
            },
            {
              $project: {
                _id: 0,
              }
            },
            {
              $limit: 10,
            }
          ],
        },
      },
    ]).next();
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return new Post(post, this);
  }

  async savePost(post: BlogPostDocument) {
    await this.postsCollection.updateOne(
      { id: post.id },
      { $set: post },
      { upsert: true }
    );
    return new Post(post, this);
  }

  async deletePost(id: string) {
    // Implement soft delete
    await this.postsCollection.deleteOne({ id });
  }

  async getComments() {
    const comments = await this.commentsCollection.find().toArray();
    return comments.map((comment) => new Comment(comment, this));
  }

  getComment(id: string): Promise<Comment> {
    throw new Error("Method not implemented.");
  }

  async saveComment(comment: Comment): Promise<Comment> {
    const { parent, ..._comment } = comment;
    await this.commentsCollection.updateOne(
      { id: comment.id },
      { $set: {
        ..._comment,
        parentId: parent.id,
      } },
      { upsert: true }
    );
    return new Comment(comment, this);
  }

  deleteComment(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
