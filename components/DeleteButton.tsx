"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const deleteImage = async (publicId: string) => {
    const res = await fetch("/api/removeimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });
  };
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want delete this post?");

    if (confirmed) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        });

        if (res.ok) {
          router.refresh();
          const post = await res.json();
          const { publicId } = post;
          await deleteImage(publicId);

          toast.success('Post deleted successfully')
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600">
      Delete
    </button>
  );
}
