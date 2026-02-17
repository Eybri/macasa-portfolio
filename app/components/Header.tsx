"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Loader from "./Loader";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLoader(true);
    };

    const handleLoaderComplete = () => {
        setShowLoader(false);
        // Optionally scroll to top or do something else
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/90 dark:bg-black/90 backdrop-blur-md py-3 shadow-sm border-b-2 border-red-600/50"
                    : "bg-transparent py-5"
                    }`}
            >
                <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <button
                        onClick={handleLogoClick}
                        className="hover:opacity-70 transition-opacity cursor-pointer focus:outline-none"
                        aria-label="Reload experience"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="MACASA Logo"
                            width={120}
                            height={40}
                            className="h-8 md:h-10 w-auto object-contain invert dark:invert-0"
                        />
                    </button>
                    <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-widest">
                        <Link href="#about" className="hover:text-red-600 transition-colors">About</Link>
                        <Link href="#projects" className="hover:text-red-600 transition-colors">Projects</Link>
                        <Link href="#contact" className="hover:text-red-600 transition-colors">Contact</Link>
                    </div>
                    <button className="md:hidden p-2">
                        {/* Mobile menu icon would go here */}
                        <div className="w-6 h-0.5 bg-current mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-current mb-1.5"></div>
                        <div className="w-6 h-0.5 bg-current"></div>
                    </button>
                </nav>
            </header>

            <Loader
                isVisible={showLoader}
                onComplete={handleLoaderComplete}
            />
        </>
    );
}