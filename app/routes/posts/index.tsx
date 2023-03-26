import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";
import { useOptionalAdminUser, useOptionalUser } from "~/utils";

// need to add type because `json` in the loader is a generic so we need to tell it what type of data we are expecting
type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function Posts() {
  // const { posts } = useLoaderData<typeof loader>();
  const { posts } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();

  // const user = useOptionalUser();
  // const isAdmin = user?.email === ENV.ADMIN_EMAIL;

  return (
    <main>
      <h1>posts</h1>
      {adminUser ? (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      ) : null}
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
