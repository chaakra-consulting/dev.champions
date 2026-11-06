
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function handleLogout() {
const { data: session, isPending, error } = authClient.useSession();
await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
            switch (session?.user.role) {
            case "admin":
                redirect("/admin/login");
            case "parent":
                redirect("/parent/login");
            case "student":
                redirect("/student/login");
            case "mentor":
                redirect("/mentor/login");
            }
        },
      },
    });
}
