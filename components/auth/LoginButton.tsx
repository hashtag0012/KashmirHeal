"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden md:block">{session.user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
            className="gap-2 bg-white text-black hover:bg-white/90"
        >
            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Login with Google
        </Button>
    );
}
