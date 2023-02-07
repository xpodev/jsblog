import { blog } from "src/lib/blog";

export const getPosts = async () => {
  const client = await blog;
  return client.getPosts().then((posts) => {
    return posts.map((post) => JSON.parse(JSON.stringify(post.toJSON())));
  });
};
