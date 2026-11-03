import { db } from "@/db";
import * as schema from "@/db/schema/user";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: schema,
        // usePlural: true,
    }),
    plugins: [nextCookies(), customSession(async ({ user, session }) => {
        const { token, ...safeSession } = session;

        return {
            user,
            session: safeSession
        };
    }),],
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
                type: "string", // or ["student", "teacher", "admin"]
                required: false,
                defaultValue: "student",
            },
        },
    },
});
