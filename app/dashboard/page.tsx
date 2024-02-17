import Post from "@/components/Post";
import Link from "next/link";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { TPost } from "../types";

const getPosts = async (email: string) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authors/${email}`);
    const { posts } = await res.json();
    return posts;
  } catch (error) {
    return null;
  }
};
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  let posts = [];

  if (email) {
    posts = await getPosts(email);
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="font-bold text-2xl">MY Post</h1>

      {posts && posts.length > 0 ? (
        posts.map((post: TPost) => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            author={""}
            authorEmail={post.authorEmail}
            content={post.content}
            datepublished={post.createdAt}
            category={post.catName}
            links={post.links || []}
            thumbnail={post.imageUrl}
          />
        ))
      ) : (
        <div className="py-6">
          No posts created yet.
          <Link className="underline font-bold" href={"/create-post"}>
            Create New
          </Link>
        </div>
      )}
    </div>
  );
}
