import { LoaderFunction, json } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { marked } from "marked";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

type LoaderData = {
  title: string;
  html: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");

  const post = await getPost(slug);
  invariant(post, `post not found: ${slug}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ title: post.title, html });
};

export default function postRoute() {
  const { title, html } = useLoaderData() as LoaderData;

  return (
    <main className="max-w-auto-4xl mx-auto">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
