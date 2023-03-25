import { json, redirect } from "@remix-run/node";
import { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createPost } from "~/models/post.server";

export const action: ActionFunction = async ({ request }) => {
  //   console.log(Object.fromEntries(await request.formData()));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  // backend validation
  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

// export const action: ActionFunction = async ({ request }) => {
//   return new Response(null, {
//     // 302 is a redirect status code
//     status: 302,
//     // The Location header tells the browser where to go
//     headers: {
//       Location: "/posts/admin",
//     },
//   });
// };

const inputClassName = "rounded border border-gray-300 py-2 px-4 block w-full";

export default function newPostRoute() {
  const errors = useActionData();
  return (
    // The Form component will automatically handle the form submission action once we define out action function above
    <Form method="post">
      <p>
        <label>
          Post Title:
          {errors?.title ? (
            <span className="text-red-500"> {errors.title}</span>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <span className="text-red-500"> {errors.slug}</span>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <span className="text-red-500"> {errors.markdown}</span>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
