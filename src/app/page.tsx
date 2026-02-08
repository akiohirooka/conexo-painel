import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function RootPage() {
    const user = await getCurrentUser();

    // Fallback when auth is missing
    if (!user) {
        redirect("/sign-in");
    }

    if (user.role === 'business') {
        redirect("/dashboard");
    } else {
        redirect("/home");
    }
}
