"use client";

import { ShieldCheck, Award, Lock, Users } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";

export function TrustSection() {
    return (
        <section className="py-12 bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#0d9488_1px,transparent_1px)] [size:40px_40px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8"
                    >
                        Why We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">J&K's #1 Choice.</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                        {[
                            { label: "Trust", color: "teal", icon: ShieldCheck, delay: 0.1 },
                            { label: "Speed", color: "blue", icon: Users, delay: 0.2 },
                            { label: "Excellence", color: "emerald", icon: Award, delay: 0.3 }
                        ].map((pillar, i) => (
                            <motion.div
                                key={pillar.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: pillar.delay }}
                                viewport={{ once: true }}
                                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <pillar.icon className={`w-5 h-5 text-${pillar.color}-600 group-hover:scale-110 transition-transform`} />
                                <span className="text-slate-900 font-bold uppercase tracking-widest text-xs italic">{pillar.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        Built on a foundation of verified care, rapid availability, and local Srinagar-based clinical support.
                    </motion.p>
                </div>

                <BentoGrid className="max-w-6xl mx-auto">
                    <BentoGridItem
                        title="Manual Protocol Verification"
                        description="Every physician undergoes a 3-step manual check of MD/MS credentials and PMOD registration. No exceptions."
                        header={
                            <div className="flex flex-1 w-full h-full min-h-[20rem] rounded-2xl overflow-hidden relative group bg-slate-50">
                                <img
                                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
                                    alt="Verified Doctor"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-48 h-48">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 border border-teal-500/30 rounded-full border-dashed"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="absolute inset-4 border-2 border-teal-500/20 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.15)]"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <ShieldCheck className="w-12 h-12 text-teal-600 mb-2 drop-shadow-lg" />
                                            <div className="text-[10px] font-black tracking-[0.2em] text-teal-700 bg-white/80 px-2 py-0.5 rounded shadow-sm">AUTHENTICATED</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        className="md:col-span-2 rounded-[2.5rem] border-slate-100 hover:border-teal-200 shadow-2xl shadow-slate-200/50 transition-all duration-700"
                        icon={<ShieldCheck className="h-5 w-5 text-teal-600" />}
                    />

                    <BentoGridItem
                        title="24/7 Hyper-Local Support"
                        description="Our Srinagar HQ handles bookings, emergencies, and translations instantly."
                        header={
                            <div className="flex flex-1 w-full h-full min-h-[12rem] bg-indigo-50/50 rounded-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [size:10px_10px]" />
                                <div className="p-8 w-full h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-white rounded-2xl shadow-lg border border-indigo-50">
                                            <Users className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                                    <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="Agent" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">12 Agents Online Now</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                whileInView={{ width: "94%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        className="md:col-span-1 rounded-[2.5rem] border-slate-100 hover:border-indigo-200 shadow-2xl shadow-slate-200/50 transition-all duration-700"
                        icon={<Users className="h-5 w-5 text-indigo-600" />}
                    />

                    <BentoGridItem
                        title="Quantum-Secured Records"
                        description="AES-256 bank-grade encryption for every report and consultation history."
                        header={
                            <div className="flex flex-1 w-full h-full min-h-[12rem] bg-blue-50/50 rounded-2xl overflow-hidden relative group flex items-center justify-center p-8">
                                <motion.div
                                    animate={{
                                        boxShadow: ["0 0 0px #3b82f6", "0 0 20px #3b82f6", "0 0 0px #3b82f6"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="p-6 bg-white rounded-3xl shadow-xl border border-blue-100 relative"
                                >
                                    <Lock className="w-10 h-10 text-blue-600" />
                                    <motion.div
                                        animate={{ height: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute left-0 top-0 w-px bg-blue-500/20"
                                    />
                                    <motion.div
                                        animate={{ width: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        className="absolute right-0 bottom-0 h-px bg-blue-500/20"
                                    />
                                </motion.div>
                                <div className="absolute bottom-4 left-4 font-mono text-[8px] text-blue-900/40 uppercase tracking-[0.3em]">Encrypted-Link: Active</div>
                            </div>
                        }
                        className="md:col-span-1 rounded-[2.5rem] border-slate-100 hover:border-blue-200 shadow-2xl shadow-slate-200/50 transition-all duration-700"
                        icon={<Lock className="h-5 w-5 text-blue-600" />}
                    />

                    <BentoGridItem
                        title="The Gold Standard of Care"
                        description="Only doctors maintaining a 4.8/5.0 patient score across Srinagar and Jammu stay on our platform."
                        header={
                            <div className="flex flex-1 w-full h-full min-h-[20rem] rounded-2xl overflow-hidden relative group bg-emerald-50/30">
                                <img
                                    src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1000&auto=format&fit=crop"
                                    alt="Top Rated Doctors"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent flex flex-col justify-end p-10">
                                    <motion.div
                                        initial={{ rotateY: 90 }}
                                        whileInView={{ rotateY: 0 }}
                                        transition={{ duration: 0.8 }}
                                        viewport={{ once: true }}
                                        className="mb-6"
                                    >
                                        <div className="flex gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Award key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                                            ))}
                                        </div>
                                        <div className="text-white">
                                            <div className="text-xl font-black italic tracking-widest mb-1">CLINICAL ELITE</div>
                                            <div className="text-[10px] font-bold text-white/60 tracking-[0.4em] uppercase">Top 10% of Specialists</div>
                                        </div>
                                    </motion.div>
                                    <div className="flex gap-3">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/20 text-[10px] font-bold">4.9 AVG RATING</div>
                                        <div className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-lg text-emerald-100 border border-emerald-500/30 text-[10px] font-bold italic">COMMUNITY CHOICE</div>
                                    </div>
                                </div>
                            </div>
                        }
                        className="md:col-span-2 rounded-[2.5rem] border-slate-100 hover:border-emerald-200 shadow-2xl shadow-slate-200/50 transition-all duration-700"
                        icon={<Award className="h-5 w-5 text-emerald-600" />}
                    />
                </BentoGrid>
            </div>
        </section>
    );
}
