"use client";

import { useState, useEffect } from "react";
import { Filters } from "@/components/doctors/Filters";
import { DoctorGrid } from "@/components/doctors/DoctorGrid";
import { motion } from "framer-motion";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDoctors } from "@/lib/actions";

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
    const [maxFee, setMaxFee] = useState(2000);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            try {
                const results = await getDoctors({
                    specializations: selectedSpecs,
                    districts: selectedDistricts,
                    searchTerm,
                    maxFee,
                    locationTerm
                });
                setDoctors(results);
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchDoctors, 300); // Simple debounce
        return () => clearTimeout(timer);
    }, [searchTerm, locationTerm, selectedDistricts, selectedSpecs, maxFee]);

    const resetFilters = () => {
        setSelectedDistricts([]);
        setSelectedSpecs([]);
        setMaxFee(2000);
        setSearchTerm("");
        setLocationTerm("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
            {/* Enhanced Parallax Header */}
            <div className="relative h-[50vh] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2940&auto=format&fit=crop"
                        alt="Kashmir Valley"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50/100 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 text-center space-y-6 px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-xl"
                    >
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            Quality Healthcare Across J&K
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight"
                    >
                        Find Your Perfect
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                            Medical Specialist
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/90 text-lg font-medium max-w-2xl mx-auto"
                    >
                        Connect with verified doctors across all districts of Kashmir. Instant bookings, real-time availability, and trusted healthcare at your fingertips.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 -mt-16 relative z-20 pb-24">
                {/* Enhanced Floating Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-teal-900/10 border border-white/50 p-4 flex flex-col md:flex-row gap-3 max-w-6xl mx-auto mb-16"
                >
                    <div className="relative flex-[0.8]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <Input
                            placeholder="All Districts"
                            value={locationTerm}
                            onChange={(e) => setLocationTerm(e.target.value)}
                            className="pl-12 h-16 border-none shadow-none focus-visible:ring-0 bg-transparent text-base font-semibold placeholder:text-slate-400"
                        />
                    </div>
                    <div className="w-[1px] bg-gradient-to-b from-slate-200 to-transparent hidden md:block" />
                    <div className="relative flex-[1.5]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Search className="w-3 h-3 text-white" />
                        </div>
                        <Input
                            placeholder="Doctor, specialty, or hospital..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-16 border-none shadow-none focus-visible:ring-0 bg-transparent text-base font-semibold placeholder:text-slate-400"
                        />
                    </div>
                    <Button className="h-16 px-10 rounded-2xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold shadow-xl shadow-teal-600/20 transition-all duration-300 hover:scale-105">
                        <Search className="w-5 h-5 mr-2" /> Search Now
                    </Button>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 sticky top-24">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">Filter Doctors</h3>
                                <p className="text-slate-600 text-sm mt-1">Find the perfect match</p>
                            </div>
                            <Filters
                                selectedDistricts={selectedDistricts}
                                setSelectedDistricts={setSelectedDistricts}
                                selectedSpecs={selectedSpecs}
                                setSelectedSpecs={setSelectedSpecs}
                                maxFee={maxFee}
                                setMaxFee={setMaxFee}
                                onReset={resetFilters}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 border-slate-200 bg-white shadow-sm"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                            Filters {(selectedDistricts.length + selectedSpecs.length > 0) && `(${selectedDistricts.length + selectedSpecs.length})`}
                        </Button>

                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 bg-white rounded-3xl p-6 border shadow-sm lg:hidden"
                            >
                                <Filters
                                    selectedDistricts={selectedDistricts}
                                    setSelectedDistricts={setSelectedDistricts}
                                    selectedSpecs={selectedSpecs}
                                    setSelectedSpecs={setSelectedSpecs}
                                    maxFee={maxFee}
                                    setMaxFee={setMaxFee}
                                    onReset={resetFilters}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Main Results */}
                    <section className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                                    {isLoading ? '...' : doctors.length} Doctors Available
                                </h2>
                                <p className="text-slate-600 text-sm font-medium mt-2">Expert healthcare professionals matching your criteria</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-slate-200/50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By:</span>
                                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 cursor-pointer hover:from-teal-700 hover:to-blue-700 transition-all">Recommended</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <DoctorGrid doctors={doctors} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
