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
        <div className="min-h-screen bg-slate-50/50">
            {/* Parallax Header */}
            <div className="relative h-[35vh] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2940&auto=format&fit=crop"
                        alt="Kashmir Valley"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/30 to-slate-50/50" />
                </div>

                <div className="relative z-10 text-center space-y-4 px-4 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-2"
                    >
                        Quality Care in J&K
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tight"
                    >
                        Find Your Specialist
                    </motion.h1>
                    <p className="text-white/80 text-sm font-medium">Connect with top-rated medical professionals across the valley</p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 -mt-12 relative z-20 pb-24">
                {/* Floating Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-teal-900/5 border-none p-3 flex flex-col md:flex-row gap-2 max-w-5xl mx-auto mb-12"
                >
                    <div className="relative flex-[0.8]">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                        <Input
                            placeholder="All Districts"
                            value={locationTerm}
                            onChange={(e) => setLocationTerm(e.target.value)}
                            className="pl-12 h-14 border-none shadow-none focus-visible:ring-0 bg-transparent text-base font-semibold"
                        />
                    </div>
                    <div className="w-[1px] bg-slate-100 hidden md:block" />
                    <div className="relative flex-[1.5]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                        <Input
                            placeholder="Doctor, specialty, or hospital..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 border-none shadow-none focus-visible:ring-0 bg-transparent text-base font-semibold"
                        />
                    </div>
                    <Button className="h-14 px-8 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-600/20">
                        Search Now
                    </Button>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-8 border-none shadow-sm sticky top-24">
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    {isLoading ? '...' : doctors.length} Doctors Available
                                </h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Showing experts matching your criteria</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By:</span>
                                <span className="text-xs font-black text-teal-600 cursor-pointer">Recommended</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <DoctorGrid doctors={doctors} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
