CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`status` text DEFAULT 'pending',
	`original_filename` text,
	`original_file_key` text,
	`created_at` text DEFAULT '2026-07-21T15:28:50.351Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text,
	`credits` integer DEFAULT 5,
	`email_verified` integer DEFAULT false,
	`created_at` text DEFAULT '2026-07-21T15:28:50.350Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);