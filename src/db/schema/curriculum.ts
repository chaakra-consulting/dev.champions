import { datetime, int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const curriculum = mysqlTable("curriculums", {
    id: int("id").primaryKey().autoincrement().notNull(),
    name: varchar({ length: 30 }).notNull(),
    desc: text("desc"),
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
        .$defaultFn(() => new Date())
        .notNull(),
        
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date())
        .notNull(),
})