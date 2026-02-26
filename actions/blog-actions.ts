"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db"; // Imports your connection
import { activities } from "@/db/schema"; // Imports your table schema
import { desc, eq } from "drizzle-orm";
import { count, inArray } from "drizzle-orm";

// 1. CREATE POST
export async function createPostAction(formData: FormData) {
  // Extract data from the form
  const rawData = {
    title: formData.get("title") as string,
    date: formData.get("date") as string,
    category: formData.get("category") as string,
    content: formData.get("content") as string,
    imageUrl: formData.get("imageUrl") as string, // From Cloudinary
    videoUrl: formData.get("videoUrl") as string,
    galleryUrl: formData.get("galleryUrl") as string,
  };

  try {
    // Insert into NeonDB
    await db.insert(activities).values({
      title: rawData.title,
      date: rawData.date,
      category: rawData.category,
      content: rawData.content,
      imageUrl: rawData.imageUrl || null, // Handle empty strings as null if needed
      videoUrl: rawData.videoUrl || null,
      galleryUrl: rawData.galleryUrl || null,
    });

    // Refresh the admin page so the new post shows up immediately
    revalidatePath("/admin/blogAdmin");

    return { success: true, message: "Journal entry created successfully!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to create entry." };
  }
}

// 2. GET POSTS
export async function getPostsAction() {
  try {
    // Select all posts, ordered by newest first (assuming ID increments)
    // You can also change `posts.id` to `posts.date` if you prefer
    const data = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.id));
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return []; // Return empty array on error so UI doesn't crash
  }
}

// 3. DELETE POST
export async function deletePostAction(id: number) {
  try {
    await db.delete(activities).where(eq(activities.id, id));

    revalidatePath("/admin/blogAdmin");
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("Delete failed:", error);
    return { success: false, message: "Failed to delete" };
  }
}

// 6. NEW: GET TOTAL BLOG ENTRIES (all rows in activities)
export async function getTotalBlogEntriesAction() {
  try {
    const result = await db.select({ value: count() }).from(activities);
    return Number(result[0]?.value || 0);
  } catch (error) {
    console.error("Failed to fetch total blog entries:", error);
    return 0;
  }
}

// 4. NEW: GET MILESTONE COUNT (activities with category = 'milestone')
export async function getMilestoneCountAction() {
  try {
    const result = await db
      .select({ value: count() })
      .from(activities)
      .where(eq(activities.category, "milestone"));
    return Number(result[0]?.value || 0);
  } catch (error) {
    console.error("Failed to fetch milestone count:", error);
    return 0;
  }
}

// In blog-actions.ts
export async function getLatestPostsAction() {
  try {
    const data = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt)) // or activities.id
      .limit(3);
    return data;
  } catch (error) {
    return [];
  }
}

export async function getEventsAndActivitiesCountAction() {
  try {
    const result = await db
      .select({ value: count() })
      .from(activities)
      .where(inArray(activities.category, ["Events", "Activities"]));
    return Number(result[0]?.value || 0);
  } catch (error) {
    console.error("Failed to fetch events & activities count:", error);
    return 0;
  }
}

export async function getPostsByCategoriesAction(categories: string[]) {
  try {
    const data = await db
      .select()
      .from(activities)
      .where(inArray(activities.category, categories))
      .orderBy(desc(activities.createdAt));
    return data;
  } catch (error) {
    console.error("Failed to fetch posts by categories:", error);
    return [];
  }
}
