import type { loaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "react-router";
import { getPosts } from "~/models/post.server";

type LoaderData = {
   posts:  Awaited <ReturnType< typeof getPosts>>
};

export const loader: LoaderFunction = async () => {
    const posts = await getPosts();
    return json({ posts }, { status: 200 });


export default function Posts() {
  // const { posts } = useLoaderData<typeof loader>();
  const { posts } = useLoaderData() as LoaderData;

  return (
    <main>
      <h1>posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
