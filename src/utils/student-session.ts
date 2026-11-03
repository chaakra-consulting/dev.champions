
// import { cookies } from "next/headers";
// import { cache } from "react";
// import { db } from "@/db";
// import { eq, and, gt } from "drizzle-orm";
// import { studentSession } from "@/db/schema/student-session";
// import { studentAccount } from "@/db/schema/student-account";

// /**
//  * Check if the user is logged in
//  */
// export const validateStudentSession = cache(async () => {
//   const cookieStore = await cookies();
//   const sessionId = cookieStore.get("session_id")?.value;

//   if (!sessionId) {
//     return { session: null, user: null };
//   }

//   // Join the session and user tables so you have the user's data ready for your pages
//   const [result] = await db
//     .select({
//       session: studentSession,
//       user: studentAccount,
//     })
//     .from(studentSession)
//     .innerJoin(studentAccount, eq(studentSession.userId, studentAccount.id))
//     .where(
//       and(
//         eq(studentSession.id, sessionId),
//         gt(studentSession.expiresAt, new Date())
//       )
//     )
//     .limit(1);

//   if (!result) {
//     return { session: null, user: null };
//   }

//   return { session: result.session, user: result.user };
// });