import { prisma } from "~/db.server";

// type Post = {
//   slug: string;
//   title: string;
// };

export async function getPosts() {
  return prisma.post.findMany();
}
