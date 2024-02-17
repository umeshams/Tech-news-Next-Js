"use client";
import { TCategory } from "@/app/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadButton, CldUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CreatePostForm() {
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");

  const router = useRouter();
  useEffect(() => {
    const featchAllCategories = async () => {
      const res = await fetch("/api/categories");
      const categories = await res.json();
      setCategories(categories);
    };

    featchAllCategories();
  }, []);

  const handleImageUpload = (result: CldUploadWidgetResults) => {
    console.log("result: ", result);

    const info = result.info as object;

    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string;
      const public_id = info.public_id as string;
      setImageUrl(url);
      setPublicId(public_id);

      console.log("url", url);
      console.log("public_id", public_id);
    }
  };

  const addlink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (linkInput.trim() !== "") {
      setLinks((prev) => [...prev, linkInput]);
      setLinkInput("");
    }
  };

  const deleteLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/removeimage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (res.ok) {
        setImageUrl("");
        setPublicId("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      const errorMessage = "Title and content are requeried";
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await fetch("api/posts/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          links,
          selectedCategory,
          imageUrl,
          publicId,
        }),
      });
      if (res.ok) {
        toast.success('Post created successfully')
        router.push("/dashboard");
        router.refresh();
      }else{
        toast.error('somethink went wrong')
      }
    } catch (error) {}
  };
  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
        />
        <textarea
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        ></textarea>
        {links &&
          links.map((link, i) => (
            <div key={i} className="flex items-center gap-4 ">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
                </svg>
              </span>

              <Link className="link" href={link}>
                {link}
              </Link>
              <span className="cursor-pointer" onClick={() => deleteLink(i)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          ))}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            onChange={(e) => setLinkInput(e.target.value)}
            value={linkInput}
            className="flex-1"
            placeholder="Paste the link and click on Add"
          />
          <button onClick={addlink} className="btn flex items-center gap-2 ">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            </span>
            Add
          </button>
        </div>

        <CldUploadButton
          onUpload={handleImageUpload}
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          className={` h-48 border-2  mt-4 border-dotted grid  place-items-center bg-slate-100 rounded-md relative ${
            imageUrl && "pointer-events-none"
          }`}
        >
          <div>
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
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={"image"}
              fill
              className="absolute object-cover inset-0"
            />
          )}
        </CldUploadButton>
        {publicId && (
          <button
            onClick={removeImage}
            className="py-2 px-4 bg-red-600 w-fit rounded-md text-white font-bold mb-3"
          >
            {" "}
            Remove Image
          </button>
        )}
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border rounded-md appearance-none"
        >
          <option value="">Select A Cotegory</option>
          {categories &&
            categories.map((categor) => (
              <option key={categor.id} value={categor.catName}>
                {categor.catName}
              </option>
            ))}
        </select>

        <button className="primary-btn" type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
}
