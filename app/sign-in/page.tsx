import SigninBtns from "@/components/SigninBtns";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SignIn() {

  const session = await getServerSession(authOptions);
     if(session){
      redirect('/dashboard')
     }
  return (
    <div>
     <SigninBtns/>
    </div>
  )
}
