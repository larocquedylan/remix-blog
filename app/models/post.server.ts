// type Post = {
//   slug: string;
//   title: string;
// };

export async function getPosts() {
  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post",
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
    },
  ];

  return posts;
}
