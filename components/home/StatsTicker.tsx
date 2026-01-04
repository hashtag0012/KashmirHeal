"use client";

import { motion } from "framer-motion";
import { Users, Stethoscope, CalendarCheck, IndianRupee } from "lucide-react";

export function StatsTicker() {
    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-xl"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">1,247</div>
                        <div className="text-sm text-slate-500 font-medium">Verified Doctors</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">28k+</div>
                        <div className="text-sm text-slate-500 font-medium">Happy Patients</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">1.2L+</div>
                        <div className="text-sm text-slate-500 font-medium">Appointments</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">4.2Cr</div>
                        <div className="text-sm text-slate-500 font-medium">Patient Savings</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
