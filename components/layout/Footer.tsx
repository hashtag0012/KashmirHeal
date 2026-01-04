"use client";

import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/images/kashmirheal.png"
                                alt="Kashmir Heal Logo"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-slate-500 leading-relaxed">
                            J&K's most trusted healthcare platform. Connecting patients with top specialists seamless, secure, and fast.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors cursor-pointer">
                                    <Icon className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Find a Doctor', 'Our Specialists', 'How it Works', 'Patient Stories', 'For Doctors'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-500 hover:text-teal-600 transition-colors block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-500">
                                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                                <span>
                                    Regal Chowk, Residency Road,<br />
                                    Srinagar, J&K 190001
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500">
                                <Phone className="w-5 h-5 text-teal-600 shrink-0" />
                                <span>+91 194 245 1234</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500">
                                <Mail className="w-5 h-5 text-teal-600 shrink-0" />
                                <span>support@kashmirheal.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Stay Updated</h4>
                        <p className="text-slate-500 mb-4">Subscribe to gets health tips and platform updates.</p>
                        <div className="space-y-3">
                            <Input placeholder="Enter your email" className="bg-slate-50 border-slate-200 focus-visible:ring-teal-500" />
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                    <p>© 2024 KashmirHeal. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
                        <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
                        <Link href="#" className="hover:text-slate-600">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
