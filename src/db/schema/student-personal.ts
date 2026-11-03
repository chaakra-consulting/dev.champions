import { int, mysqlTable, varchar, timestamp, text, datetime } from "drizzle-orm/mysql-core";
// import { studentAccount } from "./student-user";
import { relations, sql } from "drizzle-orm";
import { parentPersonal } from "./parent-personal";
import { user } from "./user";

export const studentPersonal = mysqlTable('student_personals', {
    id: int('id').primaryKey().autoincrement().notNull(),
    // studentAccountId: int('student_account_id').references(() => studentAccount.id),
    accountId: varchar("account_id", { length: 36 }).references(() => user.id).notNull().unique(),
    parentId: int('parent_id').references(() => parentPersonal.id),
    name: varchar({ length: 100 }).notNull(),
    pob: varchar({ length: 50 }).notNull(),
    dob: varchar({ length: 50 }).notNull(),
    schoolName: text('school_name').notNull(),
    schoolGrade: varchar('school_grade', { length: 3 }).notNull(),
    sex: varchar({ enum: ['male', 'female'] as const, length: 7 }).notNull(),
    religion: varchar({ length: 50 }).notNull(),
    phone: varchar({ length: 50 }).notNull(),
    address: text().notNull(),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .$defaultFn(() => new Date())
        .notNull(),
        
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date())
        .notNull(),


})

export const studentPersonalRelations = relations(studentPersonal, ({ one }) => ({
    user: one(user, {
        fields: [studentPersonal.accountId],
        references: [user.id],
    }),
}));

export const studentParentRelations = relations(studentPersonal, ({ one }) => ({
    parent: one(parentPersonal, {
        fields: [studentPersonal.parentId],
        references: [parentPersonal.id],
    }),
}));