import { prisma } from "~/db.server";

// type Post = {
//   slug: string;
//   title: string;
// };

export async function getPostListing() {
  return prisma.post.findMany({
    select: {
      slug: true,
      title: true,
    },
  });
}

export async function getPosts() {
  return prisma.post.findMany();
}
