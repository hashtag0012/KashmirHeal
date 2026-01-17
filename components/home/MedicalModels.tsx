"use client";

import { useRef, useState, useEffect, Suspense } from "react"; // Added Suspense
import { useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF, Center, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight } from "lucide-react"; // Added ArrowRight import

// Preload models at the module level for maximum speed
useGLTF.preload("/doctors_stethoscope.glb");
useGLTF.preload("/Meshy_AI__Hyperrealistic_3D_re_1225112828_texture.glb");
useGLTF.preload("/pod.glb");

function ModelLoading() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-2 border border-primary/10 rounded-full animate-pulse" />
                </div>
                <span className="text-primary font-black tracking-widest uppercase text-[10px] animate-pulse">
                    Streaming Intelligence...
                </span>
            </div>
        </Html>
    );
}

// Optimized Procedural Mesh for instant visibility
function CyberPod({ color }: { color: string }) {
    return (
        <group position={[0, -22, 0]}>
            <mesh>
                <cylinderGeometry args={[22, 24, 2, 32]} />
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[18, 18, 0.5, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    transparent
                    opacity={0.4}
                />
            </mesh>
            <pointLight position={[0, 2, 0]} intensity={2} color={color} />
        </group>
    );
}

// --- Geometries ---

function HeartGLB({ ...props }) {
    const { scene } = useGLTF("/Meshy_AI_Anatomical_Heart_Mode_1225111650_texture.glb");
    return (
        <Center>
            <primitive object={scene} rotation={[0, 0, 0]} {...props} />
        </Center>
    );
}

function StethoscopeGLB({ ...props }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <Center>
                <mesh {...props}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#2dd4bf" />
                </mesh>
            </Center>
        );
    }

    try {
        const { scene } = useGLTF("/doctors_stethoscope.glb");
        return (
            <Center>
                <primitive object={scene} rotation={[0, Math.PI, 0]} {...props} />
            </Center>
        );
    } catch (err) {
        console.error("Failed to load stethoscope model:", err);
        setError(true);
        return null;
    }
}

function MaskGLB({ ...props }) {
    const { scene } = useGLTF("/Meshy_AI__Hyperrealistic_3D_re_1225112828_texture.glb");
    return (
        <Center>
            <primitive object={scene} rotation={[0, Math.PI, 0]} {...props} />
        </Center>
    );
}

function PodGLB({ color }: { color: string }) {
    const { scene } = useGLTF("/pod.glb");
    const podRef = useRef<THREE.Group>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useFrame((state, delta) => {
        if (podRef.current) {
            podRef.current.rotation.y += delta * 0.15; // Continuous slow rotation
        }
    });

    return (
        <group ref={podRef} position={[0, isMobile ? -22.5 : -22, 0]}>
            <Center top>
                <primitive object={scene} scale={isMobile ? 25.0 : 29.0} />
            </Center>

            {/* Keeping a subtle light beam for the WOW factor */}
            <mesh position={[0, isMobile ? 0.6 : 0.8, 0]}>
                <cylinderGeometry args={[isMobile ? 1.0 : 1.5, isMobile ? 1.0 : 1.5, isMobile ? 1.5 : 2.5, 64, 1, true]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.03}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

function InteractiveTilt({ children, position = [0, 0, 0] }: { children: React.ReactNode, position?: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        const { x, y } = state.mouse;
        // Subtle tilt based on mouse position
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.2, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.2, 0.1);
    });

    return <group ref={groupRef} position={position}>{children}</group>;
}

