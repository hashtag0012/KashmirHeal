"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Stethoscope, Upload, Check, Loader2, ArrowRight, ShieldCheck, Phone, MapPin, Award, IndianRupee, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Suspense } from "react";

function OnboardingContent() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [step, setStep] = useState(1); // 1: Role, 2: Details, 3: Success
    const [role, setRole] = useState<"PATIENT" | "DOCTOR" | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // Initial check for role from query params
    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'DOCTOR') {
            setRole('DOCTOR');
            setStep(2);
        }
    }, [searchParams]);

    // Form States
    const [phone, setPhone] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [district, setDistrict] = useState("");
    const [license, setLicense] = useState("");
    const [fees, setFees] = useState("500");
    const [experience, setExperience] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Pre-fill existing data
    useEffect(() => {
        if ((session?.user as any)?.phone) {
            setPhone((session?.user as any).phone);
        }
    }, [session]);

    const handleRoleSelect = (selectedRole: "PATIENT" | "DOCTOR") => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!phone) throw new Error("Phone number is required");
            if (role === "DOCTOR") {
                if (!license || !specialization || !district || !experience) throw new Error("Please fill all doctor details");
                if (!file) throw new Error("Verification document is required");
            }

            // Real File Upload
            let verificationUrl = null;
            if (role === "DOCTOR" && file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });
                if (!uploadRes.ok) throw new Error("File upload failed");
                const uploadData = await uploadRes.json();
                verificationUrl = uploadData.url;
            }

            const res = await fetch("/api/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    phone,
                    specialization,
                    district,
                    license,
                    fees: parseFloat(fees),
                    experience,
                    description,
                    verificationUrl
                }),
            });

            if (!res.ok) throw new Error("Failed to submit onboarding");

            await update({
                isOnboarded: true,
                phone: phone,
                role: role === "DOCTOR" ? "PATIENT" : "PATIENT"
            });

            // Transition to Success Step
            setStep(3);

        } catch (error: any) {
            toast({
                title: "Setup Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Countdown and Redirect
    useEffect(() => {
        if (step === 3) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        router.push("/");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, router]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-3xl w-full relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <motion.div
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-sm font-bold tracking-wider uppercase mb-4"
                                >
                                    Welcome to KashmirHeal
                                </motion.div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight">I want to use the platform as...</h1>
                                <p className="text-slate-500 text-lg max-w-lg mx-auto">Choose your role to get specialized care or manage your medical practice.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <RoleCard
                                    icon={User}
                                    title="A Patient"
                                    desc="Find top-rated specialists, book appointments, and manage your health history."
                                    color="teal"
                                    onClick={() => handleRoleSelect("PATIENT")}
                                />
                                <RoleCard
                                    icon={Stethoscope}
                                    title="A Doctor"
                                    desc="List your practice, manage your schedule, and provide quality care to patients."
                                    color="blue"
                                    onClick={() => handleRoleSelect("DOCTOR")}
                                />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-slate-50 border border-slate-200 rounded-[40px] p-10 md:p-14 shadow-xl relative overflow-hidden"
                        >
                            {/* Accent line */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${role === 'DOCTOR' ? 'from-blue-500 to-teal-400' : 'from-teal-500 to-teal-300'}`} />

                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                        {role === "DOCTOR" ? "Complete Your Doctor Profile" : "Personalize Your Care"}
                                    </h2>
                                    <p className="text-slate-500">Please provide your details to ensure the best experience.</p>
                                </div>
                                <Button variant="ghost" className="text-slate-400 hover:bg-slate-100" onClick={() => setStep(1)}>
                                    Change Role
                                </Button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-slate-600 flex items-center gap-2 font-semibold"><Phone className="w-4 h-4" /> Phone Number</Label>
                                    <Input
                                        className="bg-white border-slate-200 text-slate-900 h-14 rounded-2xl focus:ring-teal-500/20"
                                        placeholder="+91 00000 00000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                {role === "DOCTOR" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-slate-600 flex items-center gap-2 font-semibold"><Award className="w-4 h-4" /> Specialization</Label>
                                                <Select value={specialization} onValueChange={setSpecialization}>
                                                    <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-14 rounded-2xl">
                                                        <SelectValue placeholder="What is your field?" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                        {["Cardiology", "Dermatology", "Neurology", "General Physician", "Dentist", "Orthopedics"].map(s => (
                                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-slate-600 flex items-center gap-2 font-semibold"><MapPin className="w-4 h-4" /> Practice Location</Label>
                                                <Select value={district} onValueChange={setDistrict}>
                                                    <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-14 rounded-2xl">
                                                        <SelectValue placeholder="City / District" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                        {["Srinagar", "Baramulla", "Anantnag", "Budgam", "Pulwama", "Kupwara"].map(d => (
                                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label className="text-slate-600 flex items-center gap-2 font-semibold"><Award className="w-4 h-4" /> Total Experience</Label>
                                                <Input className="bg-white border-slate-200 text-slate-900 h-14 rounded-2xl" placeholder="e.g. 8 Years" value={experience} onChange={e => setExperience(e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-slate-600 flex items-center gap-2 font-semibold"><IndianRupee className="w-4 h-4" /> Consultation Fee (₹)</Label>
                                                <Input type="number" className="bg-white border-slate-200 text-slate-900 h-14 rounded-2xl" value={fees} onChange={e => setFees(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-slate-600 flex items-center gap-2 font-semibold"><FileText className="w-4 h-4" /> Medical License Number</Label>
                                            <Input className="bg-white border-slate-200 text-slate-900 h-14 rounded-2xl" placeholder="Official Registration No." value={license} onChange={e => setLicense(e.target.value)} />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-slate-600 flex items-center gap-2 font-semibold">Professional Bio</Label>
                                            <Textarea
                                                className="bg-white border-slate-200 text-slate-900 min-h-[120px] rounded-2xl p-4 focus:ring-teal-500/20"
                                                placeholder="Tell patients about your expertise and care philosophy..."
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                        </div>

                                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white space-y-4 text-center group cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all" onClick={() => document.getElementById('doc-upload')?.click()}>
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="text-slate-900 font-bold text-lg">{file ? file.name : "Upload Verification Document"}</div>
                                                <div className="text-sm text-slate-500">Medical Council Registration or ID Card (JPEG/PNG/PDF)</div>
                                            </div>
                                            <Input
                                                type="file"
                                                className="hidden"
                                                id="doc-upload"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <Button
                                    className={`w-full h-16 rounded-2xl text-lg font-bold shadow-lg transition-all ${role === 'DOCTOR' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'} text-white`}
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Processing...</>
                                    ) : (
                                        <>{role === 'DOCTOR' ? 'Submit Application' : 'Complete Setup'} <ArrowRight className="w-5 h-5 ml-2" /></>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-slate-200 rounded-[50px] p-20 text-center space-y-8 shadow-2xl"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20"
                            >
                                <Check className="w-16 h-16 text-white stroke-[3px]" />
                            </motion.div>

                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-slate-900">Setup Complete!</h2>
                                <p className="text-slate-500 text-xl max-w-sm mx-auto font-medium">
                                    {role === 'DOCTOR'
                                        ? "Verification Successful! Redirecting you to home while our admins finalize your panel."
                                        : "Great! You're all set to find the best care. Redirecting now..."
                                    }
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-teal-600 font-mono text-2xl font-bold">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Redirecting in {countdown}s
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function RoleCard({ icon: Icon, title, desc, color, onClick }: any) {
    const isTeal = color === 'teal';
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`cursor-pointer p-10 rounded-[35px] border border-slate-100 bg-slate-50/50 transition-all hover:border-${color}-500/50 hover:bg-white hover:shadow-2xl group relative overflow-hidden`}
        >
            <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500 opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className={`w-20 h-20 rounded-3xl mb-8 flex items-center justify-center group-hover:scale-110 transition-transform ${isTeal ? 'bg-teal-50 text-teal-600 border border-teal-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                <Icon className="w-10 h-10" />
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                {title}
                <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 transition-all ${isTeal ? 'text-teal-600' : 'text-blue-600'}`} />
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed">{desc}</p>

            <div className={`absolute bottom-[-20px] right-[-20px] w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity ${isTeal ? 'bg-teal-500' : 'bg-blue-500'}`} />
        </motion.div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <OnboardingContent />
        </Suspense>
    );
}
