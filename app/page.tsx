import CategoriesList from "@/components/CategoriesList";
import Post from "@/components/Post";
import { TPost } from "./types";

const getPosts = async (): Promise<TPost[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
      cache: "no-store",
    });
    if (res.ok) {
      const posts = await res.json();
      return posts;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default async function Home() {
  const posts = await getPosts();
  return (
    <>
      <CategoriesList />
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            author={post.author.name}
            authorEmail={post.authorEmail}
            content={post.content}
            datepublished={post.createdAt}
            category={post.catName }
            links={post.links || []}
            thumbnail={post.imageUrl}
          />
        ))
      ) : (
        <div className="py-6 font-bold">not post to display</div>
      )}
    </>
  );
}
