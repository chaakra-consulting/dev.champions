import { relations } from 'drizzle-orm';
import {
  mysqlTable,
  int,
  text,
  varchar,
  date,
  mysqlEnum,
  timestamp,
  datetime,
} from 'drizzle-orm/mysql-core';
import { mentorPersonal } from './mentor-personal';
export const mentorAchievement = mysqlTable('mentor_achievements', {
  id: int('id').primaryKey().autoincrement(),
  mentorPersonalId: int('mentor_personal_id')
    .notNull()
    .references(() => mentorPersonal.id),
  name: varchar('name', { length: 100 }),
  rank: varchar('rank', { length: 2 }),
  scope: varchar('scope', { length: 10 }),
  attachment: varchar('attachment', { length: 100 }),
  desc: text('desc'),
  createdAt: datetime("created_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .notNull(),
          
  updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .$onUpdateFn(() => new Date())
          .notNull(),
});

export const mentorAchievementsRelations = relations(mentorAchievement, ({ one }) => ({
  mentorPersonal: one(mentorPersonal, {
    fields: [mentorAchievement.mentorPersonalId],
    references: [mentorPersonal.id],
  }),
}));