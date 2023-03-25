import { LoaderFunction, json } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { marked } from "marked";
import { useLoaderData } from "react-router";

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const post = await getPost(slug);
  const html = marked(post.markdown);
  return json({ title: post.title, html });
};

export default function postRoute() {
  const { title, html } = useLoaderData();

  return (
    <main className="mx-auto max-w-auto-4xl">
      <h1 className="my-6 text-3xl text-center border-b-2">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
