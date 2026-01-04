"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { motion } from "framer-motion";

const testimonials = [
    {
        quote: "Finding a specialized cardiologist in Srinagar used to be a matter of luck. KashmirHeal showed Dr. Shah's real-time availability. I booked at 4 PM and was in his clinic by 6 PM. Truly life-saving efficiency.",
        name: "Aamina Yusuf",
        title: "Verified Appointment • Srinagar",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop",
        category: "Cardiology"
    },
    {
        quote: "Traveling 40km from Jammu just to find a closed clinic was my biggest nightmare. The live status on this platform is a game changer for rural patients. Fast, reliable, and very professional.",
        name: "Rahul Pandita",
        title: "Verified Appointment • Jammu",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop",
        category: "Orthopedics"
    },
    {
        quote: "Managing my father's surgery consultation was stress-free. The interface is intuitive even for non-tech people. I appreciate the SMS updates which work perfectly even when the mobile data is slow.",
        name: "Zahoor Ahmed",
        title: "Verified Appointment • Baramulla",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop",
        category: "Surgery"
    },
    {
        quote: "The transparency is what I love most. You can see the doctor's verified credentials and actual patient ratings. It's the first time I've felt fully confident booking a specialist online in the Valley.",
        name: "Saniya Mir",
        title: "Verified Appointment • Anantnag",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
        category: "Pediatrics"
    },
];

export function Testimonials() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Soft Clinical Mesh Gradients */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        Verified Patient Experiences
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
                    >
                        Real Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Care and Recovery.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                    >
                        Join thousands of families in J&K who have found the right specialists through KashmirHeal.
                    </motion.p>
                </div>
            </div>

            <div className="relative flex flex-col items-center justify-center overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                    className="py-10"
                />

                {/* Subtle scanning line effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(13,148,136,0.1)_1px,transparent_1px)] bg-[size:100%_40px] animate-[scan_20s_linear_infinite]" />
            </div>

            <style jsx global>{`
                @keyframes scan {
                    from { background-position: 0 0; }
                    to { background-position: 0 1000px; }
                }
            `}</style>
        </section>
    );
}
