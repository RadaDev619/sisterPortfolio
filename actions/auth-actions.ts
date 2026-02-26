"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

// 2. LOGIN USER
export async function loginUserAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, message: "Username and password are required." };
  }

  try {
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      return { success: false, message: "Invalid credentials." };
    }

    // Compare password
    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) {
      return { success: false, message: "Invalid credentials." };
    }

    // Set session cookies – await cookies() first
    const cookieStore = await cookies();

    cookieStore.set("userId", user[0].id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Also set a non-http cookie for client-side checks
    cookieStore.set("isLoggedIn", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, message: "Login successful!" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login failed." };
  }
}

// 3. LOGOUT USER
export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  cookieStore.delete("isLoggedIn");
  redirect("/login");
}

// 4. CHECK IF USER IS AUTHENTICATED (for protecting routes)
export async function isAuthenticated() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  return !!userId;
}

// 5. GET CURRENT USER (optional)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return null;

  try {
    const user = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);
    return user[0] || null;
  } catch {
    return null;
  }
}
