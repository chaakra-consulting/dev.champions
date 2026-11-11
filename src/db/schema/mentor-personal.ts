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
import { mentorAchievement } from './mentor-achievement';
import { mentorEducation } from './mentor-education';
import { mentorNonformalEducation } from './mentor-nonformal-education';

export const mentorPersonal = mysqlTable('mentor_personals', {
  id: int('id').primaryKey().autoincrement(),
  accountId: text('account_id').notNull(),
  profileImage: varchar('profile_image', { length: 70 }),
  nik: varchar('nik', { length: 32 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  nip: varchar('nip', { length: 18 }),
  pob: varchar('pob', { length: 70 }),
  dob: date('dob'),
  address: text('address'),
  ktpAddress: varchar('ktp_address', { length: 150 }),
  marriageStatus: mysqlEnum('marriage_status', ['married', 'single']).default('single'),
  religion: varchar('religion', { length: 10 }).notNull(),
  siblings: varchar('siblings', { length: 2 }),
  xOfSiblings: varchar('x_of_siblings', { length: 2 }),
  sex: mysqlEnum('sex', ['male', 'female']).notNull().default('male'),
  phone: varchar('phone', { length: 18 }),
  createdAt: datetime("created_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .notNull(),
          
  updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
          .$defaultFn(() => new Date())
          .$onUpdateFn(() => new Date())
          .notNull(),
});

export const mentorPersonalsRelation = relations(mentorPersonal, ({ many }) => ({
  achievements: many(mentorAchievement),
  educations: many(mentorEducation),
  nonformalEducations: many(mentorNonformalEducation),
}));