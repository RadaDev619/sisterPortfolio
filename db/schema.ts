import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  galleryUrl: text("gallery_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teachingClasses = pgTable("teaching_classes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  level: text("level").notNull(),
  year: text("year").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // store hashed password
  createdAt: timestamp("created_at").defaultNow(),
});
