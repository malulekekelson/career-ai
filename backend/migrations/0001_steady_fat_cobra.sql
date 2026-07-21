CREATE TABLE `career_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`strengths` text,
	`weaknesses` text,
	`opportunities` text,
	`salary` text,
	`roadmap` text,
	`created_at` text DEFAULT '2026-07-21T15:35:51.994Z',
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cover_letters` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`content` text,
	`file_key` text,
	`created_at` text DEFAULT '2026-07-21T15:35:51.993Z',
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `linkedin_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`headline` text,
	`summary` text,
	`experience` text,
	`created_at` text DEFAULT '2026-07-21T15:35:51.993Z',
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`content` text,
	`ats_score` integer,
	`grammar_score` integer,
	`formatting_score` integer,
	`impact_score` integer,
	`created_at` text DEFAULT '2026-07-21T15:35:51.993Z',
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `skill_gaps` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`current_skills` text,
	`recommended_skills` text,
	`certifications` text,
	`created_at` text DEFAULT '2026-07-21T15:35:51.994Z',
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`status` text DEFAULT 'pending',
	`original_filename` text,
	`original_file_key` text,
	`created_at` text DEFAULT '2026-07-21T15:35:51.993Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "user_id", "status", "original_filename", "original_file_key", "created_at") SELECT "id", "user_id", "status", "original_filename", "original_file_key", "created_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text,
	`credits` integer DEFAULT 5,
	`email_verified` integer DEFAULT false,
	`created_at` text DEFAULT '2026-07-21T15:35:51.992Z'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password_hash", "full_name", "credits", "email_verified", "created_at") SELECT "id", "email", "password_hash", "full_name", "credits", "email_verified", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);