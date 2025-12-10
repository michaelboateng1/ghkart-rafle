PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone_number` text NOT NULL,
	`address` text NOT NULL,
	`number_of_spins` integer DEFAULT 0 NOT NULL,
	`win_price` integer DEFAULT false NOT NULL,
	`price_name` text NOT NULL,
	`price_collected` integer DEFAULT false NOT NULL,
	`certificate_generated` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "name", "email", "phone_number", "address", "number_of_spins", "win_price", "price_name", "price_collected", "certificate_generated", "created_at", "updated_at", "user_id") SELECT "id", "name", "email", "phone_number", "address", "number_of_spins", "win_price", "price_name", "price_collected", "certificate_generated", "created_at", "updated_at", "user_id" FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_phone_number_unique` ON `customers` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_user_id_unique` ON `customers` (`user_id`);