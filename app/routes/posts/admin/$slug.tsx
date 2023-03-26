import { json, LoaderFunction, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

// define loader
export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request); // require admin for a new post
  // new post
  if (params.slug === "new") {
    // return empty form data
    return json({});
  }
  // update post
  const post = await getPost(params.slug); // get post data by slug
  return json({ post }); // return that post
};

// define action type
type ActionData = {
  title: string | null;
  slug: string | null;
  markdown: string | null;
};

export const action: ActionFunction = async ({ request, params }) => {
  // require admin for a new post
  await requireAdminUser(request);

  //  console.log(Object.fromEntries(await request.formData()));
  const formData = await request.formData();

  // get the intent from the form
  const intent = formData.get("intent");
  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/posts/admin");
  }

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
  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    // update the post
    await updatePost(params.slug, { title, slug, markdown });
  }

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
  const data = useLoaderData(); // gets empty form or the slug for that post
  const errors = useActionData() as ActionData; // useActionData returns the data from the action function, we define the types accepted in the type ActionData

  // using useTransition() to show a loading state
  const navigation = useNavigation();
  // get formData to see if intent is creat or update
  const formData = navigation.formData;
  const isUpdating = formData?.get("intent") === "update";
  const isCreating = formData?.get("intent") === "create";
  const isDeleting = formData?.get("intent") === "delete";

  // state variable to determine if we are creating a new post or updating
  const isNewPost = !data.post;

  return (
    // The Form component will automatically handle the form submission action once we define out action function above
    <Form method="post" key={data.post?.slug ?? "new"}>
      {/* key will get the data from the post with the slug(i.e url path) which can be empty, this will make it with slug 'new' if empty or give the key for the existing post we want to update */}
      <p>
        <label>
          Post Title:
          {/* if errors.title is truthy, return error message */}
          {errors?.title ? (
            <span className="text-red-500"> {errors.title}</span>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={data.post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <span className="text-red-500"> {errors.slug}</span>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={data.post?.slug}
          />
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
          defaultValue={data.post?.markdown}
        />
      </p>
      <div className="flex justify-end gap-4">
        {isNewPost ? null : (
          <button
            type="button"
            name="intent"
            value="delete"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
            Delete Post
          </button>
        )}

        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating || isUpdating}
        >
          {isNewPost ? (isCreating ? "Creating..." : "Create Post") : null}
          {isNewPost ? null : isUpdating ? "Updating..." : "Update Post"}
        </button>
      </div>
    </Form>
  );
}
