import { LoaderFunction, json } from "@remix-run/node";
import { getPost } from "~/models/post.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const post = await getPost(slug);
  return json({ post });
};

export default function postRoute() {
  const post = { title: "My first post" };

  return (
    <main>
      <h1>{post.title}</h1>
    </main>
  );
}
