'use client';
import { useEffect, useState } from 'react';
import Lanyard from './Lanyard'; // Adjust the import path based on where you saved the Lanyard component

export default function Hero() {
    const [typedText, setTypedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const roles = ['Software Developer', 'Full Stack', 'UI/UX Designer'];

    useEffect(() => {
        const currentRole = roles[currentIndex];
        let charIndex = 0;
        let isDeleting = false;
        let timeout: NodeJS.Timeout;

        const type = () => {
            if (!isDeleting && charIndex <= currentRole.length) {
                setTypedText(currentRole.substring(0, charIndex));
                charIndex++;
                timeout = setTimeout(type, 100);
            } else if (!isDeleting && charIndex > currentRole.length) {
                timeout = setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 2000);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTypedText(currentRole.substring(0, charIndex));
                timeout = setTimeout(type, 50);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                setCurrentIndex((prev) => (prev + 1) % roles.length);
            }
        };

        type();

        return () => clearTimeout(timeout);
    }, [currentIndex]);

    return (
        <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] pt-20">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Carbon Fiber Pattern Overlay */}
                <div className="absolute inset-0 carbon-pattern opacity-40"></div>

                {/* F1 Scanner Line */}
                <div className="f1-scanner"></div>

                {/* Starting Grid Pattern (Subtle) */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '100px 100px'
                    }}>
                </div>

                {/* Background Blurs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF8000]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-900/60 rounded-full blur-[100px]"></div>

                {/* Technical Telemetry Data */}
                <div className="absolute top-10 left-10 text-[10px] font-mono text-neutral-600 space-y-1 hidden md:block uppercase tracking-widest">
                    <p>SYSTEM.STATUS: OPTIMAL</p>
                    <p>SECTOR_01: 24.102s</p>
                    <p>SECTOR_02: 38.441s</p>
                </div>
                <div className="absolute top-10 right-10 text-[10px] font-mono text-neutral-600 space-y-1 hidden md:block uppercase tracking-widest text-right">
                    <p>DRS: ENABLED</p>
                    <p>ERS_MODE: OVERTAKE</p>
                    <p>VER: 2026.02.16</p>
                </div>
                <div className="absolute bottom-10 left-10 text-[10px] font-mono text-neutral-600 hidden md:block uppercase tracking-widest">
                    <p>COORD: 14.5995° N, 120.9842° E</p>
                </div>
            </div>

            {/* Lanyard Overlay - Absolute positioned to cover the whole section */}
            <div className="absolute inset-0 z-50 pointer-events-none">
                <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">

                    {/* Left Content - Column 1 */}
                    <div className="space-y-8 text-left flex flex-col justify-center">
                        {/* ... existing content ... */}
                        <div className="space-y-6">
                            <p className="text-base text-neutral-400 font-light tracking-wide">
                                Hey, I am
                            </p>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                                Avery Macasa
                            </h1>

                            <div className="text-xl md:text-2xl text-neutral-400 font-light flex items-center flex-wrap">
                                <span className="mr-2 whitespace-nowrap">and I'm a</span>
                                <span className="text-[#FF8000] font-semibold whitespace-nowrap">
                                    {typedText}
                                    <span className="animate-pulse ml-0.5">|</span>
                                </span>
                            </div>
                        </div>

                        <a
                            href="/Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                // Optional: Add analytics tracking here
                                console.log('Resume viewed');
                                // You could also track this with Google Analytics, etc.
                            }}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#FF8000] text-white font-semibold rounded-lg hover:bg-[#FF8000] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF8000]/50 w-fit cursor-pointer"
                        >
                            View CV
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </a>

                        {/* Social Icons */}
                        <div className="flex items-center gap-6 pt-4">
                            <p className="text-sm text-neutral-500 font-light">my socials</p>
                            <div className="flex items-center gap-5">
                                <a href="https://www.facebook.com/averytut" className="text-neutral-400 hover:text-[#FF8000] transition-all duration-300 hover:scale-110" aria-label="Facebook">
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/in/avery-macasa-902950343/" className="text-neutral-400 hover:text-[#FF8000] transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href="https://github.com/Eybri" className="text-neutral-400 hover:text-[#FF8000] transition-all duration-300 hover:scale-110" aria-label="GitHub">
                                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Center Content - Column 2 Spacer */}
                    <div className="relative flex items-center justify-center h-[500px] md:h-[550px] lg:h-[600px] pointer-events-none">
                        {/* Empty spacer to keep grid layout, Lanyard is now in absolute overlay */}
                    </div>

                    {/* Right Content - Column 3 */}
                    <div className="space-y-8 text-left flex flex-col justify-center">
                        <div className="space-y-4">
                            <p className="text-[#FF8000] text-sm font-bold uppercase tracking-[0.2em]">
                                Aspiring
                            </p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                                Software<br />Developer
                            </h2>
                        </div>

                        <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-light">
                            A highly motivated <span className="text-white font-semibold">Programmer</span> fresh graduate seeking an entry-level position where I can apply my technical knowledge and continue to develop my skills in a professional environment.
                        </p>

                        <p className="text-neutral-300 text-base md:text-lg font-light">
                            <span className="text-[#FF8000] font-bold">Tech</span> is my passion. <span className="text-[#FF8000] font-bold">Building</span> is my drive.
                        </p>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">Scroll to pits</span>
                <div className="w-[2px] h-16 bg-neutral-900 relative overflow-hidden rounded-full">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FF8000] animate-[bounce_2s_infinite]"></div>
                </div>
            </div>
        </section>
    );
}