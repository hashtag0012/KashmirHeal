"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExperienceSection() {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="flex-1 space-y-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-teal-600 font-bold tracking-wider uppercase text-sm bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                                Patient Experience
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mt-8 mb-6 leading-tight text-slate-900">
                                Healthcare Designed <br />
                                Around <span className="text-teal-600 underline decoration-teal-200 underline-offset-4">You</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                From instant bookings to digital prescriptions, we've digitized the entire journey.
                                No more early morning queues at the clinic. Just arrive at your slot time.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-center min-w-[160px]">
                                <h4 className="font-bold text-3xl text-teal-600 mb-1">98%</h4>
                                <p className="text-sm text-slate-500 font-medium">Satisfaction Rate</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-center min-w-[160px]">
                                <h4 className="font-bold text-3xl text-purple-600 mb-1">15m</h4>
                                <p className="text-sm text-slate-500 font-medium">Avg. Wait Time</p>
                            </div>
                        </motion.div>

                        <Button variant="link" className="text-teal-700 font-semibold p-0 h-auto gap-2 hover:gap-3 transition-all text-lg">
                            Learn more about our process <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Video/Image Content */}
                    <div className="flex-1 relative w-full">
                        {/* Decorative Blobs */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white z-10"
                        >
                            {/* Placeholder for Video/High-Quality Image */}
                            <div className="relative aspect-[4/3] group cursor-pointer bg-slate-200">
                                <img
                                    src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2787&auto=format&fit=crop"
                                    alt="Doctor Patient Interaction"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-24 h-24 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/50">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                            <Play className="w-6 h-6 text-teal-600 fill-teal-600 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Image Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: 50 }}
                            whileInView={{ opacity: 1, y: 0, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="absolute -bottom-10 -left-10 w-56 h-72 rounded-2xl border-4 border-white shadow-xl overflow-hidden hidden md:block z-20"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2000&auto=format&fit=crop"
                                alt="Modern Clinic"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
