"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Stethoscope, Clock, Calendar as CalendarIcon, CheckCircle, Video, Shield, Award, Languages } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { getDoctorById, getDoctorReviews, submitReview } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function DoctorProfile() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params["id"] as string;
    const { data: session } = useSession();
    const [doctor, setDoctor] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const [doctorData, reviewsData] = await Promise.all([
                    getDoctorById(id),
                    getDoctorReviews(id)
                ]);
                setDoctor(doctorData);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching doctor:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleReviewSubmit = async () => {
        if (!session?.user?.email) {
            toast({ title: "Please login to review", variant: "destructive" });
            return;
        }
        if (!newReview.comment) {
            toast({ title: "Please add a comment", variant: "destructive" });
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await submitReview(id, session.user.email, newReview.rating, newReview.comment);
            if (res.success) {
                toast({ title: "Review submitted!" });
                setNewReview({ rating: 5, comment: "" });
                // Refresh reviews
                const updatedReviews = await getDoctorReviews(id);
                setReviews(updatedReviews);
            } else {
                toast({ title: "Failed to submit review", description: (res as any).error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error submitting review", variant: "destructive" });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!date || !time) {
            toast({ title: "Please select date and time", variant: "destructive" });
            return;
        }

        setIsBooking(true);
        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: doctor.id,
                    date,
                    time,
                    // Typically you'd ask for reason in a modal, standardizing here
                    reason: "Initial Consultation"
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast({ title: "Please login to book", variant: "destructive" });
                    router.push("/auth/signin");
                    return;
                }
                throw new Error(data.error || "Booking failed");
            }

            toast({
                title: "Appointment Confirmed!",
                description: `Booked with ${doctor.name} for ${date?.toLocaleDateString()} at ${time}.`,
            });

            // Allow time for toast
            setTimeout(() => router.push("/"), 2000);

        } catch (error) {
            toast({ title: "Booking Failed", description: "Please try again later.", variant: "destructive" });
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading specialist profile...</div>;
    if (!doctor) return <div className="min-h-screen flex items-center justify-center text-rose-500 font-bold">Specialist profile not found or ID invalid.</div>;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
            {/* Premium Hero Header */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2936&auto=format&fit=crop"
                        alt="Medical Office"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black via-black/40 to-transparent" />
                </div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row gap-8 items-end"
                    >
                        <div className="relative">
                            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl">
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-white dark:border-black flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                ONLINE
                            </div>
                        </div>

                        <div className="flex-1 mb-2 text-white shadow-black drop-shadow-md">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl md:text-5xl font-bold">{doctor.name}</h1>
                                <Badge className="bg-blue-500/80 backdrop-blur-md hover:bg-blue-600 border-none text-white h-7">
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified Pro
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-lg">
                                <span className="flex items-center gap-2"><Stethoscope className="w-5 h-5" /> {doctor.specialization}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {doctor.district}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-2 font-semibold text-yellow-400"><Star className="w-5 h-5 fill-current" /> {doctor.rating}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
                {/* Left Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                            <Award className="w-6 h-6 text-primary mb-2" />
                            <span className="font-bold text-lg">{doctor.experience}</span>
                            <span className="text-xs text-muted-foreground">Experience</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                            <Shield className="w-6 h-6 text-green-500 mb-2" />
                            <span className="font-bold text-lg">100%</span>
                            <span className="text-xs text-muted-foreground">Verified</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                            <Languages className="w-6 h-6 text-purple-500 mb-2" />
                            <span className="font-bold text-lg">3</span>
                            <span className="text-xs text-muted-foreground">Languages</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                            <Video className="w-6 h-6 text-blue-500 mb-2" />
                            <span className="font-bold text-lg">Yes</span>
                            <span className="text-xs text-muted-foreground">Teleconsult</span>
                        </div>
                    </div>

                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="w-full justify-start h-14 bg-white dark:bg-zinc-900 border rounded-xl p-1 gap-2">
                            <TabsTrigger value="about" className="rounded-lg h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">About</TabsTrigger>
                            <TabsTrigger value="location" className="rounded-lg h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">Location</TabsTrigger>
                            <TabsTrigger value="reviews" className="rounded-lg h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium">Reviews ({reviews.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className="mt-6 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-xl font-bold mb-4">About Dr. {doctor.name.split(' ')[1]}</h3>
                            <p className="text-muted-foreground leading-loose text-lg mb-6">
                                Dr. {doctor.name} is a highly respected {doctor.specialization} based in the {doctor.district} region.
                                With a focus on holistic patient care, they have been a pioneer in bringing advanced medical practices to the valley.
                                Their clinic is equipped with state-of-the-art diagnostic tools, ensuring accurate assessments.
                            </p>
                            <h4 className="font-semibold text-lg mb-3">Specializations</h4>
                            <div className="flex flex-wrap gap-2">
                                {["Cardiac Surgery", "Preventive Care", "Pediatric Cardiology", "Hypertension Management"].map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="location" className="mt-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-10 bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden relative"
                            >
                                {/* Background Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] -ml-24 -mb-24" />

                                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                    <div className="flex-1 space-y-6">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                                            <MapPin className="w-4 h-4" /> Clinic Location
                                        </div>

                                        <div>
                                            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">Visit the Clinic</h3>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                                                Dr. {doctor.name.split(' ')[1]}'s practice is centrally located in the heart of {doctor.district}. Easy access and modern facilities.
                                            </p>
                                        </div>

                                        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700 space-y-2">
                                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Verified Address</div>
                                            <div className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{doctor.district}, Kashmir, India</div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Button
                                                onClick={() => window.open(doctor.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.name + " " + doctor.district)}`, '_blank')}
                                                className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-3 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
                                            >
                                                Open Google Maps <ArrowRight className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(doctor.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(doctor.name + " " + doctor.district)}`, '_blank')}
                                                className="h-16 px-8 rounded-2xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                                            >
                                                Get Directions
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Visual Representation */}
                                    <div className="w-full md:w-72 lg:w-80 h-72 md:h-80 relative group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 rounded-[40px] rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-[40px] border-4 border-white dark:border-zinc-700 overflow-hidden shadow-2xl">
                                            <img
                                                src="/images/map-viz.jpg"
                                                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                                                alt="Map Visualization"
                                            />
                                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-900 shadow-2xl flex items-center justify-center">
                                                    <MapPin className="w-10 h-10 text-primary animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6 space-y-6">
                            {/* Submit Review Form */}
                            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                                className={`transition-all ${newReview.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'}`}
                                            >
                                                <Star className={`w-8 h-8 ${newReview.rating >= star ? 'fill-current' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <Textarea
                                        placeholder="Share your experience with Dr. Specialist..."
                                        value={newReview.comment}
                                        onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                        className="h-24 rounded-xl"
                                    />
                                    <Button
                                        onClick={handleReviewSubmit}
                                        disabled={isSubmittingReview}
                                        className="w-full md:w-auto"
                                    >
                                        {isSubmittingReview ? "Submitting..." : "Post Review"}
                                    </Button>
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((r) => (
                                        <div key={r.id} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={r.patient.image} />
                                                        <AvatarFallback>{r.patient.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-bold">{r.patient.name}</div>
                                                        <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="flex text-yellow-400">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-zinc-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground">{r.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">No reviews yet. Be the first to review!</div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Sticky Booking Card */}
                <div className="relative">
                    <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-3xl p-6 border shadow-2xl shadow-primary/5 space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <span className="text-3xl font-bold text-primary">₹{doctor.fees}</span>
                                <span className="text-muted-foreground ml-1">/ visit</span>
                            </div>
                            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Available Today</Badge>
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-2 block">Date</label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-xl border w-full flex justify-center p-2"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-2 block">Available Time Slots</label>
                            <div className="grid grid-cols-3 gap-2">
                                {["10:00", "10:30", "11:00", "16:00", "16:30", "17:00"].map((t, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setTime(t)}
                                        className={`py-2 rounded-lg text-sm font-medium border transition-all 
                                            ${time === t
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                                : 'hover:border-primary border-zinc-200 dark:border-zinc-700'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            disabled={isBooking}
                            onClick={handleBookAppointment}
                            size="lg"
                            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-cyan-600 hover:shadow-xl hover:shadow-primary/25 transition-all"
                        >
                            {isBooking ? "Confirming..." : "Confirm Appointment"}
                        </Button>

                        <div className="text-center text-xs text-muted-foreground">
                            No payment required until confirmation
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
