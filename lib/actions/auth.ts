"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Add ADMIN_PASSWORD="your_secure_password" to your Vercel Environment Variables
export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is missing.");
    throw new Error("System configuration error.");
  }

  if (password === adminPassword) {
    // Set a secure, HTTP-only cookie that expires in 7 days
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

    redirect("/admin");
  } else {
    throw new Error("Invalid password");
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}
