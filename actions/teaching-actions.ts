"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { teachingClasses } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

// 1. CREATE CLASS
export async function createClassAction(formData: FormData) {
  try {
    const rawData = {
      code: formData.get("code") as string,
      title: formData.get("title") as string,
      level: formData.get("level") as string,
      year: formData.get("year") as string,
      description: formData.get("description") as string,
    };

    await db.insert(teachingClasses).values(rawData);

    revalidatePath("/admin/teachingAdmin");
    return { success: true, message: "Class added successfully!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to add class." };
  }
}

// 2. GET CLASSES
export async function getClassesAction() {
  try {
    const data = await db
      .select()
      .from(teachingClasses)
      .orderBy(desc(teachingClasses.year));
    return data;
  } catch (error) {
    return [];
  }
}

// 3. DELETE CLASS
export async function deleteClassAction(id: number) {
  try {
    await db.delete(teachingClasses).where(eq(teachingClasses.id, id));
    revalidatePath("/admin/teachingAdmin");
    return { success: true, message: "Class deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}

// 4. NEW: GET TOTAL TEACHING CLASSES COUNT
export async function getTotalTeachingClassesAction() {
  try {
    const result = await db.select({ value: count() }).from(teachingClasses);
    return Number(result[0]?.value || 0);
  } catch (error) {
    console.error("Failed to fetch teaching classes count:", error);
    return 0;
  }
}
