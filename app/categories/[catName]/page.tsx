import { TPost } from "@/app/types";
import Post from "@/components/Post";

const getPosts = async (catName: string): Promise<TPost[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/categories/${catName}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const categories = await res.json();
      const posts = categories.posts;
      return posts;
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};
export default async function CategoryPosts({
  params,
}: {
  params: { catName: string };
}) {
  const category = params.catName;
  const posts = await getPosts(category);

  return (
    <>
      <h2>
        <span className="font-normal">Category:</span>{" "}
        {decodeURIComponent(category)}
      </h2>
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
            category={post.catName}
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
