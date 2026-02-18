'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const ASSET_PATH = '/dnq-digitals/';

const assets = [
    // Creative Assets
    { name: 'dnqlogo.png', category: 'CREATIVE_ASSETS', title: 'Primary Brand Logo', tech: 'Vector / Raster' },
    { name: 'callingcard.png', category: 'CREATIVE_ASSETS', title: 'Business Card', tech: 'Print Design' },
    { name: 'flyer.png', category: 'CREATIVE_ASSETS', title: 'Promotional Flyer V1', tech: 'Social Media' },
    { name: 'flyer2.png', category: 'CREATIVE_ASSETS', title: 'Promotional Flyer V2', tech: 'Social Media' },
    { name: 'poster.png', category: 'CREATIVE_ASSETS', title: 'Main Clinic Poster', tech: 'High Res' },
    { name: 'poster2.png', category: 'CREATIVE_ASSETS', title: 'Feature Poster V1', tech: 'Marketing' },
    { name: 'poster3.png', category: 'CREATIVE_ASSETS', title: 'Feature Poster V2', tech: 'Marketing' },
    { name: 'poster4.png', category: 'CREATIVE_ASSETS', title: 'Community Poster', tech: 'Advocacy' },
    { name: 'poster5.png', category: 'CREATIVE_ASSETS', title: 'Limited Event Poster', tech: 'Marketing' },
    { name: 'photobooth_item1.png', category: 'CREATIVE_ASSETS', title: 'Photobooth Layout V1', tech: 'Event Asset' },
    { name: 'photobooth_item2.png', category: 'CREATIVE_ASSETS', title: 'Photobooth Layout V2', tech: 'Event Asset' },
    { name: 'photobooth_item3.png', category: 'CREATIVE_ASSETS', title: 'Photobooth Layout V3', tech: 'Event Asset' },

    // Technical Docs
    { name: 'vax.png', category: 'TECHNICAL_DOCS', title: 'Vaccination Record', tech: 'Doc Template' },
    { name: 'rx.png', category: 'TECHNICAL_DOCS', title: 'Prescription Pad', tech: 'Medical' },
    { name: 'pricelist.png', category: 'TECHNICAL_DOCS', title: 'Service Price List', tech: 'Internal' },
    { name: 'registration.png', category: 'TECHNICAL_DOCS', title: 'Patient Registration', tech: 'Forms' },
    { name: 'medcert.png', category: 'TECHNICAL_DOCS', title: 'Medical Certificate', tech: 'Official' },
    { name: 'billing.png', category: 'TECHNICAL_DOCS', title: 'Billing Statement', tech: 'Accounting' },
];

