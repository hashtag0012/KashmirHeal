"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Search, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: "01",
        title: "Search Locally",
        desc: "Filter by district (e.g., Anantnag, Baramulla) or specialization to find the nearest expert.",
        icon: Search,
        color: "bg-blue-500",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "02",
        title: "Check Availability",
        desc: "See real-time slot availability. No more waiting in long queues at the clinic.",
        icon: Calendar,
        color: "bg-teal-500",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: "03",
        title: "Instant Booking",
        desc: "Book your slot in seconds. Pay online or at the clinic. Receive instant WhatsApp confirmation.",
        icon: CheckCircle2,
        color: "bg-purple-500",
        image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1000&auto=format&fit=crop"
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
        <section id="how-it-works" ref={ref} className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-24">
                    <span className="text-teal-600 font-bold tracking-wider uppercase text-sm bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-6 text-slate-900">Healthcare Made Simple</h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Beam Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 rounded-full" />
                    <motion.div
                        style={{ scaleY, transformOrigin: "top" }}
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 via-blue-500 to-purple-500 -translate-x-1/2 rounded-full shadow-[0_0_20px_2px_rgba(45,212,191,0.5)]"
                    />

                    <div className="space-y-32">
                        {steps.map((step, idx) => (
                            <div key={idx} className={cn(
                                "relative flex flex-col md:flex-row gap-12 items-center pl-16 md:pl-0",
                                idx % 2 === 0 ? "md:flex-row-reverse" : ""
                            )}>
                                {/* Timeline Node */}
                                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-slate-300 z-10 shadow-sm">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        className={cn("w-full h-full rounded-full", step.color)}
                                    />
                                </div>

                                {/* Content Block */}
                                <div className={cn(
                                    "flex-1 text-left",
                                    idx % 2 === 0 ? "md:text-left" : "md:text-right"
                                )}>
                                    <div className={cn(
                                        "flex flex-col gap-4",
                                        idx % 2 === 0 ? "items-start" : "md:items-end"
                                    )}>
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                                            step.color
                                        )}>
                                            <step.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900">{step.title}</h3>
                                        <p className="text-lg text-slate-600 leading-relaxed max-w-sm">
                                            {step.desc}
                                        </p>
                                    </div>
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
