import { NextResponse, NextRequest } from "next/server";
import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

// this function runs for the paths listed in 'matcher'. what the code is doing for paths like '/about' it will redirect to '/home', same for '/about/team' or '/about/gibberish' etc... but the code will not redirect for '/contact', ie user that access '/contact' will reach '/contact' and NOT '/home'
export async function proxy(request: NextRequest) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]); // this makes sure that when our login / home page is served, we either get the database or store it as an instance
  return NextResponse.next(); // moves on to the next middleware.
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - api routes
     * - Next static files
     * - Next image optimizer
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
