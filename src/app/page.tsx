import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function RootPage() {
    const user = await getCurrentUser();

    // Default fallback if something fails (though middleware ensures auth)
    if (!user) {
        redirect("/dashboard");
    }

    if (user.role === 'business') {
        redirect("/dashboard");
    } else {
        redirect("/home");
    }
}
