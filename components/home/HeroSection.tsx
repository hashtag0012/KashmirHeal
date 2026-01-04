"use client";

import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useEffect, useRef, Suspense } from "react";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

import { Search, MapPin, ArrowRight, ShieldCheck, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsTicker } from "./StatsTicker";
import { MedicalModels } from "./MedicalModels";

function ParticleField(props: any) {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#0d9488"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="relative w-full min-h-[70vh] lg:min-h-[85vh] bg-white overflow-hidden flex flex-col pt-12">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2000&auto=format&fit=crop"
          alt="Medical team"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30" />
      </div>

      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
        </Canvas>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 mt-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1]"
            >
              See the Best Doctors <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                From Your Home
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-slate-600 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium"
            >
              Find and book trusted doctors across Kashmir. Quick appointments, no long waits. Healthcare made simple for you and your family.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-8 justify-center lg:justify-start"
            >
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-2xl shadow-teal-200/50 font-bold transition-all duration-300 hover:scale-105">
                <Search className="w-5 h-5 mr-2" /> Find a Doctor
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 font-bold transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 fill-slate-700" /> Watch Demo
              </Button>
            </motion.div>

          </div>

          {/* Right Content / 3D Model Dedicated Space on Mobile */}
          <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center order-first lg:order-last">
            {/* Decorative glow behind 3D models */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] lg:w-[800px] h-[350px] md:h-[600px] lg:h-[800px] bg-gradient-to-r from-teal-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full h-full">
              <Canvas
                camera={{ position: [isMobile ? 0 : 10, 2, isMobile ? 100 : 90], fov: 45 }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance",
                  alpha: true,
                }}
                dpr={[1, 2]}
              >
                <Suspense fallback={null}>
                  <group position={[0, -5, 0]}>
                    <MedicalModels />
                  </group>
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>

        <div className="mt-6 mb-0">
          <StatsTicker />
        </div>
      </motion.div>
    </div>
  );
}
