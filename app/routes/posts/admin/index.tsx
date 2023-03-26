import { json, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { requireAdminUser } from "~/session.server";

// define loader
export const loader: LoaderFunction = async ({ request }) => {
  // require admin for a new post
  await requireAdminUser(request);
  return json({});
};

export default function adminIndexRoute() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        Create New Post
      </Link>
    </p>
  );
}
