import { Post } from "@jsblog/core";
import { GetStaticPropsContext } from "next";
import { getPosts } from "src/api/posts";

export default function Home({ posts }: { posts: Post[] }) {
    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <a href={`/posts/${post.id}`}>{post.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {
    const posts = await getPosts();
    return {
        props: {
            posts,
        },
    }
}