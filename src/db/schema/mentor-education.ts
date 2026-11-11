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
export const mentorEducation = mysqlTable('mentor_educations', {
  id: int('id').primaryKey().autoincrement(),
  mentorPersonalId: int('mentor_personal_id')
    .notNull()
    .references(() => mentorPersonal.id),
  eduLevel: varchar('edu_level', { length: 10 }).notNull(),
  institutionName: varchar('institution_name', { length: 100 }).notNull(),
  department: varchar('department', { length: 50 }).notNull(),
  isGraduated: int('is_graduated'),
  startedYear: varchar('started_year', { length: 4 }),
  graduatedDate: date('graduated_date'),
  gpa: varchar('gpa', { length: 5 }),
  createdAt: datetime("created_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .notNull(),
          
  updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .$onUpdateFn(() => new Date())
          .notNull(),
});

export const mentorEducationsRelations = relations(mentorEducation, ({ one }) => ({
  mentorPersonal: one(mentorPersonal, {
    fields: [mentorEducation.mentorPersonalId],
    references: [mentorPersonal.id],
  }),
}));