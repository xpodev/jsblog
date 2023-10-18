import { MongoAdapter, createBlog } from "@jsblog/mongodb";
import { Blog } from "@jsblog/core";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

createBlog({
  mongoOptions: {
    uri: "mongodb://localhost:27017/jsblog-test",
  },
}).then(async (blog) => {
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
  const post = await blog.getPost("pDoFyKE7pE3oAGBUe5");
  await post.update({
    content: "Hello world 4",
  });

    process.exit(0);
});
