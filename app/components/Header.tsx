"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const NAV_LINKS = [
        { label: "About", id: "#about" },
        { label: "Projects", id: "#projects" },
        { label: "Contact", id: "#contact" }
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleLogoClick = () => {
        setShowLoader(true);
        setIsMenuOpen(false);
    };

    const handleLoaderComplete = () => {
        setShowLoader(false);
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            router.push('/');
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsMenuOpen(false);

        if (pathname === '/') {
            const element = document.getElementById(id.replace('#', ''));
            if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
            }
        } else {
            router.push('/' + id);
        }
    };

    // The instruction implies adding transitionSettings here, but it's not used in this component.
    // Assuming it's meant for a different component or future use,
    // and placing it here as per the instruction's relative placement.
    const headerClasses = `fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled || isMenuOpen
        ? "bg-black/90 backdrop-blur-md py-3 shadow-sm border-b-2 border-red-600/50"
        : "bg-transparent py-5"
        }`;

    const backdropStyle = {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    };

    const menuStyle = {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '-10px 0 30px -10px rgba(0, 0, 0, 0.3)',
        borderLeft: '1px solid rgba(220, 38, 38, 0.2)',
    };

    return (
        <>
            <header className={headerClasses}>
                <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <button
                        onClick={handleLogoClick}
                        className="hover:opacity-70 transition-opacity relative z-10"
                        aria-label="Reload experience"
                    >
                        <Image
                            src="/images/logo.png"
                            alt="MACASA Logo"
                            width={120}
                            height={40}
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-[0.3em]">
                        {NAV_LINKS.map(({ label, id }) => (
                            <a
                                key={id}
                                href={id}
                                onClick={(e) => handleNavClick(e, id)}
                                className="hover:text-red-600 transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Burger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden relative z-[70] p-2 flex flex-col gap-1.5 group"
                        aria-label="Toggle Menu"
                    >
                        <motion.div
                            animate={isMenuOpen ? { rotate: 45, y: 8, width: "32px" } : { rotate: 0, y: 0, width: "24px" }}
                            className="h-0.5 bg-red-600 rounded-full"
                        />
                        <motion.div
                            animate={isMenuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0, width: "30px" }}
                            className="h-0.5 bg-current rounded-full"
                        />
                        <motion.div
                            animate={isMenuOpen ? { rotate: -45, y: -8, width: "32px" } : { rotate: 0, y: 0, width: "18px" }}
                            className="h-0.5 bg-current rounded-full self-end"
                        />
                    </button>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[65] md:hidden"
                            style={backdropStyle}
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full sm:w-[400px] z-[70] md:hidden flex flex-col pt-32 px-10"
                            style={menuStyle}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 z-[80] p-2 flex flex-col gap-1.5 group"
                                aria-label="Close Menu"
                            >
                                <motion.div
                                    animate={{ rotate: 45, y: 8, width: "32px" }}
                                    className="h-0.5 bg-red-600 rounded-full"
                                />
                                <motion.div
                                    animate={{ opacity: 0, x: -20 }}
                                    className="h-0.5 bg-white rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: -45, y: -8, width: "32px" }}
                                    className="h-0.5 bg-white rounded-full"
                                />
                            </button>

                            {/* Decorations */}
                            <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none mix-blend-overlay" />
                            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-red-600/20 to-transparent pointer-events-none" />

                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-8 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-mono text-white/80 uppercase tracking-[0.5em]">
                                        SECTOR_NAV
                                    </p>
                                    <div className="h-px w-12 bg-red-600" />
                                </div>

                                {NAV_LINKS.map(({ label, id }, idx) => (
                                    <motion.div
                                        key={id}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + idx * 0.1 }}
                                    >
                                        <a
                                            href={id}
                                            onClick={(e) => handleNavClick(e, id)}
                                            className="text-5xl font-black italic uppercase tracking-tighter hover:text-red-600 transition-colors flex items-center gap-4 group"
                                        >
                                            <span className="text-red-600/60 group-hover:text-red-600 text-lg not-italic font-mono">
                                                0{idx + 1}
                                            </span>
                                            <span className="text-white drop-shadow-lg group-hover:text-red-600 transition-colors">
                                                {label}
                                            </span>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>

                            {/* System Status */}
                            <div className="mt-auto pb-12 font-mono text-[10px] text-white/70 flex flex-col space-y-2 relative z-10">
                                <p className="flex justify-between">
                                    <span>STATUS: NAVIGATION_OVERRIDE_ACTIVE</span>
                                    <span className="text-red-600">LINKED</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>LAT_TRACKER: 23.44N / 121.01E</span>
                                    <span>MACASA_V1.0</span>
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Loader isVisible={showLoader} onComplete={handleLoaderComplete} />
        </>
    );
}