'use client';

import React from 'react';

interface Skill {
    name: string;
    level: number;
    category: string;
}

interface AboutProps {
    skills?: Skill[];
}

const defaultSkills = [
    { name: 'React/Next.js', level: 95, category: 'POWER_UNIT' },
    { name: 'TypeScript', level: 90, category: 'ELECTRONICS' },
    { name: 'Node.js', level: 85, category: 'DRIVETRAIN' },
    { name: 'Tailwind CSS', level: 98, category: 'AERODYNAMICS' },
    { name: 'Three.js', level: 75, category: 'VISUALS' },
    { name: 'PostgreSQL', level: 80, category: 'FUEL_SYSTEM' },
];

export default function About({ skills = defaultSkills }: AboutProps) {
    return (
        <section id="about" className="relative py-24 bg-[#0a0a0a] overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 carbon-pattern opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-0.5 w-12 bg-red-600"></div>
                    <h2 className="text-sm font-mono text-red-600 uppercase tracking-[0.5em]">Sector_02: Performance Analysis</h2>
                </div>

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    {/* Left: Bio / Sector Analysis */}
                    <div className="space-y-8">
                        <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
                            DRIVEN BY <span className="text-red-600">PERFECTION</span>
                        </h3>

                        <div className="space-y-6 text-neutral-400 font-light leading-relaxed text-lg">
                            <p>
                                <span className="text-white font-mono text-sm mr-2 opacity-50">[ANALYSIS_START]</span>
                                I am Avery Macasa, a software developer with a focus on building high-performance
                                web applications. Like a finely tuned F1 car, I believe every line of code
                                should be optimized for speed, reliability, and precision.
                            </p>
                            <p>
                                My journey in tech is fueled by a passion for solving complex problems
                                and delivering seamless user experiences. I specialize in the modern
                                web stack, constantly pushing the boundaries of what's possible.
                                <span className="text-white font-mono text-sm ml-2 opacity-50">[ANALYSIS_END]</span>
                            </p>
                        </div>

                        {/* Technical Telemetry Bits */}
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="p-4 border border-neutral-900 bg-neutral-950/50 rounded-sm space-y-2">
                                <p className="text-[10px] font-mono text-neutral-600 uppercase">ENGINE_TYPE</p>
                                <p className="text-white font-bold tracking-widest">TS_V8_TURBO</p>
                            </div>
                            <div className="p-4 border border-neutral-900 bg-neutral-950/50 rounded-sm space-y-2">
                                <p className="text-[10px] font-mono text-neutral-600 uppercase">LOCATION</p>
                                <p className="text-white font-bold tracking-widest">MANILA_GPS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sector Marker Decoration */}
            <div className="absolute -bottom-10 right-10 text-[100px] font-black italic text-white/[0.02] select-none pointer-events-none">
                S_02
            </div>
        </section>
    );
}
