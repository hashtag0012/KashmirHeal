"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getDoctorDashboardData, toggleAvailability, respondToAppointment, updateDoctorSettings } from "../../../lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Loader2, Calendar, Users, Star, Clock, MapPin, Check, X, Eye, FileText } from "lucide-react";
import { useToast } from "../../../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

export default function DoctorDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Edit Form State
    const [editForm, setEditForm] = useState({ description: "", fees: "", experience: "", district: "", phone: "", mapsUrl: "" });
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

    const fetchData = async () => {
        if (session?.user?.email) {
            const res = await getDoctorDashboardData(session.user.email);
            setData(res);
            if ((res as any)?.doctor) {
                const doc = (res as any).doctor;
                setEditForm({
                    description: doc.description || "",
                    fees: doc.fees.toString(),
                    experience: doc.experience || "",
                    district: doc.district || "",
                    phone: doc.phone || "",
                    mapsUrl: doc.mapsUrl || ""
                });
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const handleToggle = async () => {
        try {
            await toggleAvailability(data.doctor.id);
            setData((prev: any) => ({
                ...prev,
                doctor: { ...prev.doctor, isAvailable: !prev.doctor.isAvailable }
            }));
            toast({ title: "Status Updated", description: "Your availability has been changed." });
        } catch (e) {
            toast({ title: "Error", variant: "destructive", description: "Failed to update status." });
        }
    };

    const handleAppointment = async (id: string, action: 'confirmed' | 'cancelled') => {
        try {
            await respondToAppointment(id, action);
            toast({ title: action === 'confirmed' ? "Accepted" : "Declined", description: "Appointment status updated." });
            fetchData();
        } catch (e) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleSaveProfile = async () => {
        try {
            const res = await updateDoctorSettings(data.doctor.id, editForm);
            if (res.success) {
                toast({ title: "Saved", description: "Profile updated successfully." });
                fetchData();
            } else {
                toast({ title: "Update Failed", description: (res as any).error || "Unknown error occurred", variant: "destructive" });
            }
        } catch (e) {
            toast({ title: "Error", variant: "destructive", description: "A network error occurred." });
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-8">Doctor profile not found. Please contact support.</div>;

    const { doctor, appointments, stats } = data;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. {doctor.name}</h1>
                    <p className="text-slate-500">Manage your practice and patients</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border">
                    <span className={`text-sm font-medium ${doctor.isAvailable ? 'text-green-600' : 'text-slate-500'}`}>
                        {doctor.isAvailable ? "Online (Accepting)" : "Offline (Busy)"}
                    </span>
                    <Switch checked={doctor.isAvailable} onCheckedChange={handleToggle} />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-bold text-slate-500">TODAY</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{stats.todayCount}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-bold text-slate-500">PENDING</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-amber-600">{stats.pendingCount}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-bold text-slate-500">PATIENTS</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{stats.totalPatients}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-bold text-slate-500">RATING</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0"><div className="text-2xl font-bold flex items-center">{stats.rating} <Star className="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" /></div></CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="appointments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader><CardTitle>Appointment Requests</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map((apt: any) => (
                                        <TableRow key={apt.id}>
                                            <TableCell>
                                                <div className="font-medium">{apt.patientName}</div>
                                                <div className="text-xs text-slate-500">{apt.contact || "No Contact info"}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm"><Calendar className="w-3 h-3 mr-1" /> {apt.date}</div>
                                                <div className="flex items-center text-xs text-slate-500"><Clock className="w-3 h-3 mr-1" /> {apt.time}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={apt.status === 'confirmed' ? 'default' : apt.status === 'pending' ? 'secondary' : 'destructive'}>
                                                    {apt.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-primary hover:bg-primary/10"
                                                        onClick={() => {
                                                            setSelectedPatient(apt.patient);
                                                            // Also include contact from appointment
                                                            setSelectedPatient({
                                                                ...apt.patient,
                                                                contact: apt.contact,
                                                                patientName: apt.patientName
                                                            });
                                                            setIsPatientModalOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" /> View Profile
                                                    </Button>
                                                    {apt.status === 'pending' && (
                                                        <>
                                                            <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleAppointment(apt.id, 'confirmed')}>
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleAppointment(apt.id, 'cancelled')}>
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {appointments.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8">No appointments found</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader><CardTitle>Profile Details</CardTitle><CardDescription>Update your public doctor profile</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Consultation Fees (₹)</label>
                                    <Input value={editForm.fees} onChange={e => setEditForm(prev => ({ ...prev, fees: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Experience</label>
                                    <Input value={editForm.experience} onChange={e => setEditForm(prev => ({ ...prev, experience: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">District/Location</label>
                                    <Input value={editForm.district} onChange={e => setEditForm(prev => ({ ...prev, district: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input value={editForm.phone} onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Google Maps URL</label>
                                <Input
                                    value={editForm.mapsUrl}
                                    onChange={e => setEditForm(prev => ({ ...prev, mapsUrl: e.target.value }))}
                                    placeholder="Paste Google Maps URL here"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">About You</label>
                                <Textarea value={editForm.description} onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))} className="h-32" />
                            </div>

                            {doctor?.verificationUrl && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Verification Document</label>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                                <span>{doctor.verificationUrl.split('/').pop()}</span>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={doctor.verificationUrl} target="_blank" rel="noopener noreferrer">View File</a>
                                            </Button>
                                        </div>
                                        {(doctor.verificationUrl.toLowerCase().endsWith('.jpg') ||
                                            doctor.verificationUrl.toLowerCase().endsWith('.jpeg') ||
                                            doctor.verificationUrl.toLowerCase().endsWith('.png')) && (
                                                <div className="mt-2 rounded-lg overflow-hidden border bg-white aspect-video relative max-w-md">
                                                    <img
                                                        src={doctor.verificationUrl}
                                                        alt="Verification Document"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )}

                            <Button onClick={handleSaveProfile} className="w-full">Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Patient Profile Modal */}
            <Dialog open={isPatientModalOpen} onOpenChange={setIsPatientModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Patient Profile</DialogTitle>
                        <DialogDescription>Details for {selectedPatient?.name || selectedPatient?.patientName}</DialogDescription>
                    </DialogHeader>
                    {selectedPatient && (
                        <div className="flex flex-col items-center py-6 space-y-4">
                            <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-xl">
                                <AvatarImage src={selectedPatient.image} alt={selectedPatient.name || selectedPatient.patientName} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                    {(selectedPatient.name || selectedPatient.patientName || "P")[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold">{selectedPatient.name || selectedPatient.patientName}</h3>
                                <p className="text-slate-500">{selectedPatient.email}</p>
                            </div>
                            <div className="w-full grid grid-cols-1 gap-4 mt-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Contact Number</p>
                                        <p className="font-bold text-lg">{selectedPatient.contact || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => setIsPatientModalOpen(false)} className="w-full mt-4">Close Profile</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
