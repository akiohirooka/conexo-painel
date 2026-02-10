import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { buildAccountDeletedDecisionPath } from "@/lib/auth/deleted-account";

export default async function RootPage() {
    const user = await getCurrentUser();

    // Fallback when auth is missing
    if (!user) {
        redirect("/sign-in");
    }

    if (user.role === 'deleted') {
        redirect(buildAccountDeletedDecisionPath({
            clerkUserId: user.clerkUserId,
            email: user.email,
        }))
    }

    if (user.role === 'business') {
        redirect("/dashboard");
    } else {
        redirect("/home");
    }
}
