"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { DISTRICTS, SPECIALIZATIONS } from "@/lib/mock-data";

interface FiltersProps {
    selectedDistricts: string[];
    setSelectedDistricts: (districts: string[]) => void;
    selectedSpecs: string[];
    setSelectedSpecs: (specs: string[]) => void;
    maxFee: number;
    setMaxFee: (fee: number) => void;
    onReset: () => void;
}

export function Filters({
    selectedDistricts,
    setSelectedDistricts,
    selectedSpecs,
    setSelectedSpecs,
    maxFee,
    setMaxFee,
    onReset
}: FiltersProps) {
    const toggleDistrict = (dist: string) => {
        if (selectedDistricts.includes(dist)) {
            setSelectedDistricts(selectedDistricts.filter(d => d !== dist));
        } else {
            setSelectedDistricts([...selectedDistricts, dist]);
        }
    };

    const toggleSpec = (spec: string) => {
        if (selectedSpecs.includes(spec)) {
            setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
        } else {
            setSelectedSpecs([...selectedSpecs, spec]);
        }
    };

    return (
        <div className="space-y-8 h-fit">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Filters</h3>
                {(selectedDistricts.length > 0 || selectedSpecs.length > 0 || maxFee < 2000) && (
                    <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors text-[10px] h-6"
                        onClick={onReset}
                    >
                        Reset All
                    </Badge>
                )}
            </div>

            {/* District Filter */}
            <div className="space-y-4">
                <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Districts</h4>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {DISTRICTS.map((d) => (
                        <div key={d} className="flex items-center space-x-2">
                            <Checkbox
                                id={`dist-${d}`}
                                checked={selectedDistricts.includes(d)}
                                onCheckedChange={() => toggleDistrict(d)}
                                className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                            />
                            <label htmlFor={`dist-${d}`} className="text-sm font-medium leading-none cursor-pointer">
                                {d}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-4">
                <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Specialties</h4>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {SPECIALIZATIONS.map((s) => (
                        <div key={s} className="flex items-center space-x-2">
                            <Checkbox
                                id={`spec-${s}`}
                                checked={selectedSpecs.includes(s)}
                                onCheckedChange={() => toggleSpec(s)}
                                className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                            />
                            <label htmlFor={`spec-${s}`} className="text-sm font-medium leading-none cursor-pointer">
                                {s}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Max Consultation Fee</h4>
                    <span className="text-sm font-bold text-teal-600">₹{maxFee}</span>
                </div>
                <Slider
                    value={[maxFee]}
                    onValueChange={(val) => setMaxFee(val[0])}
                    max={2000}
                    min={300}
                    step={100}
                    className="cursor-grab active:cursor-grabbing"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                    <span>₹300</span>
                    <span>₹2000+</span>
                </div>
            </div>
        </div>
    );
}
