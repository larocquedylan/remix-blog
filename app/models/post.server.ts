import { Post } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post };

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

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}

// update, pass the slug so we know which to update
export async function updatePost(
  slug: string,
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.update({ where: { slug }, data: post }); // return where the slug is equal to the slug we pass in and data is the post we pass in
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
