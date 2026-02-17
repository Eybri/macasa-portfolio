"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "./Loader";

export default function Footer() {
    const [showLoader, setShowLoader] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLoader(true);
    };

    const handleLoaderComplete = () => {
        setShowLoader(false);
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/');
        }
    };

    return (
        <>
            <footer className="relative bg-[#0a0a0a] text-white py-16 border-t-2 border-red-600/30 overflow-hidden">
                {/* Carbon Pattern Overlay */}
                <div className="absolute inset-0 carbon-pattern opacity-30 pointer-events-none"></div>

                {/* Racing Line Accent */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="space-y-6">
                            <button
                                onClick={handleLogoClick}
                                className="group flex flex-col items-start focus:outline-none"
                                aria-label="Return to home"
                            >
                                <Image
                                    src="/images/logo.png"
                                    alt="MACASA Logo"
                                    width={140}
                                    height={46}
                                    className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="mt-2 h-0.5 w-0 bg-red-600 transition-all duration-500 group-hover:w-full"></div>
                            </button>
                            <div className="space-y-1">
                                <p className="text-[10px] font-mono text-red-600 tracking-[0.3em] uppercase">
                                    Status: <span className="text-white animate-pulse">Online</span>
                                </p>
                                <p className="text-[10px] font-mono text-neutral-600 tracking-[0.3em] uppercase">
                                    System: MACASA_CORE_v1.0
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex justify-center space-x-8">
                                <a href="https://github.com/Eybri" target="_blank" rel="noopener noreferrer" className="group relative text-neutral-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest font-medium">
                                    GitHub
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                </a>
                                <a href="https://www.linkedin.com/in/avery-macasa-902950343/" target="_blank" rel="noopener noreferrer" className="group relative text-neutral-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest font-medium">
                                    LinkedIn
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                </a>
                                <a href="https://www.facebook.com/averytut" target="_blank" rel="noopener noreferrer" className="group relative text-neutral-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest font-medium">
                                    Facebook
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                </a>
                            </div>
                            <p className="text-[10px] text-neutral-500 max-w-xs font-light uppercase tracking-[0.2em] text-center border-t border-neutral-900 pt-4">
                                Driven by code. Fueled by design.
                            </p>
                        </div>

                        <div className="space-y-4 text-right hidden md:block">
                            <div className="font-mono text-[10px] text-neutral-500 space-y-1">
                                <p>COORD: 14.5995° N, 120.9842° E</p>
                                <p>TERMINAL: {pathname.toUpperCase()}</p>
                                <p className="text-neutral-700 uppercase tracking-tighter">Authorized Access Only</p>
                            </div>
                            <div className="text-sm text-neutral-400 font-mono">
                                [© {new Date().getFullYear()}]
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <Loader
                isVisible={showLoader}
                onComplete={handleLoaderComplete}
            />
        </>
    );
}
