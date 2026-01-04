"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Search, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: "01",
        title: "Search & Discover",
        desc: "Browse verified doctors by district, specialty, or availability. Filter by fees, experience, and ratings to find your perfect match.",
        icon: Search,
        color: "from-blue-500 to-cyan-500",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
        features: ["Real-time availability", "Verified credentials", "Advanced filters"]
    },
    {
        id: "02",
        title: "Book Instantly",
        desc: "Select your preferred time slot and book in seconds. No more waiting in queues - get instant confirmation with WhatsApp updates.",
        icon: Calendar,
        color: "from-teal-500 to-emerald-500",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop",
        features: ["Instant booking", "WhatsApp confirmation", "Secure payment"]
    },
    {
        id: "03",
        title: "Consult & Care",
        desc: "Attend your appointment at the clinic or via teleconsultation. Rate your experience and help others find quality healthcare.",
        icon: CheckCircle2,
        color: "from-purple-500 to-pink-500",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1000&auto=format&fit=crop",
        features: ["In-person & online", "Post-consultation care", "Review system"]
    },
];

export function HowItWorks() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <section id="how-it-works" ref={ref} className="py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-md border border-teal-200/50 text-teal-700 text-xs font-bold uppercase tracking-widest shadow-lg"
                    >
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                            Simple 3-Step Process
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold mt-6 bg-gradient-to-r from-slate-900 via-blue-800 to-teal-600 bg-clip-text text-transparent"
                    >
                        Healthcare Made Simple
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto"
                    >
                        From finding the right doctor to booking your appointment - everything you need in just a few clicks
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Beam Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-2 bg-slate-200/50 -translate-x-1/2 rounded-full" />
                    <motion.div
                        style={{ scaleY, transformOrigin: "top" }}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 -translate-x-1/2 rounded-full shadow-[0_0_30px_4px_rgba(45,212,191,0.4)]"
                    />

                    <div className="space-y-32">
                        {steps.map((step, idx) => (
                            <div key={idx} className={cn(
                                "relative flex flex-col md:flex-row gap-12 items-center pl-16 md:pl-0",
                                idx % 2 === 0 ? "md:flex-row-reverse" : ""
                            )}>
                                {/* Timeline Node */}
                                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-slate-200/50 z-10 shadow-xl">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className={cn("w-full h-full rounded-full bg-gradient-to-br", step.color)}
                                    />
                                </div>

                                {/* Content Block */}
                                <div className={cn(
                                    "flex-1 text-left",
                                    idx % 2 === 0 ? "md:text-left" : "md:text-right"
                                )}>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className={cn(
                                            "flex flex-col gap-6",
                                            idx % 2 === 0 ? "items-start" : "md:items-end"
                                        )}>
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl bg-gradient-to-br",
                                            step.color
                                        )}>
                                            <step.icon className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">{step.title}</h3>
                                            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                                                {step.desc}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {step.features.map((feature, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-200/50">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Image Block */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex-1 w-full"
                                >
                                    <div className={cn(
                                        "relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white",
                                        idx % 2 === 0 ? "rotate-2" : "-rotate-2"
                                    )}>
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        {/* Overlay id number */}
                                        <div className="absolute top-4 right-4 text-6xl font-black text-white/20">
                                            {step.id}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
