CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'TODO' NOT NULL,
	`priority` text DEFAULT 'MEDIUM' NOT NULL,
	`estimated_hours` real,
	`assignee_id` text,
	`due_date` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `task_project_id_idx` ON `task` (`project_id`);--> statement-breakpoint
CREATE INDEX `task_assignee_id_idx` ON `task` (`assignee_id`);--> statement-breakpoint
CREATE INDEX `task_status_idx` ON `task` (`status`);--> statement-breakpoint
CREATE INDEX `task_priority_idx` ON `task` (`priority`);--> statement-breakpoint
CREATE INDEX `task_due_date_idx` ON `task` (`due_date`);--> statement-breakpoint
CREATE INDEX `task_title_idx` ON `task` (`title`);--> statement-breakpoint
CREATE TABLE `time_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`task_id` text,
	`description` text,
	`start_time` integer NOT NULL,
	`end_time` integer,
	`duration_minutes` integer,
	`billable` integer DEFAULT true NOT NULL,
	`invoiced` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `time_entry_user_id_idx` ON `time_entry` (`user_id`);--> statement-breakpoint
CREATE INDEX `time_entry_start_time_idx` ON `time_entry` (`start_time`);--> statement-breakpoint
CREATE INDEX `time_entry_end_time_idx` ON `time_entry` (`end_time`);