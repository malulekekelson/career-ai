PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_career_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`strengths` text,
	`weaknesses` text,
	`opportunities` text,
	`salary` text,
	`roadmap` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_career_reports`("id", "project_id", "strengths", "weaknesses", "opportunities", "salary", "roadmap", "created_at") SELECT "id", "project_id", "strengths", "weaknesses", "opportunities", "salary", "roadmap", "created_at" FROM `career_reports`;--> statement-breakpoint
DROP TABLE `career_reports`;--> statement-breakpoint
ALTER TABLE `__new_career_reports` RENAME TO `career_reports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_cover_letters` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`content` text,
	`file_key` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cover_letters`("id", "project_id", "content", "file_key", "created_at") SELECT "id", "project_id", "content", "file_key", "created_at" FROM `cover_letters`;--> statement-breakpoint
DROP TABLE `cover_letters`;--> statement-breakpoint
ALTER TABLE `__new_cover_letters` RENAME TO `cover_letters`;--> statement-breakpoint
CREATE TABLE `__new_linkedin_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`headline` text,
	`summary` text,
	`experience` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_linkedin_profiles`("id", "project_id", "headline", "summary", "experience", "created_at") SELECT "id", "project_id", "headline", "summary", "experience", "created_at" FROM `linkedin_profiles`;--> statement-breakpoint
DROP TABLE `linkedin_profiles`;--> statement-breakpoint
ALTER TABLE `__new_linkedin_profiles` RENAME TO `linkedin_profiles`;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`status` text DEFAULT 'pending',
	`original_filename` text,
	`original_file_key` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "user_id", "status", "original_filename", "original_file_key", "created_at") SELECT "id", "user_id", "status", "original_filename", "original_file_key", "created_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
CREATE TABLE `__new_resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`content` text,
	`ats_score` integer,
	`grammar_score` integer,
	`formatting_score` integer,
	`impact_score` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_resumes`("id", "project_id", "content", "ats_score", "grammar_score", "formatting_score", "impact_score", "created_at") SELECT "id", "project_id", "content", "ats_score", "grammar_score", "formatting_score", "impact_score", "created_at" FROM `resumes`;--> statement-breakpoint
DROP TABLE `resumes`;--> statement-breakpoint
ALTER TABLE `__new_resumes` RENAME TO `resumes`;--> statement-breakpoint
CREATE TABLE `__new_skill_gaps` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`current_skills` text,
	`recommended_skills` text,
	`certifications` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_skill_gaps`("id", "project_id", "current_skills", "recommended_skills", "certifications", "created_at") SELECT "id", "project_id", "current_skills", "recommended_skills", "certifications", "created_at" FROM `skill_gaps`;--> statement-breakpoint
DROP TABLE `skill_gaps`;--> statement-breakpoint
ALTER TABLE `__new_skill_gaps` RENAME TO `skill_gaps`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text,
	`credits` integer DEFAULT 5,
	`email_verified` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password_hash", "full_name", "credits", "email_verified", "created_at") SELECT "id", "email", "password_hash", "full_name", "credits", "email_verified", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);