"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";
import { Activity } from "lucide-react";
import NotificationCenter from "@/components/layout/NotificationCenter";
import { useSession } from "next-auth/react";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
            <div className="container flex h-16 items-center mx-auto px-4">
                <Link href="/" className="mr-8 flex items-center group shrink-0">
                    <img
                        src="/images/kashmirheal.png"
                        alt="Kashmir Heal Logo"
                        className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                </Link>

                <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
                    {[
                        { name: "Find Doctors", href: "/search" },
                        { name: "How it Works", href: "/#how-it-works" },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative py-1 transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                            {pathname === item.href && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    ))}
                    {/* @ts-ignore */}
                    {session?.user?.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className={cn(
                                "relative py-1 transition-colors text-amber-600 hover:text-amber-700 font-bold",
                                pathname === "/admin" ? "text-amber-700" : ""
                            )}
                        >
                            Admin Panel
                            {pathname === "/admin" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600 rounded-full" />
                            )}
                        </Link>
                    )}
                    {/* @ts-ignore */}
                    {(session?.user?.role === "DOCTOR") && (
                        <Link
                            href="/doctor/dashboard"
                            className={cn(
                                "relative py-1 transition-colors text-teal-600 hover:text-teal-700 font-bold",
                                pathname === "/doctor/dashboard" ? "text-teal-700" : ""
                            )}
                        >
                            Doctor Panel
                            {pathname === "/doctor/dashboard" && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full" />
                            )}
                        </Link>
                    )}
                </nav>

                <div className="ml-auto flex items-center gap-2 md:gap-4">
                    <NotificationCenter />
                    <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
                    <LoginButton />
                </div>
            </div>
        </header>
    );
}
