import { datetime, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
// import { parentAccount } from "./parent-user";
import { relations, sql } from "drizzle-orm";
import { user } from "./user";

export const parentPersonal = mysqlTable('parents', {
    id: int('id').primaryKey().autoincrement().notNull(),
    // parentAccountId: int('parent_account_id').references(() => parentAccount.id),
    accountId: varchar("account_id",{ length: 36 }).references(() => user.id).notNull().unique(),
    relation: varchar({ enum: ['mother', 'father', 'others'] as const, length: 8 }).default('father').notNull(),
    name: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 18 }).notNull(),
    address: text('address').notNull(),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .$defaultFn(() => new Date())
        .notNull(),
        
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date())
        .notNull(),

})

export const studentPersonalRelations = relations(parentPersonal, ({ one }) => ({
    user: one(user, {
        fields: [parentPersonal.accountId],
        references: [user.id],
    }),
}));