'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
    isVisible: boolean;
    onComplete?: () => void;
}

const TELEMETRY_LINES = [
    'INIT_CORE_SYSTEMS...',
    'LOADING_PORTFOLIO_MODULES...',
    'SYNC_DATABASE_CONNECTIONS...',
    'CALIBRATING_UI_RENDER_ENGINE...',
    'COMPILING_PROJECT_TELEMETRY...',
    'ESTABLISHING_SECURE_LINK...',
    'MOUNTING_COMPONENT_TREE...',
    'VERIFYING_ASSET_INTEGRITY...',
    'OPTIMIZING_RENDER_PIPELINE...',
    'ALL_SYSTEMS_NOMINAL.',
];

export default function Loader({ isVisible, onComplete }: LoaderProps) {
    const [progress, setProgress] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);
    const [currentLine, setCurrentLine] = useState(0);
    const [rpm, setRpm] = useState(0);
    const [phase, setPhase] = useState<'boot' | 'ignition' | 'ready'>('boot');
    const [showGrid, setShowGrid] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    // Progress + telemetry line sync
    useEffect(() => {
        if (isVisible && !isLeaving) {
            setProgress(0);
            setCurrentLine(0);
            setRpm(0);
            setPhase('boot');
            setShowGrid(false);

            // Show grid lines after a tiny delay
            const gridTimer = setTimeout(() => setShowGrid(true), 200);

            // Visitor Tracking: One data entry per visit (session)
            // Triggered right at the start of the boot sequence
            if (!sessionStorage.getItem('portfolio_session_tracked')) {
                const trackVisit = async () => {
                    try {
                        const ipRes = await fetch('https://api.ipify.org?format=json');
                        const { ip } = await ipRes.json();

                        await fetch('/api/track', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ clientIp: ip }),
                        });
                        sessionStorage.setItem('portfolio_session_tracked', 'true');
                    } catch (err) {
                        console.error('Tracking system error:', err);
                        // Fallback tracking attempt
                        try {
                            await fetch('/api/track', { method: 'POST' });
                        } catch (e) { }
                    }
                };
                trackVisit();
            }

            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setPhase('ready');
                        setTimeout(() => {
                            setIsLeaving(true);
                            setTimeout(() => {
                                setIsLeaving(false);
                                if (onComplete) onComplete();
                            }, 800);
                        }, 400);
                        return 100;
                    }

                    const next = prev + 1;

                    // Phase transitions
                    if (next > 30 && phase === 'boot') setPhase('ignition');

                    // Sync telemetry lines to progress
                    const lineIndex = Math.floor((next / 100) * TELEMETRY_LINES.length);
                    if (lineIndex !== currentLine && lineIndex < TELEMETRY_LINES.length) {
                        setCurrentLine(lineIndex);
                    }

                    // RPM builds up with progress (simulated tachometer)
                    setRpm(Math.floor((next / 100) * 18000));

                    return next;
                });
            }, 20);

            return () => {
                clearInterval(interval);
                clearTimeout(gridTimer);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, isLeaving]);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [currentLine]);

    if (!isVisible && !isLeaving) return null;

    const rpmDisplay = rpm.toLocaleString();
    const rpmPercent = Math.min((rpm / 18000) * 100, 100);
    const isRedline = rpm > 14000;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isLeaving ? 0 : 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#050505' }}
            >
                {/* Animated grid background */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${showGrid ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Vertical grid lines */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }} />
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }} />

                    {/* Racing stripe accent - left */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        className="absolute top-0 left-[15%] w-[2px] bg-gradient-to-b from-transparent via-red-600/30 to-transparent"
                    />
                    {/* Racing stripe accent - right */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                        className="absolute top-0 right-[15%] w-[2px] bg-gradient-to-b from-transparent via-red-600/30 to-transparent"
                    />

                    {/* Scanner line */}
                    <motion.div
                        initial={{ top: '-2px' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent"
                    />
                </div>

                {/* Corner technical markings */}
                <div className="absolute top-6 left-6 font-mono text-[9px] text-white/15 tracking-widest uppercase space-y-1">
                    <p>SYS_V3.2.1</p>
                    <p>PORTFOLIO://MACASA</p>
                </div>
                <div className="absolute top-6 right-6 font-mono text-[9px] text-white/15 tracking-widest uppercase text-right space-y-1">
                    <p>SEC_LEVEL: A1</p>
                    <p>NODE: PRIMARY</p>
                </div>
                <div className="absolute bottom-6 left-6 font-mono text-[9px] text-white/15 tracking-widest uppercase">
                    <p>LAT: 14.5995° N</p>
                    <p>LONG: 120.9842° E</p>
                </div>
                <div className="absolute bottom-6 right-6 font-mono text-[9px] text-white/15 tracking-widest uppercase text-right">
                    <p>FRAME_RATE: 60FPS</p>
                    <p>RENDER: OPTIMAL</p>
                </div>

                {/* Main content container */}
                <div className="relative z-10 w-full max-w-2xl px-6">
                    {/* Top: Logo + Identity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col items-center mb-10"
                    >
                        {/* Logo with glow pulse */}
                        <div className="relative mb-6">
                            <motion.div
                                animate={{
                                    opacity: [0.05, 0.15, 0.05],
                                    scale: [1, 1.15, 1],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-0 bg-red-600 rounded-full blur-3xl scale-[2.5]"
                            />
                            <div className="relative w-24 h-24">
                                <Image
                                    src="/images/logo.png"
                                    alt="MACASA"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Name reveal */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 'auto' }}
                            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                            className="overflow-hidden"
                        >
                            <h2 className="text-xl font-thin tracking-[0.4em] text-white/60 whitespace-nowrap uppercase">
                                Avery Macasa
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="text-[10px] font-mono text-white/20 tracking-[0.5em] uppercase mt-2"
                        >
                            Portfolio System
                        </motion.p>
                    </motion.div>

                    {/* RPM Tachometer Bar */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-6 origin-left"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">
                                RPM
                            </span>
                            <span className={`text-[11px] font-mono font-bold tracking-wider tabular-nums ${isRedline ? 'text-red-500 animate-pulse' : 'text-white/50'}`}>
                                {rpmDisplay}
                            </span>
                        </div>

                        {/* Segmented RPM bar */}
                        <div className="flex gap-[2px] h-3">
                            {Array.from({ length: 40 }).map((_, i) => {
                                const segPercent = ((i + 1) / 40) * 100;
                                const isActive = rpmPercent >= segPercent;
                                const isHigh = i >= 30; // Last 10 segments = redline zone

                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 transition-all duration-75 ${isActive
                                            ? isHigh
                                                ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                                                : i >= 24
                                                    ? 'bg-yellow-500/80'
                                                    : 'bg-green-500/70'
                                            : 'bg-white/5'
                                            }`}
                                        style={{
                                            clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)',
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* RPM scale labels */}
                        <div className="flex justify-between mt-1 px-[1px]">
                            {[0, 3, 6, 9, 12, 15, 18].map((v) => (
                                <span key={v} className={`text-[7px] font-mono ${v >= 15 ? 'text-red-600/40' : 'text-white/15'}`}>
                                    {v}K
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Terminal / Telemetry Readout */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mb-6"
                    >
                        <div className="border border-white/5 bg-black/60 backdrop-blur-sm">
                            {/* Terminal header */}
                            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600/60" />
                                <span className="text-[8px] font-mono text-white/25 tracking-widest uppercase">SYS_TERMINAL</span>
                                <div className="flex-1" />
                                <span className="text-[8px] font-mono text-white/15 tabular-nums">{progress}%</span>
                            </div>

                            {/* Terminal body */}
                            <div
                                ref={terminalRef}
                                className="p-3 h-[100px] overflow-hidden font-mono text-[10px] leading-5 space-y-0.5"
                            >
                                {TELEMETRY_LINES.slice(0, currentLine + 1).map((line, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-2 ${i === currentLine ? 'text-red-500' : 'text-white/20'}`}
                                    >
                                        <span className="text-white/10 select-none">{`>`}</span>
                                        <span className="tracking-widest uppercase">
                                            {line}
                                            {i === currentLine && progress < 100 && (
                                                <span className="animate-pulse ml-0.5 text-red-500">█</span>
                                            )}
                                        </span>
                                        {i < currentLine && (
                                            <span className="ml-auto text-green-600/40 text-[8px]">[OK]</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom: Main progress bar + status */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                    >
                        {/* Progress bar */}
                        <div className="relative">
                            <div className="h-[3px] bg-white/5 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 relative"
                                    style={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1, ease: 'linear' }}
                                >
                                    {/* Glow at the leading edge */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-4 bg-red-500 blur-md opacity-60" />
                                </motion.div>
                            </div>
                            {/* Tick marks below progress */}
                            <div className="flex justify-between mt-1">
                                {Array.from({ length: 11 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-[1px] transition-colors duration-200 ${i % 5 === 0 ? 'h-2' : 'h-1'} ${progress >= i * 10 ? 'bg-red-600/30' : 'bg-white/5'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Status readout */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${phase === 'ready' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-600 animate-pulse'}`} />
                                <span className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">
                                    {phase === 'boot' && 'INITIALIZING...'}
                                    {phase === 'ignition' && 'SYSTEM BOOT'}
                                    {phase === 'ready' && 'ALL SYSTEMS GO'}
                                </span>
                            </div>
                            <span className="text-[9px] font-mono text-white/20 tracking-widest tabular-nums">
                                {progress.toString().padStart(3, '0')}/100
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Dramatic top/bottom bars for exit */}
                {isLeaving && (
                    <>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: '52%' }}
                            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute top-0 left-0 w-full bg-black z-50"
                        />
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: '52%' }}
                            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute bottom-0 left-0 w-full bg-black z-50"
                        />
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}