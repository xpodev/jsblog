import { Blog } from "@jsblog/core";
import { MongoAdapter } from "@jsblog/mongodb";

const adapter = new MongoAdapter({
  uri: process.env.MONGO_URL || "mongodb://localhost:27017",
});

const blog = new Blog({ adapter });

export default blog;
