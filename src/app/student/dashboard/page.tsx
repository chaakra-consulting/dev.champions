'use client';
import { authClient } from "@/lib/auth-client";

export default function StudentDashboard() {
    const { data: session, isPending, error } = authClient.useSession();
    if (isPending) return <div>Loading session...</div>;
    if (error) return <div>Error loading session: {error.message}</div>;
    if (!session) return <div>Please sign in.</div>;

    return (
        <div>
            <p>Logged in as: {session.user.email}</p>
        </div>
    );
}