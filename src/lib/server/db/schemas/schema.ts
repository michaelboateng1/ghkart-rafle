export * from './auth-schema';
import { user, session, account } from './auth-schema';
import { relations } from 'drizzle-orm';

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const customers = sqliteTable('customers', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phoneNumber: text('phone_number').notNull().unique(),
	address: text('address').notNull(),
	numberOfSpins: integer('number_of_spins').notNull().default(0),
	winPrice: integer('win_price', {mode: "boolean"}).notNull().default(false),
	priceName: text('price_name').notNull().default("no price"),
	priceCollected: integer('price_collected', {mode: "boolean"}).notNull().default(false),
	certificateGenerated: integer('certificate_generated', {mode: "boolean"}).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const customersRelations = relations(customers, ({ one }) => ({
	user: one(user, {
		fields: [customers.userId],
		references: [user.id]
	})
}));

export const userRelations = relations(user, ({ many, one }) => ({
	customer: one(customers, {
		fields: [user.id],
		references: [customers.userId]
	}),
	sessions: many(session),
	accounts: many(account)
}));
