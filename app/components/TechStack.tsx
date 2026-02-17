'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code2,
    Database,
    Layout,
    Terminal,
    Layers,
    Cpu,
    Globe,
    Smartphone,
    Server,
    PenTool as Tool,
    Github,
    GitBranch,
    Wind,
    Box,
    FileJson,
    Flame,
    Monitor
} from 'lucide-react';

interface Skill {
    name: string;
    level?: number;
    icon: React.ElementType;
}

interface OrbitLayer {
    radius: number;
    duration: number;
    skills: Skill[];
}

interface TechStackProps {
    githubSkills?: { name: string; level: number; category: string }[];
}

export default function TechStack({ githubSkills = [] }: TechStackProps) {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

    // Slower base durations for smoother rotation
    const layers: OrbitLayer[] = [
        {
            radius: 120,
            duration: 45, // Increased from 20 for slower rotation
            skills: [
                { name: "React.js", icon: Globe },
                { name: "Next.js", icon: Layers },
                { name: "Vite", icon: Wind },
                { name: "React Native", icon: Smartphone },
                { name: "TypeScript", icon: Code2 },
            ]
        },
        {
            radius: 220,
            duration: 60, // Increased from 35
            skills: [
                { name: "Node.js", icon: Server },
                { name: "Nest.js", icon: Cpu },
                { name: "Python", icon: Terminal },
                { name: "Laravel", icon: Box },
                { name: "FastAPI", icon: Wind },
                { name: "PHP", icon: Server },
            ]
        },
        {
            radius: 320,
            duration: 80, // Increased from 50
            skills: [
                { name: "MongoDB", icon: Database },
                { name: "PostgreSQL", icon: Database },
                { name: "SQL", icon: Database },
                { name: "Git", icon: GitBranch },
                { name: "GitHub", icon: Github },
                { name: "Postman", icon: Globe },
            ]
        }
    ];

    // Helper function to render icon
    const renderIcon = (Icon: React.ElementType) => {
        const IconComponent = Icon;
        return <IconComponent size={20} className="text-neutral-400 group-hover:text-white transition-colors duration-500" />;
    };

    // Get animation duration based on hover state - smoother transitions
    const getOrbitDuration = (layerIndex: number, baseDuration: number) => {
        if (hoveredLayer !== null) {
            // When hovering a specific layer: that layer slows down more, others slightly
            return hoveredLayer === layerIndex ? baseDuration * 2.5 : baseDuration * 1.3;
        }
        if (hoveredSkill) {
            // When any skill is hovered: all layers slow down moderately
            return baseDuration * 1.8;
        }
        return baseDuration;
    };

    // Get counter-rotation duration for icons (to keep them upright)
    const getIconDuration = (layerIndex: number, baseDuration: number) => {
        if (hoveredLayer !== null) {
            return hoveredLayer === layerIndex ? baseDuration * 2.5 : baseDuration * 1.3;
        }
        if (hoveredSkill) {
            return baseDuration * 1.8;
        }
        return baseDuration;
    };

    // Smooth transition settings for all animations
    const transitionSettings = {
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth acceleration/deceleration
        duration: 0.8
    };

    return (
        <section id="tech-stack" className="relative py-32 bg-[#0a0a0a] overflow-hidden min-h-[800px] flex items-center justify-center">
            <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>

            <div className="absolute top-24 left-6 z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-0.5 w-12 bg-red-600"></div>
                    <h2 className="text-sm font-mono text-red-600 uppercase tracking-[0.5em]">Sector_04: Orbital Infrastructure</h2>
                </div>
                <p className="text-neutral-500 text-xs font-mono max-w-xs uppercase tracking-widest leading-relaxed">
                    Continuous synchronization of technical modules across three synchronized orbital planes.
                </p>
            </div>

            {/* Solar System Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Core / Sun */}
                <motion.div
                    className="absolute z-20 w-16 h-16 bg-red-600 rounded-full blur-xl opacity-20"
                    animate={{
                        scale: hoveredSkill ? [1, 1.2, 1] : 1,
                        opacity: hoveredSkill ? 0.3 : 0.2
                    }}
                    transition={{
                        duration: 2,
                        repeat: hoveredSkill ? Infinity : 0,
                        ease: "easeInOut"
                    }}
                />
                <div className="absolute z-20 w-8 h-8 bg-red-600 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <Cpu size={16} className="text-white" />
                </div>

                {/* Orbits */}
                {layers.map((layer, lIndex) => (
                    <motion.div
                        key={lIndex}
                        className="absolute border rounded-full"
                        initial={{ borderColor: 'rgba(255,255,255,0.05)' }}
                        animate={{
                            borderColor: hoveredLayer === lIndex
                                ? 'rgba(255,255,255,0.25)'
                                : hoveredSkill
                                    ? 'rgba(255,255,255,0.15)'
                                    : 'rgba(255,255,255,0.05)',
                            scale: hoveredLayer === lIndex ? 1.02 : 1,
                            boxShadow: hoveredLayer === lIndex
                                ? '0 0 40px rgba(220,38,38,0.15)'
                                : hoveredSkill
                                    ? '0 0 20px rgba(220,38,38,0.05)'
                                    : 'none'
                        }}
                        transition={transitionSettings}
                        style={{
                            width: layer.radius * 2,
                            height: layer.radius * 2,
                        }}
                    >
                        <motion.div
                            className="w-full h-full relative"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: getOrbitDuration(lIndex, layer.duration),
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                        >
                            {layer.skills.map((skill, sIndex) => {
                                const angle = (sIndex / layer.skills.length) * Math.PI * 2;
                                const x = Math.cos(angle) * layer.radius;
                                const y = Math.sin(angle) * layer.radius;

                                return (
                                    <div
                                        key={skill.name}
                                        className="absolute top-1/2 left-1/2"
                                        style={{
                                            transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                                        }}
                                    >
                                        <motion.div
                                            className="relative group cursor-pointer"
                                            animate={{ rotate: -360 }}
                                            transition={{
                                                duration: getIconDuration(lIndex, layer.duration),
                                                repeat: Infinity,
                                                ease: "linear",
                                                repeatType: "loop"
                                            }}
                                            onMouseEnter={() => {
                                                setHoveredSkill(skill.name);
                                                setHoveredLayer(lIndex);
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredSkill(null);
                                                setHoveredLayer(null);
                                            }}
                                            whileHover={{
                                                scale: 1.15,
                                                transition: {
                                                    duration: 0.4,
                                                    ease: [0.25, 0.1, 0.25, 1]
                                                }
                                            }}
                                        >
                                            <motion.div
                                                className="p-3 bg-neutral-950 border rounded-lg shadow-lg shadow-black/50 flex flex-col items-center"
                                                animate={{
                                                    borderColor: hoveredSkill === skill.name
                                                        ? 'rgb(220,38,38)'
                                                        : 'rgb(23,23,23)',
                                                    backgroundColor: hoveredSkill === skill.name
                                                        ? 'rgb(23,23,23)'
                                                        : 'rgb(10,10,10)',
                                                }}
                                                transition={transitionSettings}
                                            >
                                                {renderIcon(skill.icon)}
                                                <span className="text-[8px] font-mono text-neutral-400 mt-1 group-hover:text-white transition-colors duration-300">
                                                    {skill.name}
                                                </span>
                                            </motion.div>

                                            {/* Tooltip-like Info */}
                                            <AnimatePresence mode="wait">
                                                {hoveredSkill === skill.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: [0.25, 0.1, 0.25, 1]
                                                        }}
                                                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-mono px-3 py-1.5 rounded-sm whitespace-nowrap z-30 shadow-lg"
                                                    >
                                                        {skill.name.toUpperCase()}
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                ))}

                {/* Ambient Decorative Lines */}
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-5"
                    animate={{
                        opacity: hoveredSkill ? 0.08 : 0.05,
                        scale: hoveredSkill ? 1.03 : 1
                    }}
                    transition={transitionSettings}
                >
                    <div className="w-full h-full border-[0.5px] border-white/20 rounded-full scale-[1.1]"></div>
                    <div className="w-full h-full border-[0.5px] border-white/20 rounded-full scale-[1.3]"></div>
                </motion.div>
            </div>

            {/* Background Sector Marker */}
            <motion.div
                className="absolute -bottom-10 right-20 text-[100px] font-black italic text-white/[0.02] select-none pointer-events-none leading-none"
                animate={{
                    opacity: hoveredSkill ? 0.04 : 0.02,
                }}
                transition={transitionSettings}
            >
                S_04
            </motion.div>
        </section>
    );
}