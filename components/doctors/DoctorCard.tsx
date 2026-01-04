"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Stethoscope, Video, Calendar, ArrowRight, ShieldCheck, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doctor } from "@/lib/mock-data";
import Link from "next/link";

interface DoctorCardProps {
    doctor: Doctor;
    index: number;
}

export const DoctorCard = memo(function DoctorCard({ doctor, index }: DoctorCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group relative flex flex-col p-8 rounded-3xl bg-gradient-to-br from-white via-white to-blue-50/30 dark:from-zinc-900/80 dark:via-zinc-900/80 dark:to-zinc-800/50 border border-blue-100/50 dark:border-zinc-700/50 transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/20 hover:border-blue-300/50 backdrop-blur-sm overflow-hidden"
        >
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-teal-400/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />
            {/* Availability Badge */}
            <div className="absolute top-6 right-6 z-10">
                {doctor.isAvailable ? (
                    <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-400 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-300/50 backdrop-blur-md px-4 py-2 text-xs font-bold tracking-wide shadow-lg shadow-emerald-200/50">
                        <span className="w-2.5 h-2.5 mr-2 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                        AVAILABLE NOW
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-amber-100/80 text-amber-700 border-amber-200/50 px-4 py-2 text-xs font-bold shadow-md">
                        <span className="w-2 h-2 mr-2 bg-amber-400 rounded-full" />
                        BUSY
                    </Badge>
                )}
            </div>

            {/* Profile Header */}
            <div className="flex gap-6 items-start mb-8 relative z-10">
                <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 dark:border-zinc-800/80 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-blue-100 to-teal-100">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>

                    {/* Floating Rating Badge */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 py-2 px-4 rounded-2xl shadow-2xl border border-blue-200/50 dark:border-zinc-700/50 flex items-center gap-2 min-w-max backdrop-blur-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{doctor.rating}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">({doctor.reviews})</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0 pt-4 space-y-3">
                    <div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-blue-800 to-teal-600 dark:from-white dark:to-teal-400 truncate pr-4 group-hover:from-blue-600 group-hover:to-teal-500 transition-all duration-300">
                            {doctor.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            {doctor.rating > 4.8 && (
                                <Badge variant="outline" className="h-6 px-3 text-[10px] bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-700/50 gap-1.5 shadow-sm">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro
                                </Badge>
                            )}
                            <Badge variant="secondary" className="h-6 px-3 text-[10px] font-bold bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-600/50">
                                {doctor.experience} exp
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <Stethoscope className="w-4 h-4 mr-2 text-primary" />
                            {doctor.specialization}
                        </div>
                        <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                            <MapPin className="w-4 h-4 mr-2 text-zinc-400" />
                            {doctor.district}
                        </div>
                    </div>
                </div>
            </div>

            {/* Description / Bio */}
            <div className="mb-6 relative">
                <div className="absolute top-0 left-0 -translate-x-2 -translate-y-2 opacity-10">
                    <Quote className="w-6 h-6 rotate-180" />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic pl-2 border-l-2 border-primary/20 line-clamp-2">
                    "{doctor.description}"
                </p>
            </div>

            {/* Quick Slots */}
            <div className="mb-6 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Available Today</span>
                    <span className="text-[10px] text-primary cursor-pointer hover:underline">View all</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {["10:00 AM", "2:30 PM", "4:15 PM", "5:30 PM"].map(time => (
                        <button key={time} className="flex-none px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm border border-zinc-100 dark:border-zinc-700 hover:border-primary hover:text-primary hover:shadow-md transition-all">
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            {/* Interactive Actions */}
            <div className="mt-auto flex items-center gap-4 relative z-10">
                <div className="flex flex-col flex-1 pl-2">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Consult Fee</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-bold text-2xl bg-gradient-to-r from-zinc-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">₹{doctor.fees}</span>
                        <span className="text-xs text-zinc-400 font-medium">/ visit</span>
                    </div>
                </div>

                <Link href={`/doctor/${doctor.id}`} className="flex-none">
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 hover:border-blue-300/50 hover:text-blue-600 transition-all duration-300">
                        View Profile
                    </Button>
                </Link>

                <Link href={`/doctor/${doctor.id}`} className="flex-1">
                    <Button className="w-full h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all duration-300 group-hover:scale-105">
                        Book Now
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
});
