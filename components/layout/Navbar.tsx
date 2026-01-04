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
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-lg">
            <div className="container flex h-20 items-center mx-auto px-4">
                <Link href="/" className="mr-8 flex items-center group shrink-0">
                    <div className="relative">
                        <img
                            src="/images/kashmirheal.png"
                            alt="Kashmir Heal Logo"
                            className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium">
                    {[
                        { 
                            name: "Browse Doctors", 
                            href: "/search",
                            icon: "🔍",
                            description: "Find specialists"
                        },
                        { 
                            name: "How It Works", 
                            href: "/#how-it-works",
                            icon: "📋",
                            description: "Simple process"
                        },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative group px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50",
                                pathname === item.href ? "bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700" : "text-slate-700 hover:text-teal-700"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{item.icon}</span>
                                <div className="flex flex-col">
                                    <span className="font-semibold">{item.name}</span>
                                    <span className="text-xs opacity-70">{item.description}</span>
                                </div>
                            </div>
                            {pathname === item.href && (
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
                            )}
                        </Link>
                    ))}
                    {/* @ts-ignore */}
                    {session?.user?.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className={cn(
                                "relative group px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50",
                                pathname === "/admin" ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700" : "text-amber-600 hover:text-amber-700"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">⚙️</span>
                                <div className="flex flex-col">
                                    <span className="font-bold">Admin Panel</span>
                                    <span className="text-xs opacity-70">Manage platform</span>
                                </div>
                            </div>
                            {pathname === "/admin" && (
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                            )}
                        </Link>
                    )}
                    {/* @ts-ignore */}
                    {(session?.user?.role === "DOCTOR") && (
                        <Link
                            href="/doctor/dashboard"
                            className={cn(
                                "relative group px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50",
                                pathname === "/doctor/dashboard" ? "bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700" : "text-teal-600 hover:text-teal-700"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">👨‍⚕️</span>
                                <div className="flex flex-col">
                                    <span className="font-bold">Doctor Panel</span>
                                    <span className="text-xs opacity-70">Manage practice</span>
                                </div>
                            </div>
                            {pathname === "/doctor/dashboard" && (
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
                            )}
                        </Link>
                    )}
                </nav>

                <div className="ml-auto flex items-center gap-3 md:gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-teal-50 to-blue-50 px-4 py-2 rounded-xl border border-teal-200/50">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-teal-700">24/7 Support</span>
                    </div>
                    <NotificationCenter />
                    <div className="h-6 w-[1px] bg-gradient-to-b from-slate-200 to-transparent mx-1 hidden sm:block" />
                    <LoginButton />
                </div>
            </div>
        </header>
    );
}
