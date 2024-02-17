"use client";

import Link from "next/link";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function Navbar() {
  const { status, data: session } = useSession();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    if (!isPopupVisible) {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isPopupVisible]);
  return (
    <div className="flex justify-between pb-4  border-b mb-3 relative">
      <div>
        <Link href={"/"}>
          <h1 className="text-dark text-4xl font-bold tracking-tighter ">
            Tech News
          </h1>
        </Link>
        <p>
          Exploring Tomorrow's Innovations <br /> One Byte at a Time
        </p>
      </div>
      {status === "authenticated" ? (
        <>
          <div
            ref={popupRef}
            className={`absolute z-30 right-0 top-20 bg-white p-6 shadow-lg rounded-md flex-col gap-2 text-right min-w-[160px] ${
              isPopupVisible ? "flex" : "hidden"
            }`}
          >
            <div className="font-bold">{session?.user?.name}</div>
            <div>{session?.user?.email}</div>
            <Link
              className="hover:underline"
              onClick={() => setIsPopupVisible(false)}
              href={"/dashboard"}
            >
              Dashboard
            </Link>
            <Link
              className="hover:underline"
              onClick={() => setIsPopupVisible(false)}
              href={"/create-post"}
            >
              Create Post
            </Link>
            <button onClick={() => signOut()} className="btn">
              Sign Out
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              className="  flex gap-2 items-center mr-6"
              href={"/create-post"}
            >
              <span>
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <span>Create new</span>
            </Link>
            <Image
              src={session?.user?.image || " "}
              width={36}
              height={36}
              alt="image"
              className="rounded-full cursor-pointer"
              onClick={() => setIsPopupVisible((prev) => !prev)}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center">
          <Link className="btn" href={"/sign-in"}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
