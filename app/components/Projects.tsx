'use client';

import React, { useState } from 'react';

interface LanguageStat {
    name: string;
    percentage: number;
}

interface Repo {
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
    languages?: string[];
    languageStats?: LanguageStat[];
}

interface ProjectsProps {
    repos: Repo[];
    aggregateSkills?: { name: string; level: number }[];
}

const ITEMS_PER_PAGE = 6;

const languageColors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'SCSS': '#c6538c',
    'Python': '#3572A5',
    'Go': '#00ADD8',
    'Vue': '#41b883',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'SQL': '#e38c00',
    'Shell': '#89e051',
    'C#': '#178600',
    'C++': '#f34b7d',
};

export default function Projects({ repos, aggregateSkills = [] }: ProjectsProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(repos.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentRepos = repos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const section = document.getElementById('projects');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="projects" className="relative py-24 bg-[#0a0a0a] overflow-hidden">
            <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-0.5 w-12 bg-red-600"></div>
                            <h2 className="text-sm font-mono text-red-600 uppercase tracking-[0.5em]">Sector_03: Project Telemetry</h2>
                        </div>
                        <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest max-w-md">
                            Real-time synchronization of modular codebase infrastructure across all orbital repositories.
                        </p>
                    </div>

                    {/* Global Aggregate Bar */}
                    {aggregateSkills.length > 0 && (
                        <div className="w-full md:w-96 space-y-3">
                            <div className="flex justify-between items-end border-b border-neutral-900 pb-2">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">Aggregate_Fleet_Stack</span>
                                <span className="text-[10px] font-mono text-red-600/70 uppercase">v1.2.4_SYNCED</span>
                            </div>
                            <div className="h-1 w-full bg-neutral-900 overflow-hidden flex rounded-full">
                                {aggregateSkills.slice(0, 6).map((skill) => (
                                    <div
                                        key={skill.name}
                                        style={{
                                            width: `${skill.level}%`,
                                            backgroundColor: languageColors[skill.name] || '#444'
                                        }}
                                        className="h-full first:rounded-l-full last:rounded-r-full opacity-80"
                                        title={`${skill.name}: ${skill.level}%`}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-60 hover:opacity-100 transition-opacity">
                                {aggregateSkills.slice(0, 4).map((skill) => (
                                    <div key={skill.name} className="flex items-center gap-1.5">
                                        <div
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: languageColors[skill.name] || '#444' }}
                                        />
                                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-tighter">
                                            {skill.name} {skill.level}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentRepos.map((repo, index) => (
                        <a
                            key={repo.name}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative bg-neutral-950 border border-neutral-900 p-8 hover:border-red-600/50 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between min-h-[300px]"
                        >
                            {/* Technical Index */}
                            <div className="absolute top-4 right-4 text-[10px] font-mono text-neutral-800">
                                REPO_{(startIndex + index).toString().padStart(2, '0')}
                            </div>

                            <div className="space-y-4 flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white group-hover:text-red-600 transition-colors uppercase italic tracking-tighter">
                                        {repo.name.replace(/-/g, '_')}
                                    </h3>
                                </div>

                                <p className="text-neutral-500 text-sm font-light line-clamp-2 h-10">
                                    {repo.description || 'No technical briefing provided for this module.'}
                                </p>

                                {/* Language Usage Bar */}
                                {repo.languageStats && repo.languageStats.length > 0 && (
                                    <div className="space-y-4 pt-2">
                                        <div className="h-1.5 w-full bg-neutral-900 overflow-hidden flex rounded-full">
                                            {repo.languageStats.map((stat) => (
                                                <div
                                                    key={stat.name}
                                                    style={{
                                                        width: `${stat.percentage}%`,
                                                        backgroundColor: languageColors[stat.name] || '#888'
                                                    }}
                                                    className="h-full first:rounded-l-full last:rounded-r-full"
                                                    title={`${stat.name}: ${stat.percentage}%`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            {repo.languageStats.slice(0, 3).map((stat) => (
                                                <div key={stat.name} className="flex items-center gap-1.5">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: languageColors[stat.name] || '#888' }}
                                                    />
                                                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">
                                                        {stat.name} <span className="opacity-60">{stat.percentage}%</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase mt-auto">
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <span>STARS: {repo.stargazers_count}</span>
                                </div>
                                <div className="flex items-center gap-2 text-red-600/70">
                                    <span>INITIALIZED</span>
                                </div>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-transparent group-hover:border-red-600/50 transition-all"></div>
                        </a>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-16 flex flex-wrap justify-center items-center gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border border-neutral-900 bg-neutral-950 text-neutral-500 hover:border-red-600/50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            [ PREV ]
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 text-[10px] font-mono border transition-all ${currentPage === page
                                        ? 'border-red-600 bg-red-600/10 text-red-500'
                                        : 'border-neutral-900 bg-neutral-950 text-neutral-500 hover:border-red-600/30'
                                        }`}
                                >
                                    {page.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest border border-neutral-900 bg-neutral-950 text-neutral-500 hover:border-red-600/50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            [ NEXT ]
                        </button>
                    </div>
                )}
            </div>

            {/* Background Sector Text */}
            <div className="absolute -bottom-10 left-10 text-[100px] font-black italic text-white/[0.02] select-none pointer-events-none">
                S_03
            </div>
        </section>
    );
}
