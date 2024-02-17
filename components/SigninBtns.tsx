'use client';

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SigninBtns() {
  return (
    <>
      <h1 className=" font-bold text-center mt-8 text-2xl">Sign in</h1>
      <div className="flex flex-col justify-center items-center mt-4 p-4 gap-4">
        <button onClick={()=>signIn('github')} className="flex items-center gap-4 border p-4  rounded-full hover:bg-slate-100/25 transition">
          <span>
            <Image  src={'/github-logo.svg'} alt="GitHub Logo" width={30} height={30}/>
          </span>
          Sign In with GitHub
        </button>
        <button onClick={()=>signIn('google')} className="flex items-center gap-4 border p-4  rounded-full hover:bg-slate-100/25 transition">
          <span>
            <Image  src={'/google-logo.svg'} alt="GitHub Logo" width={30} height={30}/>
          </span>
          Sign In with Google
        </button>
      </div>
    </>
  );
}
