'use client';

import React from 'react';

interface Skill {
    name: string;
    level: number;
    category: string;
}

interface EducationItem {
    degree: string;
    school: string;
    period: string;
    description: string;
}

interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    description: string;
    link?: string;
}

interface AboutProps {
    skills?: Skill[];
    education?: EducationItem[];
    experience?: ExperienceItem[];
}

const defaultSkills = [
    { name: 'React/Next.js', level: 95, category: 'POWER_UNIT' },
    { name: 'TypeScript', level: 90, category: 'ELECTRONICS' },
    { name: 'Node.js', level: 85, category: 'DRIVETRAIN' },
    { name: 'Tailwind CSS', level: 98, category: 'AERODYNAMICS' },
    { name: 'Three.js', level: 75, category: 'VISUALS' },
    { name: 'PostgreSQL', level: 80, category: 'FUEL_SYSTEM' },
];

const defaultEducation: EducationItem[] = [
    {
        degree: "Bachelor of Science in Information Technology",
        school: "Technological University of the Philippines - Taguig",
        period: "2022 - 2026",
        description: "Specialized in Software Development and Web Technologies."
    }
];

const defaultExperience: ExperienceItem[] = [
    {
        role: "Full Stack Intern",
        company: "Inspire Holdings Inc - BGC Alliance Global Tower",
        period: "2026",
        description: "Developed Loopwork (16 tools-in-one). Specialized in backend development and assisted in sales operations.",
        link: "https://inspireholdings.ph/"
    },
    {
        role: "Digital Designer (Freelance)",
        company: "D and Q Animal Bite Center",
        period: "August 2024 - Present",
        description: "Designed social media and branding content using Canva. Maintained online visibility and clinic availability on map services.",
        link: "/projects/d-and-q"
    },
    {
        role: "Product Sampler",
        company: "Ovomaltine Philippines",
        period: "October 2023",
        description: "Conducted a one-day sampling event, offering free tastes of the company's product to potential customers."
    }
];

export default function About({
    skills = defaultSkills,
    education = defaultEducation,
    experience = defaultExperience
}: AboutProps) {
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Bio / Sector Analysis */}
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

                    {/* Education & Experience Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Education Background */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-red-600"></div>
                                <h4 className="text-white font-mono text-xs uppercase tracking-widest opacity-70">Education_Background</h4>
                            </div>
                            <div className="space-y-8">
                                {education.map((item, index) => (
                                    <div key={index} className="relative pl-4 border-l border-neutral-800 space-y-2">
                                        <div className="absolute -left-[1.5px] top-0 w-[4px] h-[4px] bg-red-600"></div>
                                        <p className="text-red-600 font-mono text-[10px]">{item.period}</p>
                                        <h5 className="text-white font-bold text-lg leading-tight">{item.degree}</h5>
                                        <p className="text-neutral-500 text-sm font-medium">{item.school}</p>
                                        <p className="text-neutral-400 text-sm font-light leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-red-600"></div>
                                <h4 className="text-white font-mono text-xs uppercase tracking-widest opacity-70">Experience</h4>
                            </div>
                            <div className="space-y-8">
                                {experience.map((item, index) => (
                                    <div key={index} className="relative pl-4 border-l border-neutral-800 space-y-2 group">
                                        <div className="absolute -left-[1.5px] top-0 w-[4px] h-[4px] bg-red-600 transition-all duration-300 group-hover:h-full"></div>
                                        <p className="text-red-600 font-mono text-[10px]">{item.period}</p>
                                        <h5 className="text-white font-bold text-lg leading-tight">{item.role}</h5>
                                        <p className="text-neutral-500 text-sm font-medium">{item.company}</p>
                                        <p className="text-neutral-400 text-sm font-light leading-relaxed">{item.description}</p>

                                        {item.link && (
                                            <div className="pt-2">
                                                <a
                                                    href={item.link}
                                                    target={item.link.startsWith('http') ? "_blank" : "_self"}
                                                    rel={item.link.startsWith('http') ? "noopener noreferrer" : ""}
                                                    className="inline-flex items-center gap-2 text-[10px] font-mono text-red-600 uppercase tracking-widest hover:text-white transition-colors group/link"
                                                >
                                                    [VIEW_DETAILS]
                                                    <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
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