export default function DnQProjects() {
    const [isHoldingLeft, setIsHoldingLeft] = useState(false);
    const [isHoldingRight, setIsHoldingRight] = useState(false);
    const x = React.useRef(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const [filter, setFilter] = useState('ALL');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredAssets = filter === 'ALL'
        ? assets
        : assets.filter(a => a.category === filter);

    const categories = ['ALL', 'CREATIVE_ASSETS', 'TECHNICAL_DOCS'];

    const preventDefault = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const baseSpeed = 0.5; // Slower default speed
    const boostSpeed = 4.0; // Speed when holding button

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.scrollWidth / 2);
        }
    }, [filteredAssets]);

    useEffect(() => {
        let animationFrameId: number;

        const update = () => {
            let currentSpeed = baseSpeed;
            if (isHoldingLeft) currentSpeed = boostSpeed;
            if (isHoldingRight) currentSpeed = -boostSpeed;

            x.current -= currentSpeed;

            // Seamless loop logic
            if (containerWidth > 0) {
                if (x.current <= -containerWidth) {
                    x.current += containerWidth;
                } else if (x.current > 0) {
                    x.current -= containerWidth;
                }
            }

            if (containerRef.current) {
                containerRef.current.style.transform = `translateX(${x.current}px)`;
            }

            animationFrameId = requestAnimationFrame(update);
        };

        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, [containerWidth, isHoldingLeft, isHoldingRight]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Header />

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 md:p-10 select-none"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
                        <button
                            className="absolute top-2 right-2 md:top-0 md:right-0 m-2 md:m-4 text-white hover:text-[#FF8000] transition-colors z-20"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg className="w-6 h-6 md:w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <img
                                src={ASSET_PATH + selectedImage}
                                alt="Full View"
                                className="w-full h-full object-contain shadow-2xl shadow-[#FF8000]/10 z-0"
                                onContextMenu={preventDefault}
                            />

                            {/* Protection Watermark Layer */}
                            <div className="absolute inset-0 z-10 pointer-events-none flex flex-wrap items-center justify-center opacity-[0.05] overflow-hidden">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32 transform -rotate-45 scale-150">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="text-xl md:text-4xl font-black whitespace-nowrap tracking-[0.5em] md:tracking-[1em] text-white">
                                            AVERY MACASA
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Lightbox Telemetry */}
                        <div className="mt-4 md:mt-8 flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 font-mono text-[8px] md:text-[10px] text-neutral-500 uppercase tracking-widest border-t border-neutral-800 pt-4 w-full justify-center">
                            <p>FILE: <span className="text-white">{selectedImage}</span></p>
                            <p className="hidden xs:block">STATUS: <span className="text-[#FF8000]">SECURE_VIEW_MODE</span></p>
                            <p>PROTECTION: <span className="text-white">WATERMARK_ACTIVE</span></p>
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Sector Header */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-0.5 w-12 bg-[#FF8000]"></div>
                    <h1 className="text-sm font-mono text-[#FF8000] uppercase tracking-[0.5em]">Sector_04: D&Q_Gallery</h1>
                </div>

                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                            D&Q <span className="text-[#FF8000] block md:inline">ASSET_REPOSITORY</span>
                        </h2>
                        <p className="text-neutral-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                            A comprehensive technical archive of digital designs and administrative frameworks.
                            Protected documents.
                        </p>
                    </div>

                    <div className="hidden md:block text-right font-mono text-[10px] text-neutral-600 space-y-1">
                        <p>TOTAL_FILES: 18</p>
                        <p>SECURITY: ENABLED</p>
                        <p>COORD: SECTOR_04_ARCHIVE</p>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 mb-12 border-b border-neutral-900 pb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-sm font-mono text-[10px] tracking-widest transition-all duration-300 border ${filter === cat
                                ? 'bg-[#FF8000] border-[#FF8000] text-white shadow-[0_0_20px_rgba(255,128,0,0.3)]'
                                : 'border-neutral-800 text-neutral-500 hover:border-[#FF8000]/50 hover:text-[#FF8000]'
                                }`}
                        >
                            [{cat}]
                        </button>
                    ))}
                </div>

                {/* Asset Gallery - Infinite Slider */}
                <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] overflow-hidden py-10 group/slider">
                    {/* Navigation Arrows */}
                    <div className="absolute inset-y-0 left-0 flex items-center z-20 px-2 md:px-8 pointer-events-none">
                        <button
                            className={`p-2 md:p-4 bg-black/40 backdrop-blur-lg border border-white/10 text-white rounded-full transition-all duration-300 pointer-events-auto hover:border-[#FF8000] hover:text-[#FF8000] active:scale-90 ${isHoldingLeft ? 'scale-110 border-[#FF8000] text-[#FF8000] bg-[#FF8000]/10' : ''}`}
                            onMouseDown={() => setIsHoldingLeft(true)}
                            onMouseUp={() => setIsHoldingLeft(false)}
                            onMouseLeave={() => setIsHoldingLeft(false)}
                            onTouchStart={() => setIsHoldingLeft(true)}
                            onTouchEnd={() => setIsHoldingLeft(false)}
                        >
                            <svg className="w-6 h-6 md:w-8 h-8 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center z-20 px-2 md:px-8 pointer-events-none">
                        <button
                            className={`p-2 md:p-4 bg-black/40 backdrop-blur-lg border border-white/10 text-white rounded-full transition-all duration-300 pointer-events-auto hover:border-[#FF8000] hover:text-[#FF8000] active:scale-90 ${isHoldingRight ? 'scale-110 border-[#FF8000] text-[#FF8000] bg-[#FF8000]/10' : ''}`}
                            onMouseDown={() => setIsHoldingRight(true)}
                            onMouseUp={() => setIsHoldingRight(false)}
                            onMouseLeave={() => setIsHoldingRight(false)}
                            onTouchStart={() => setIsHoldingRight(true)}
                            onTouchEnd={() => setIsHoldingRight(false)}
                        >
                            <svg className="w-6 h-6 md:w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div
                        ref={containerRef}
                        className="flex gap-6 px-6 will-change-transform"
                        style={{ width: "max-content" }}
                    >
                        {/* Render items twice for seamless loop */}
                        {[...filteredAssets, ...filteredAssets].map((asset, index) => (
                            <div
                                key={`${filter}-${index}`}
                                onClick={() => setSelectedImage(asset.name)}
                                className="w-[280px] md:w-[400px] flex-shrink-0 bg-neutral-950 border border-neutral-900 overflow-hidden group hover:border-[#FF8000]/50 transition-all duration-500 cursor-pointer flex flex-col"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-black">
                                    <img
                                        src={ASSET_PATH + asset.name}
                                        alt={asset.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                                        onContextMenu={preventDefault}
                                    />
                                    <div className="absolute inset-0 carbon-pattern opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <span className="px-4 py-2 bg-[#FF8000] text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-xl">
                                            [SECURE_PREVIEW]
                                        </span>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[7px] font-mono text-white/50 uppercase tracking-[0.2em]">
                                            {asset.category.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-bold uppercase text-lg italic leading-tight group-hover:text-[#FF8000] transition-colors">
                                            {asset.title}
                                        </h3>
                                        <span className="text-[8px] font-mono text-neutral-700 mt-1">
                                            #{(index % filteredAssets.length) + 1}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                            TYPE: <span className="text-neutral-300">{asset.tech}</span>
                                        </p>
                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-[#FF8000] animate-pulse transition-colors"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Fades for smoothness */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
                </div>

                {/* Page Footer Actions */}
                <div className="mt-20 flex justify-start">
                    <a
                        href="/#about"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/10 text-white font-semibold rounded-lg hover:border-[#FF8000] hover:text-[#FF8000] transition-all duration-300 group"
                    >
                        <svg className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-[-4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Return to Dashboard
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
