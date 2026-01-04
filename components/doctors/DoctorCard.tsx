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
            whileHover={{ y: -8 }}
            className="group relative flex flex-col p-6 rounded-[2rem] bg-white dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/20 backdrop-blur-sm"
        >
            {/* Availability Badge */}
            <div className="absolute top-5 right-5 z-10">
                {doctor.isAvailable ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200 backdrop-blur-md px-3 py-1 text-xs font-semibold tracking-wide">
                        <span className="w-2 h-2 mr-2 bg-emerald-500 rounded-full animate-pulse" />
                        AVAILABLE NOW
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="opacity-70 text-xs">
                        Next Slot: Tomorrow
                    </Badge>
                )}
            </div>

            {/* Profile Header */}
            <div className="flex gap-5 items-start mb-6">
                <div className="relative flex-shrink-0">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 group-hover:scale-105 transition-transform duration-500 bg-zinc-100">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Floating Rating Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 py-1 px-3 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-700 flex items-center gap-1.5 min-w-max">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{doctor.rating}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">({doctor.reviews})</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0 pt-1 space-y-2">
                    <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 truncate pr-4 group-hover:from-primary group-hover:to-cyan-500 transition-all">
                            {doctor.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            {doctor.rating > 4.8 && (
                                <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Verified Pro
                                </Badge>
                            )}
                            <Badge variant="secondary" className="h-5 text-[10px] font-normal bg-zinc-100 text-zinc-600">
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
            <div className="mt-auto flex items-center gap-3">
                <div className="flex flex-col flex-1 pl-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Consult Fee</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-bold text-xl text-zinc-900 dark:text-white">₹{doctor.fees}</span>
                        <span className="text-xs text-zinc-400 font-medium">/ visit</span>
                    </div>
                </div>

                <Link href={`/doctor/${doctor.id}`} className="flex-none">
                    <Button variant="outline" className="h-12 px-4 rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        View Profile
                    </Button>
                </Link>

                <Link href={`/doctor/${doctor.id}`} className="flex-1">
                    <Button className="w-full h-12 px-6 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white shadow-xl shadow-zinc-200 dark:shadow-none hover:shadow-primary/25 transition-all duration-300 font-bold group-hover:scale-105">
                        Book Now
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
});
