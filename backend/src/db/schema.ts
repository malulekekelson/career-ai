import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  credits: integer('credits').default(5),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').default('pending'), // pending | processing | completed | failed
  originalFilename: text('original_filename'),
  originalFileKey: text('original_file_key'),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  content: text('content', { mode: 'json' }), // Stores the parsed resume JSON
  atsScore: integer('ats_score'),
  grammarScore: integer('grammar_score'),
  formattingScore: integer('formatting_score'),
  impactScore: integer('impact_score'),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const coverLetters = sqliteTable('cover_letters', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  content: text('content'),
  fileKey: text('file_key'),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const linkedinProfiles = sqliteTable('linkedin_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  headline: text('headline'),
  summary: text('summary'),
  experience: text('experience', { mode: 'json' }),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const skillGaps = sqliteTable('skill_gaps', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  currentSkills: text('current_skills', { mode: 'json' }),
  recommendedSkills: text('recommended_skills', { mode: 'json' }),
  certifications: text('certifications', { mode: 'json' }),
  createdAt: text('created_at').default(new Date().toISOString()),
});

export const careerReports = sqliteTable('career_reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  strengths: text('strengths'),
  weaknesses: text('weaknesses'),
  opportunities: text('opportunities'),
  salary: text('salary'),
  roadmap: text('roadmap', { mode: 'json' }),
  createdAt: text('created_at').default(new Date().toISOString()),
});