function GlassCard({ title, desc, stats, color, active }: { title: string, desc: string, stats: string[], color: string, active: boolean }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const isMask = title === "Surgery";
    const xPos = isMobile ? -20.0 : (isMask ? -28.0 : -18.0);

    return (
        <Html
            position={[xPos, isMobile ? -5.0 : 10.0, 0]}
            center
            transform
            distanceFactor={isMobile ? 15.0 : 25}
            style={{
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: active ? 1 : 0,
                filter: `blur(${active ? 0 : 8}px)`,
                transform: `translateX(${active ? 0 : -40}px) rotateY(${active ? 0 : -45}deg) scale(${active ? 1.0 : 0.8})`,
                perspective: "1500px",
                pointerEvents: "none",
                visibility: active ? 'visible' : 'hidden'
            }}
        >
            <div className={`${isMobile ? 'w-[550px]' : 'w-[350px]'} ${isMobile ? 'p-12' : 'p-6'} ${isMobile ? 'rounded-[64px]' : 'rounded-[24px]'} border-white/20 shadow-2xl bg-black/95 backdrop-blur-3xl`} style={{ border: isMobile ? '4px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.2)' }}>
                <div
                    className={`${isMobile ? 'px-8 py-3' : 'px-3 py-1'} rounded-full ${isMobile ? 'text-[22px]' : 'text-[10px]'} font-black uppercase tracking-widest text-white ${isMobile ? 'mb-8' : 'mb-3'} shadow-[0_0_80px_rgba(255,255,255,0.3)]`}
                    style={{ border: isMobile ? `4px solid ${color}` : `1px solid ${color}`, color: color }}
                >
                    {title}
                </div>
                <h3 className={`text-white ${isMobile ? 'text-[38px]' : 'text-[14px]'} font-bold ${isMobile ? 'mb-8' : 'mb-2'} tracking-tighter uppercase opacity-60`}>Digital Telemetry</h3>
                <div className={`${isMobile ? 'space-y-8' : 'space-y-2'}`}>
                    {stats.map((stat, i) => (
                        <div key={i} className={`flex items-center justify-between ${isMobile ? 'text-[42px]' : 'text-[16px]'} text-white ${isMobile ? 'border-t-2' : 'border-t'} border-white/5 border-dashed ${isMobile ? 'pt-8' : 'pt-2'}`}>
                            <span className={`opacity-40 font-medium uppercase ${isMobile ? 'text-[24px]' : 'text-[11px]'}`}>{stat.split(":")[0]}</span>
                            <span className="font-mono text-white font-bold" style={{ color: color }}>{stat.split(":")[1]}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
                    <div className="w-full h-[1px] bg-white/20 absolute top-0 animate-[scan_4s_linear_infinite]" />
                </div>
            </div>
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
            `}</style>
        </Html>
    );
}

function DataParticles({ color }: { color: string }) {
    const points = useRef<THREE.Group>(null);
    const [particleData] = useState(() => {
        return Array.from({ length: 15 }, () => ({
            position: [
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 1.5,
            ] as [number, number, number],
            speed: 0.2 + Math.random() * 0.5,
            offset: Math.random() * Math.PI * 2,
        }));
    });

    useFrame((state) => {
        if (points.current) {
            points.current.children.forEach((child, i) => {
                const data = particleData[i];
                child.position.y += Math.sin(state.clock.getElapsedTime() * data.speed + data.offset) * 0.002;
                child.position.x += Math.cos(state.clock.getElapsedTime() * data.speed + data.offset) * 0.002;
            });
        }
    });

    return (
        <group ref={points}>
            {particleData.map((data, i) => (
                <mesh key={i} position={data.position}>
                    <boxGeometry args={[0.03, 0.03, 0.03]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

function AnimatedModel({ children, active }: { children: React.ReactNode, active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (groupRef.current && !hasInitialized) {
            const initialScale = active ? 1 : 0;
            const initialRotation = active ? 0 : Math.PI;

            groupRef.current.scale.set(initialScale, initialScale, initialScale);
            groupRef.current.rotation.y = initialRotation;
            setHasInitialized(true);
        }
    }, [active, hasInitialized]);

    useFrame((state, delta) => {
        if (!groupRef.current || !hasInitialized) return;

        const targetScale = active ? 1 : 0;
        const targetRotY = active ? 0 : Math.PI;

        const lerpFactor = Math.min(delta * 6, 1);
        groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, lerpFactor);
        groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, lerpFactor);
        groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, lerpFactor);

        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, Math.min(delta * 4, 1));
    });

    return <group ref={groupRef}>{children}</group>;
}

export function MedicalModels() {
    const [index, setIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const modelScaleMod = isMobile ? 12.0 : 15.0;

    const models = [
        {
            id: "Cardiology",
            Component: HeartGLB,
            color: "#f87171",
            scale: 1.0,
            stats: ["Blood Flow: 100%", "BPM: 72 (Normal)", "Efficiency: High"]
        },
        {
            id: "Primary Care",
            Component: StethoscopeGLB,
            color: "#2dd4bf",
            scale: 0.5,
            stats: ["Acoustics: Crystal", "Accuracy: ±0.01", "Verified: Yes"]
        },
        {
            id: "Surgery",
            Component: MaskGLB,
            color: "#60a5fa",
            scale: 1.0,
            stats: ["Filtration: 99.9%", "Breathability: Max", "Standards: ISO-C"]
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((state) => (state + 1) % models.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentItem = models[index];

    return (
        <>
            <Environment preset="studio" environmentIntensity={isMobile ? 0.5 : 1.2} />
            <ambientLight intensity={isMobile ? 1.0 : 1.2} />
            <pointLight position={[5, 10, 5]} intensity={isMobile ? 1.2 : 1.5} color="#fff" />
            <spotLight position={[0, 4, 0]} angle={0.4} penumbra={1} intensity={isMobile ? 1.0 : 1.5} color={currentItem.color} />

            <Suspense fallback={<CyberPod color={currentItem.color} />}>
                <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
                    <PodGLB color={currentItem.color} />
                </Float>
            </Suspense>

            <InteractiveTilt position={[0, isMobile ? 10.0 : 20.0, 0]}>
                <Float speed={isMobile ? 1.5 : 2.5} rotationIntensity={0.4} floatIntensity={0.5} floatingRange={[-0.15, 0.15]}>
                    <Suspense fallback={<ModelLoading />}>
                        {models.map((item, i) => {
                            const Model = item.Component;
                            const isActive = i === index;
                            return (
                                <AnimatedModel key={item.id} active={isActive}>
                                    <Model scale={item.scale * modelScaleMod} />
                                    <DataParticles color={item.color} />
                                    <GlassCard
                                        title={item.id}
                                        desc=""
                                        stats={item.stats}
                                        color={item.color}
                                        active={isActive}
                                    />
                                </AnimatedModel>
                            );
                        })}
                    </Suspense>
                </Float>
            </InteractiveTilt>

            <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[2, 1, -2]} scale={0.2}>
                    <sphereGeometry />
                    <meshStandardMaterial color="#ccfbf1" transparent opacity={0.6} />
                </mesh>
                <mesh position={[-2, -1, -1]} scale={0.15}>
                    <octahedronGeometry />
                    <meshStandardMaterial color="#e0f2fe" transparent opacity={0.6} />
                </mesh>
                <mesh position={[1, -2, 1]} scale={0.1}>
                    <boxGeometry />
                    <meshStandardMaterial color="#fee2e2" transparent opacity={0.6} />
                </mesh>
            </Float>
        </>
    );
}
