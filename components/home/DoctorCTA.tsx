"use client";

import { motion } from "framer-motion";
import { Stethoscope, ArrowRight, ShieldCheck, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function DoctorCTA() {
    const router = useRouter();
    const { data: session } = useSession();

    // If active doctor, don't show or show "Dashboard"
    const isDoctor = (session?.user as any)?.role === "DOCTOR";

    if (isDoctor) return null;

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Background Aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-50 border border-slate-100 rounded-[60px] p-12 md:p-20 relative overflow-hidden shadow-xl"
                    >
                        {/* Decorative floating elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 w-24 h-24 bg-blue-500/5 rounded-3xl blur-xl"
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-widest uppercase">
                                    <Stethoscope className="w-4 h-4" /> Medical Professionals
                                </div>

                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1]">
                                    Are you a <span className="text-blue-600">Doctor</span>?
                                </h2>

                                <p className="text-slate-500 text-xl leading-relaxed">
                                    Join Kashmir's largest verified healthcare network. Reach more patients, manage your practice digitally, and provide care where it's needed most.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button
                                        onClick={() => router.push("/onboarding?role=DOCTOR")}
                                        className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-black shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Become a Doctor <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="h-16 px-10 rounded-2xl border-slate-200 bg-white text-slate-600 text-lg font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FeatureCard
                                    icon={ShieldCheck}
                                    title="Verified Status"
                                    desc="Official badge for verified medical licenses."
                                />
                                <FeatureCard
                                    icon={Zap}
                                    title="Instant Booking"
                                    desc="Let patients book appointments in seconds."
                                />
                                <FeatureCard
                                    icon={Award}
                                    title="Expert Profile"
                                    desc="Showcase your expertise and reputation."
                                />
                                <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="text-4xl font-black text-slate-900 mb-2">10k+</div>
                                    <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Active Patients</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-[40px] bg-white border border-slate-100 hover:border-blue-100 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 font-bold mb-2">{title}</h4>
            <p className="text-slate-500 text-sm leading-snug">{desc}</p>
        </div>
    );
}
