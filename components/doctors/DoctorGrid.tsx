"use client";

import { Doctor } from "@/lib/mock-data";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { motion } from "framer-motion";

interface DoctorGridProps {
    doctors: Doctor[];
}

export function DoctorGrid({ doctors }: DoctorGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}

            {/* Show fewer items to keep it clean if no pagination yet */}
            {doctors.length === 0 && (
                <div className="col-span-full text-center py-20">
                    <h3 className="text-xl font-medium text-muted-foreground">No doctors found matching your criteria.</h3>
                </div>
            )}
        </div>
    );
}
