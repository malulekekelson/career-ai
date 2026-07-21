import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  credits: integer('credits').default(5),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  status: text('status').default('pending'),
  originalFilename: text('original_filename'),
  originalFileKey: text('original_file_key'),
  createdAt: text('created_at').default(new Date().toISOString()),
});