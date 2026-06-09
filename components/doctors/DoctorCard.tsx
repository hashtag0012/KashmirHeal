import Image from "next/image";

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
            className="group relative h-[440px] rounded-[36px] border border-slate-200/40 shadow-xl overflow-hidden flex flex-col justify-end p-5 transition-all duration-500 cursor-pointer"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
                {/* Overlay gradients to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/20 z-10" />
            </div>

            {/* Availability Badge */}
            <div className="absolute top-5 right-5 z-20">
                {doctor.isAvailable ? (
                    <Badge className="bg-emerald-500/80 text-white border border-emerald-400/30 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-xl">
                        <span className="w-2 h-2 mr-1.5 bg-white rounded-full animate-pulse inline-block" />
                        AVAILABLE
                    </Badge>
                ) : (
                    <Badge className="bg-slate-700/80 text-white border border-slate-600/30 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-xl">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-slate-300 rounded-full inline-block" />
                        BUSY
                    </Badge>
                )}
            </div>

            {/* Glassmorphic Info Card Overlay */}
            <div className="relative z-20 w-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-[28px] p-5 text-white flex flex-col gap-3 transition-all duration-500 group-hover:bg-white/15">
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold tracking-wider uppercase bg-teal-500/30 text-teal-200 px-2.5 py-1 rounded-lg border border-teal-400/20">
                            {doctor.specialization}
                        </span>
                        <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">{doctor.rating}</span>
                            <span className="text-[9px] text-slate-300">({doctor.reviews})</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold tracking-tight text-white mb-1">
                        {doctor.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-200">
                        <span className="flex items-center gap-1.5">
                            💼 {doctor.experience} exp
                        </span>
                        <span className="flex items-center gap-1.5">
                            📍 {doctor.district}
                        </span>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-[11px] text-slate-200 leading-relaxed italic line-clamp-2 border-l-2 border-teal-400/40 pl-2">
                    "{doctor.description}"
                </p>

                {/* Consultation Fee & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-300 uppercase tracking-wider font-bold">Consult Fee</span>
                        <span className="text-lg font-extrabold text-white">₹{doctor.fees}</span>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/doctor/${doctor.id}`}>
                            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl border border-white/20 text-white hover:bg-white/20 hover:text-white text-xs font-bold transition-all">
                                Profile
                            </Button>
                        </Link>
                        <Link href={`/doctor/${doctor.id}`}>
                            <Button size="sm" className="h-9 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
