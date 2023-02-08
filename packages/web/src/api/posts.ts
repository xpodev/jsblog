import blog from "src/blog";

export const getPosts = async () => {
  return blog.getPosts().then((posts) => {
    // This is actually terrible
    return posts.map((post) => JSON.parse(JSON.stringify(post.toJSON())));
  });
};
