import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Access the cookies
  const cookieStore = await cookies();

  // 2. Delete your authentication cookie. 
  // IMPORTANT: Change "admin_token" to whatever name you actually used for your auth cookie!
  cookieStore.delete("admin_token"); 
  
  // If you use multiple cookies for auth, delete them all:
  // cookieStore.delete("session");

  // 3. Redirect the user back to the login page (or home page)
  const loginUrl = new URL("/", request.url);
  
  return NextResponse.redirect(loginUrl);
}
