"use client";

import { useEffect, useState } from "react";
import { approveDoctor, getAdminStats, terminateDoctor, updateDoctorSettings } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Trash2, ExternalLink, FileText, CheckCircle2, Pencil, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExportButton } from "@/components/ui/ExportButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



type DoctorStat = {
    id: string;
    name: string;
    specialization: string;
    licenseNumber: string | null;
    verificationUrl: string | null;
    status: string;
    paidAppts: number;
    unpaidAppts: number;
    totalRevenue: number;
    commission: number;
    fees: number;
    phone: string | null;
    district: string | null;
    mapsUrl: string | null;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editingDoctor, setEditingDoctor] = useState<DoctorStat | null>(null);
    const [editForm, setEditForm] = useState({ phone: "", district: "", mapsUrl: "" });
    const [selectedMonth, setSelectedMonth] = useState("all");
    const { toast } = useToast();

    const fetchStats = async () => {
        const data = await getAdminStats();
        setStats(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleApprove = async (id: string, name: string) => {
        try {
            await approveDoctor(id);
            toast({ title: "Approved!", description: `${name}'s account is now active.` });
            fetchStats();
        } catch (error) {
            toast({ title: "Failed to approve", variant: "destructive" });
        }
    };

    const handleSaveEdit = async () => {
        if (!editingDoctor) return;
        try {
            const res = await updateDoctorSettings(editingDoctor.id, editForm);
            if (res.success) {
                toast({ title: "Updated!", description: `${editingDoctor.name}'s info has been updated.` });
                setEditingDoctor(null);
                fetchStats();
            } else {
                toast({ title: "Update Failed", description: res.error || "Unknown error occurred", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Update failed", variant: "destructive", description: "A network error occurred." });
        }
    };

    const handleTerminate = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to terminate Dr. ${name}? This action cannot be undone.`)) return;

        try {
            await terminateDoctor(id);
            toast({ title: "Doctor Terminated", description: `Dr. ${name} has been removed.` });
            fetchStats(); // Refresh
        } catch (error) {
            toast({ title: "Error", description: "Failed to terminate doctor.", variant: "destructive" });
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    // Extract unique months from all appointments in the system
    const allAppointments = stats ? stats.doctorStats.flatMap((doc: any) => doc.appointments || []) : [];
    
    const availableMonths = Array.from(new Set(allAppointments.map((apt: any) => {
        if (!apt.date) return "";
        const parts = apt.date.split('-');
        if (parts.length >= 2) return `${parts[0]}-${parts[1]}`;
        return "";
    }).filter(Boolean))).sort() as string[];

    const formatMonthLabel = (yearMonthStr: string) => {
        const [year, month] = yearMonthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    };

    // Dynamic stats computation
    let displayRevenue = stats?.totalRevenue || 0;
    let displayCommission = stats?.totalCommission || 0;
    let displayAppointments = stats?.totalAppointments || 0;
    
    if (stats && selectedMonth !== "all") {
        displayRevenue = 0;
        displayCommission = 0;
        displayAppointments = 0;
        stats.doctorStats.forEach((doc: any) => {
            const monthlyPaid = (doc.appointments || []).filter((a: any) => a.paymentStatus === "Paid" && a.date.startsWith(selectedMonth));
            const monthlyTotal = (doc.appointments || []).filter((a: any) => a.date.startsWith(selectedMonth));
            displayRevenue += monthlyPaid.reduce((sum: number, a: any) => sum + a.amount, 0);
            displayCommission += monthlyPaid.reduce((sum: number, a: any) => sum + a.commission, 0);
            displayAppointments += monthlyTotal.length;
        });
    }

    // Dynamic doctor stats table data
    const computedDoctorStats = stats ? stats.doctorStats.map((doc: any) => {
        if (selectedMonth === "all") {
            return doc;
        }
        const monthlyPaid = (doc.appointments || []).filter((a: any) => a.paymentStatus === "Paid" && a.date.startsWith(selectedMonth));
        const monthlyUnpaid = (doc.appointments || []).filter((a: any) => a.paymentStatus === "Unpaid" && a.date.startsWith(selectedMonth));
        const totalRevenue = monthlyPaid.reduce((sum: number, a: any) => sum + a.amount, 0);
        const commission = monthlyPaid.reduce((sum: number, a: any) => sum + a.commission, 0);
        
        return {
            ...doc,
            paidAppts: monthlyPaid.length,
            unpaidAppts: monthlyUnpaid.length,
            totalRevenue,
            commission
        };
    }) : [];

    const filteredDoctors = computedDoctorStats.filter((doc: any) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.licenseNumber?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-teal-600 bg-clip-text text-transparent">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-2">Overview of platform performance and doctor management</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-200/50">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Month:</span>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-44 h-10 bg-white">
                            <SelectValue placeholder="All Months" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="all">All Months</SelectItem>
                            {availableMonths.map((m) => (
                                <SelectItem key={m} value={m}>{formatMonthLabel(m)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/30 transition-all duration-300">
                    <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">₹</span>
                        </div>
                        Revenue
                    </CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-emerald-900">₹{displayRevenue.toLocaleString()}</div></CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-300">
                    <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">%</span>
                        </div>
                        Commissions (10%)
                    </CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-blue-900">₹{displayCommission.toLocaleString()}</div></CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 hover:shadow-xl hover:shadow-purple-200/30 transition-all duration-300">
                    <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">👨</span>
                        </div>
                        Active Doctors
                    </CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-purple-900">{stats?.totalDoctors}</div></CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50 hover:shadow-xl hover:shadow-amber-200/30 transition-all duration-300">
                    <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">📅</span>
                        </div>
                        Appointments
                    </CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-amber-900">{displayAppointments}</div></CardContent>
                </Card>
            </div>

            {/* Doctor Management */}
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 pb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">👨‍⚕️</span>
                            </div>
                            Doctor Management
                        </CardTitle>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name or license..."
                                    className="pl-9 h-9 bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <ExportButton
                              filename={
                                selectedMonth === "all"
                                  ? "doctors_report_all_months"
                                  : `doctors_report_${selectedMonth}`
                              }
                              generateCsv={() => {
                                const headers = [
                                  "Doctor ID",
                                  "Name",
                                  "Specialization",
                                  "District",
                                  "Status",
                                  "Fees (₹)",
                                  "Phone",
                                  "License Number",
                                  "Paid Appointments",
                                  "Unpaid Appointments",
                                  "Total Revenue (₹)",
                                  "Commission (₹)",
                                ];
                                const rows = computedDoctorStats.map((doc: any) => [
                                  doc.id,
                                  doc.name,
                                  doc.specialization,
                                  doc.district || "N/A",
                                  doc.status,
                                  doc.fees,
                                  doc.phone || "N/A",
                                  doc.licenseNumber || "N/A",
                                  doc.paidAppts,
                                  doc.unpaidAppts,
                                  doc.totalRevenue,
                                  doc.commission,
                                ]);
                                return { headers, rows };
                              }}
                            >
                              Export Doctors
                            </ExportButton>
                            <ExportButton
                              filename={
                                selectedMonth === "all"
                                  ? "appointments_report_all_months"
                                  : `appointments_report_${selectedMonth}`
                              }
                              generateCsv={() => {
                                const headers = [
                                  "Appointment ID",
                                  "Patient Name",
                                  "Patient ID",
                                  "Contact",
                                  "Date",
                                  "Time",
                                  "Status",
                                  "Payment Status",
                                  "Amount (₹)",
                                  "Commission (₹)",
                                  "Doctor Name",
                                  "Doctor ID",
                                ];
                                const rows: (string | number)[][] = [];
                                for (const doc of computedDoctorStats) {
                                  const filteredApts =
                                    selectedMonth === "all"
                                      ? doc.appointments
                                      : doc.appointments.filter((a: any) => a.date.startsWith(selectedMonth));
                                  for (const apt of filteredApts) {
                                    rows.push([
                                      apt.id,
                                      apt.patientName,
                                      apt.patientId,
                                      apt.contact || "N/A",
                                      apt.date,
                                      apt.time,
                                      apt.status,
                                      apt.paymentStatus || "Unpaid",
                                      apt.amount,
                                      apt.commission,
                                      doc.name,
                                      doc.id,
                                    ]);
                                  }
                                }
                                return { headers, rows };
                              }}
                            >
                              Export Appointments
                            </ExportButton>                      
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor Info</TableHead>
                                <TableHead>License & Verification</TableHead>
                                <TableHead>Appointments (Paid/Unpaid)</TableHead>
                                <TableHead>Commission Due</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDoctors?.map((doc: DoctorStat) => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <div className="font-medium">{doc.name}</div>
                                        <div className="text-xs text-slate-500">{doc.specialization}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-mono text-xs mb-1">{doc.licenseNumber || "N/A"}</div>
                                        {doc.verificationUrl ? (
                                            <a href={doc.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center text-xs hover:underline">
                                                <FileText className="w-3 h-3 mr-1" /> View Document
                                            </a>
                                        ) : (
                                            <span className="text-slate-400 text-xs">No Document</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">{doc.paidAppts} Paid</Badge>
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">{doc.unpaidAppts} Unpaid</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-green-600">
                                        ₹{doc.commission.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditingDoctor(doc);
                                                setEditForm({
                                                    phone: doc.phone || "",
                                                    district: doc.district || "",
                                                    mapsUrl: doc.mapsUrl || ""
                                                });
                                            }}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                        {doc.status === "Pending" && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(doc.id, doc.name)}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleTerminate(doc.id, doc.name)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Terminate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredDoctors?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                                        No doctors found matching "{search}"
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Info Dialog */}
            <Dialog open={!!editingDoctor} onOpenChange={(open) => !open && setEditingDoctor(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Doctor Info</DialogTitle>
                        <DialogDescription>Update details for {editingDoctor?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                    id="phone"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="pl-9"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="district">Location (District)</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                    id="district"
                                    value={editForm.district}
                                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                                    className="pl-9"
                                    placeholder="Enter district"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Google Maps URL</Label>
                            <div className="flex gap-2">
                                <Input value={editForm.mapsUrl} onChange={e => setEditForm({ ...editForm, mapsUrl: e.target.value })} placeholder="Embed or Link URL" />
                                {editForm.mapsUrl && (
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={editForm.mapsUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {editingDoctor?.verificationUrl && (
                            <div className="space-y-3">
                                <Label>Verification Document</Label>
                                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-100 dark:border-blue-900">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center text-sm font-medium text-blue-700 dark:text-blue-300">
                                            <FileText className="w-4 h-4 mr-2" />
                                            {editingDoctor.verificationUrl.split('/').pop()}
                                        </div>
                                        <Button variant="link" size="sm" asChild className="text-blue-600 h-auto p-0">
                                            <a href={editingDoctor.verificationUrl} target="_blank" rel="noopener noreferrer">View Original</a>
                                        </Button>
                                    </div>
                                    {(editingDoctor.verificationUrl.toLowerCase().endsWith('.jpg') ||
                                        editingDoctor.verificationUrl.toLowerCase().endsWith('.jpeg') ||
                                        editingDoctor.verificationUrl.toLowerCase().endsWith('.png')) && (
                                            <div className="mt-2 rounded-md overflow-hidden border bg-white aspect-video relative">
                                                <Image
                                                    src={editingDoctor.verificationUrl}
                                                    alt="Verification Document"
                                                    width={400}
                                                    height={300}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingDoctor(null)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
