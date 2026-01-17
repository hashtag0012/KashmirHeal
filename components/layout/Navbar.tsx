"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";
import { Activity, Menu, X, ChevronRight } from "lucide-react";
import NotificationCenter from "@/components/layout/NotificationCenter";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const navLinks = [
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
    ];

    const isAdmin = (session?.user as any)?.role === "ADMIN";
    const isDoctor = (session?.user as any)?.role === "DOCTOR";

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-black/5 bg-white/80 backdrop-blur-2xl shadow-sm">
            <div className="container flex h-20 items-center mx-auto px-4 md:px-6">
                <Link href="/" className="mr-8 flex items-center group shrink-0">
                    <div className="relative">
                        <img
                            src="/images/kashmirheal.png"
                            alt="Kashmir Heal Logo"
                            className="h-12 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative group px-4 py-2 rounded-xl transition-all duration-300 hover:bg-slate-50",
                                pathname === item.href ? "text-teal-700 bg-teal-50/50" : "text-slate-600 hover:text-teal-600 font-semibold"
                            )}
                        >
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    ))}

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={cn(
                                "px-4 py-2 rounded-xl transition-all font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50",
                                pathname === "/admin" && "bg-amber-50"
                            )}
                        >
                            Admin Panel
                        </Link>
                    )}

                    {isDoctor && (
                        <Link
                            href="/doctor/dashboard"
                            className={cn(
                                "px-4 py-2 rounded-xl transition-all font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50",
                                pathname === "/doctor/dashboard" && "bg-teal-50"
                            )}
                        >
                            Doctor Panel
                        </Link>
                    )}
                </nav>

                <div className="ml-auto flex items-center gap-2 md:gap-4">
                    <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/50">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Support</span>
                    </div>

                    <NotificationCenter />
                    <div className="hidden sm:block">
                        <LoginButton />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-2xl lg:hidden z-50 overflow-hidden"
                    >
                        <div className="p-4 space-y-2">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{item.name}</span>
                                            <span className="text-xs text-slate-500">{item.description}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </Link>
                            ))}

                            <div className="h-px bg-slate-100 my-4" />

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 text-amber-900"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">⚙️</span>
                                        <span className="font-bold">Admin Control Center</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            )}

                            {isDoctor && (
                                <Link
                                    href="/doctor/dashboard"
                                    className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 text-teal-900"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">👨‍⚕️</span>
                                        <span className="font-bold">Doctor Dashboard</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            )}

                            <div className="pt-4 sm:hidden">
                                <LoginButton />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
