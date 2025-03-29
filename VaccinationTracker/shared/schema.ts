import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

// Child profiles table
export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthDate: date("birth_date").notNull(),
  gender: text("gender"),
  userId: integer("user_id").notNull(),
});

export const insertChildSchema = createInsertSchema(children).pick({
  firstName: true,
  lastName: true,
  birthDate: true,
  gender: true,
  userId: true,
});

// Vaccination record table
export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull(),
  vaccineName: text("vaccine_name").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  administered: boolean("administered").default(false),
  administeredDate: date("administered_date"),
  notes: text("notes"),
});

export const insertVaccinationSchema = createInsertSchema(vaccinations).pick({
  childId: true,
  vaccineName: true,
  scheduledDate: true,
  administered: true,
  administeredDate: true,
  notes: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Child = typeof children.$inferSelect;
export type InsertChild = z.infer<typeof insertChildSchema>;

export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
