"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Mock user role - in a real app this would come from your auth provider (e.g. Clerk)
const MOCK_USER_ROLE = "admin"; // Change to 'user' to test access denied

interface AdminGuardProps {
    children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        // Simulate checking auth/permissions
        const checkAuth = async () => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (MOCK_USER_ROLE === "admin") {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                // Optional: Redirect to home or login
                // router.push("/"); 
            }
        };

        checkAuth();
    }, [router]);

    if (isAuthorized === null) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Acesso Negado</h1>
                <p className="text-muted-foreground">
                    Você não tem permissão para acessar esta área.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="text-primary hover:underline"
                >
                    Voltar para o início
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
