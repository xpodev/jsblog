import { Blog } from "@jsblog/core";
import { MongoAdapter } from "@jsblog/mongodb";

const adapter = new MongoAdapter({
  uri: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
});

export const blog = new Blog({ adapter }).init();