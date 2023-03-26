import { json, LoaderFunction, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

// define loader
export const loader: LoaderFunction = async ({ request }) => {
  // require admin for a new post
  await requireAdminUser(request);
  return json({}); // if you define a loader, you must return something, so we use an empty object
};

// define action type
type ActionData = {
  title: string | null;
  slug: string | null;
  markdown: string | null;
};

export const action: ActionFunction = async ({ request }) => {
  // require admin for a new post
  await requireAdminUser(request);
  //  console.log(Object.fromEntries(await request.formData()));
  const formData = await request.formData();

  // get the values from the form
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  // backend validation
  // if truthy, return null as there are no errors
  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  // Object.values() returns an array of the values of the object
  // Array.some() returns true if any of the values in the array are true
  // if any of the values are true, then there are errors
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  // if there are errors, return the errors to the client
  if (hasErrors) {
    return json(errors);
  }

  // tell remix that our action function is expecting a string
  invariant(typeof title === "string", "title should be a string");
  invariant(typeof slug === "string", "slug should be a string");
  invariant(typeof markdown === "string", "markdown should be a string");

  // create the post
  await createPost({ title, slug, markdown });

  // redirect to the admin page after creating the post
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
  const errors = useActionData() as ActionData; // useActionData returns the data from the action function, we define the types accepted in the type ActionData

  // using useTransition() to show a loading state
  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "loading");

  return (
    // The Form component will automatically handle the form submission action once we define out action function above
    <Form method="post">
      <p>
        <label>
          Post Title:
          {/* if errors.title is truthy, return error message */}
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
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
