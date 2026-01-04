"use client";

import { useState, useEffect } from "react";
import {
    Bell,
    Calendar,
    MapPin,
    Clock,
    ExternalLink,
    Check,
    AlertCircle,
    User,
    Phone
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                } else if (res.status === 401) {
                    // User not authenticated, don't show error
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
                setNotifications([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
        // Poll every 30 seconds for live feel
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = async () => {
        try {
            await fetch("/api/notifications", { method: "PUT" });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-colors">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center">
                                {unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden mt-2">
                <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Notifications</h3>
                        <div className="flex gap-2">
                            <span className="text-white/50 text-[10px] cursor-pointer hover:text-white" onClick={markAllRead}>Mark all read</span>
                            <Badge variant="outline" className="text-white border-white/20 bg-white/10 uppercase tracking-widest text-[9px] px-2 py-0.5">
                                {unreadCount} New
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="max-h-[420px] overflow-y-auto bg-white">
                    <AnimatePresence>
                        {notifications.length > 0 ? (
                            notifications.map((notif, i) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-4 border-b border-slate-50 relative ${!notif.read ? 'bg-teal-50/30' : ''}`}
                                >
                                    {!notif.read && (
                                        <div className="absolute top-5 right-4 w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                                    )}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center text-teal-600">
                                            {notif.type === 'info' ? <Bell className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-bold text-slate-900 leading-none">{notif.title}</h4>
                                            <p className="text-xs text-slate-600 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-12 px-8 text-center space-y-3">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <Bell className="w-8 h-8 text-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-900 font-bold">No new notifications</p>
                                    <p className="text-slate-400 text-xs">We'll alert you when there's an update.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-center">
                    <button className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-2 transition-colors">
                        View all activity
                        <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
