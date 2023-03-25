import { redirect } from "@remix-run/node";
import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createPost } from "~/models/post.server";

export const action: ActionFunction = async ({ request }) => {
  //   console.log(Object.fromEntries(await request.formData()));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

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
  return (
    // The Form component will automatically handle the form submission action once we define out action function above
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
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
