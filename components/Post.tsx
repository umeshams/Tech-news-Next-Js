import Image from "next/image";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface PostProps {
  id: string;
  title: String;
  content: String;
  author: string;
  datepublished: string;
  authorEmail: string;
  category: String;
  links: string[];
  thumbnail: string | undefined;
}

export default async function Post({
  id,
  title,
  authorEmail,
  author,
  content,
  datepublished,
  category,
  links,
  thumbnail,
}: PostProps) {
  // console.log(data)
  const session = await getServerSession(authOptions);
  const isEditable = session && session?.user?.email === authorEmail;
  const dateObject = new Date(datepublished);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formattedDate = dateObject.toLocaleDateString("en-us", options);

  return (
    <div className="border-b my-4 border-b-300 py-8">
      <div className="mb-4">
        {author ? (
          <>
            Posted by : <span className="font-bold">{author}</span> on {"  "}
            {formattedDate}
          </>
        ) : (
          <>
            Posted  on {"  "}
            {formattedDate}
          </>
        )}
      </div>
      <div className="w-full h-72 relative">
        {thumbnail ? (
          <Image
            className="object-cover rounded-md object-center"
            src={thumbnail}
            alt="image"
            fill
          />
        ) : (
          <Image
            className="object-cover rounded-md object-center"
            src={"/thumbnail-placeholder.png"}
            alt="thumbmail"
            fill
          />
        )}
      </div>
      {category && (
        <Link
          className="bg-slate-900 w-fit px-4 py-0.5  rounded-md text-white text-sm font-bold mt-2 block"
          href={`categories/${category}`}
        >
          {category}
        </Link>
      )}
      <h2>{title}</h2>
      <p className="content">{content}</p>
      <div className="flex flex-col my-4 gap-3">
        {links &&
          links.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
              <Link className="link" href={link}>
                {link}
              </Link>{" "}
            </div>
          ))}
        {isEditable && (
          <div className="flex gap-3 bg-slate-300 w-fit px-4 py-1 rounded-md font-bold ">
            <Link href={`/edit-post/${id}`}> edit</Link>
            <DeleteButton id={id} />
          </div>
        )}
      </div>
    </div>
  );
}
