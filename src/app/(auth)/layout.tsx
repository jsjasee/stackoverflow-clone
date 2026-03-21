// // the file MUST be called as layout.
// // layout file is just acting as a wrapper?
// // what does it mean when all the sub-files will be containerized inside that layout.tsx? is it like im building the page with the components?
// // this file is copied from the layout.tsx in the main folder - did shadcn create the layout.tsx in the app folder?
// "use client";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "../../store/Auth";
// import React from "react";

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   // we can check whether there is a session -> so that no need to display the auth or login section?
//   const { session } = useAuthStore(); // we are taking the session variable from useAuthStore - covered in learning log.
//   const router = useRouter();

//   React.useEffect(() => {
//     if (session) {
//       // if there is a session, redirect the user to the home page.
//       router.push("/");
//     }
//   }, [session, router]); // as soon as there's a change in session or router, run the useEffect.

//   // then return nothing if there's a session
//   if (session) {
//     return null;
//   }

//   // otherwise if there is NO session, we want to show the login buttons
//   return (
//     // if there is NO session, just load the children
//     <div className="">
//       <div className="">{children}</div>
//     </div>
//   );
// };

"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <BackgroundBeams />
      <div className="relative">{children}</div>
    </div>
  );
};

export default Layout;
