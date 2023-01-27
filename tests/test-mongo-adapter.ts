import { MongoAdapter } from "@jsblog/mongodb";
import { Blog } from "@jsblog/core";

const adapter = new MongoAdapter("mongodb://127.0.0.1:27017/jsblog-test");
const blog = new Blog({
  adapter,
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

blog.init().then(async () => {
  //   const post = await blog.createPost({
  //     title: "Hello world",
  //     content: "Hello world",
  //   });
  //   await delay(3000);
  //   await post.update({
  //     title: "Hello world 2",
  //   });
  //   await delay(3000);
  //   await post.addComment({
  //     content: "Hello world",
  //   });
  const post = await blog.getPost("YAOigHu4dAjejjDnDm");
  await post.comments[0].update({
    content: "Hello world 2",
  });

  //   process.exit(0);
});
