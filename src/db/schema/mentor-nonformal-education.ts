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
export const mentorNonformalEducation = mysqlTable('mentor_nonformal_educations', {
  id: int('id').primaryKey().autoincrement(),
  mentorPersonalId: int('mentor_personal_id')
    .notNull()
    .references(() => mentorPersonal.id),
  institutionName: varchar('institution_name', { length: 100 }).notNull(),
  certNumber: varchar('cert_number', { length: 30 }),
  issuedUntil: varchar('issued_until', { length: 4 }),
  trainingDate: date('training_date'),
  trainingPurpose: varchar('training_purpose', { length: 50 }).notNull(),
  createdAt: datetime("created_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .notNull(),
          
  updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .$onUpdateFn(() => new Date())
          .notNull(),
});

export const mentorNonformalEducationsRelations = relations(mentorNonformalEducation, ({ one }) => ({
  mentorPersonal: one(mentorPersonal, {
    fields: [mentorNonformalEducation.mentorPersonalId],
    references: [mentorPersonal.id],
  }),
}));