import { db } from "@/db";
import * as schema from "@/db/schema/user";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, customSession } from "better-auth/plugins";
import { ac, roles } from "./permission";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema,
    // usePlural: true,
  }),
  plugins: [
    admin({
      ac: ac,
      roles: roles,
      defaultRole: "student",
      adminRoles: ["admin"],
    }),
    nextCookies(),
    customSession(async ({ user, session }) => {
      const { token, ...safeSession } = session;

      return {
        user,
        session: safeSession,
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      validateSchema: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
      },
    },
  },
});
