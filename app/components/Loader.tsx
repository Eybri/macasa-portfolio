'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTelemetry } from '../context/TelemetryContext';

interface LoaderProps {
    isVisible: boolean;
    onComplete?: () => void;
}

const TELEMETRY_LINES = [
    'INIT_CORE_SYSTEMS...',
    'LOADING_PORTFOLIO_MODULES...',
    'SYNC_DATABASE_CONNECTIONS...',
    'CALIBRATING_UI_RENDER_ENGINE...',
    'FETCHING_GEOLOCATION_DETAILS...',
    'COMPILING_PROJECT_TELEMETRY...',
    'ESTABLISHING_SECURE_LINK...',
    'MOUNTING_COMPONENT_TREE...',
    'VERIFYING_ASSET_INTEGRITY...',
    'OPTIMIZING_RENDER_PIPELINE...',
    'ALL_SYSTEMS_NOMINAL.',
];

export default function Loader({ isVisible, onComplete }: LoaderProps) {
    const { visitorData, fetchStatus } = useTelemetry();
    const [progress, setProgress] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);
    const [currentLine, setCurrentLine] = useState(0);
    const [rpm, setRpm] = useState(0);
    const [phase, setPhase] = useState<'boot' | 'ignition' | 'ready'>('boot');
    const [showGrid, setShowGrid] = useState(false);

    const terminalRef = useRef<HTMLDivElement>(null);

    // Initial grid show
    useEffect(() => {
        if (isVisible) {
            const gridTimer = setTimeout(() => setShowGrid(true), 200);
            return () => clearTimeout(gridTimer);
        }
    }, [isVisible]);

    // Progress + telemetry line sync
    useEffect(() => {
        if (!isVisible || isLeaving) return;

        // Reset local state when starting
        setProgress(0);
        setCurrentLine(0);
        setRpm(0);
        setPhase('boot');

        const interval = setInterval(() => {
            setProgress((prev) => {
                // Use functional update to check fetchStatus without making it a dependency
                // However, fetchStatus is needed for the pause logic. 
                // We'll keep fetchStatus in deps but skip the state resets if isVisible is already true.

                if (prev === 55 && fetchStatus === 'FETCHING') {
                    return prev;
                }

                if (prev >= 100) {
                    clearInterval(interval);
                    setPhase('ready');
                    setTimeout(() => {
                        setIsLeaving(true);
                        setTimeout(() => {
                            setIsLeaving(false);
                            if (onComplete) onComplete();
                        }, 800);
                    }, 4000); // Increased wait time for "All systems nominal" to be seen
                    return 100;
                }

                const next = prev + 1;

                // Phase transitions
                if (next > 30 && phase === 'boot') setPhase('ignition');

                // Sync telemetry lines to progress
                const lineIndex = Math.floor((next / 100) * TELEMETRY_LINES.length);
                // Functional update for currentLine is not possible here as it's a separate state, 
                // but we can compute it from 'next'

                return next;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [isVisible, fetchStatus, onComplete]); // fetchStatus is needed for the 55% pause logic

    // Separate effect to sync currentLine to progress to avoid logic complexity in the interval
    useEffect(() => {
        const lineIndex = Math.floor((progress / 100) * TELEMETRY_LINES.length);
        if (lineIndex !== currentLine && lineIndex < TELEMETRY_LINES.length) {
            setCurrentLine(lineIndex);
        }
        setRpm(Math.floor((progress / 100) * 18000));
    }, [progress, currentLine]);

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [currentLine, fetchStatus]);

    if (!isVisible && !isLeaving) return null;

    const rpmDisplay = rpm.toLocaleString();
    const rpmPercent = Math.min((rpm / 18000) * 100, 100);
    const isRedline = rpm > 14000;

    // Helper to get dynamic telemetry text
    const getTelemetryLine = (line: string) => {
        if (line.includes('FETCHING_GEOLOCATION_DETAILS')) {
            if (fetchStatus === 'FETCHING') return 'FETCHING_GEOLOCATION_DETAILS... [WAITING]';
            if (fetchStatus === 'SUCCESS') return 'GEOLOCATION_RESOLVED: [ENCRYPTED_NODE]';
            if (fetchStatus === 'ERROR') return 'GEOLOCATION_FAILED. USING_LOCAL_DEFAULT.';
        }
        if (line.includes('ESTABLISHING_SECURE_LINK')) {
            if (fetchStatus === 'SUCCESS') return 'SECURE_LINK_ESTABLISHED: [HIDDEN_ID]';
            if (fetchStatus === 'FETCHING') return 'ESTABLISHING_SECURE_LINK... [WAITING]';
        }
        return line;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isLeaving ? 0 : 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#050505' }}
            >
                {/* Animated HD grid background */}
                <div className={`absolute inset-0 transition-opacity duration-1000 overflow-hidden ${showGrid ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Vignette depth mask */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#050505_100%)] z-10 pointer-events-none" />

                    {/* Technical scanning pattern (diagonal hash) */}
                    <div className="absolute inset-0 opacity-[0.015]" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 8px)'
                    }} />

                    {/* HD Micro Grid */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                    }} />

                    {/* Primary Blueprint Grid */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }} />

                    {/* Intersection nodes (Red tracking dots) */}
                    <div className="absolute inset-0 opacity-60" style={{
                        backgroundImage: 'radial-gradient(circle at 0px 0px, rgba(220,38,38,0.8) 1.5px, transparent 2px)',
                        backgroundSize: '80px 80px',
                    }} />

                    {/* Tech accent overlay */}
                    <div className="absolute inset-0 opacity-50 mix-blend-screen bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.1)_0%,transparent_60%)]" />
                    <div className="absolute inset-0 opacity-50 mix-blend-screen bg-[radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,0.06)_0%,transparent_60%)]" />

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
                    <p>LAT: {visitorData ? 'DETECTION_ACTIVE' : '14.5995° N'}</p>
                    <p>LONG: {visitorData ? 'DETECTION_ACTIVE' : '120.9842° E'}</p>
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
                                {TELEMETRY_LINES.slice(0, currentLine + 1).map((line, i) => {
                                    const dynamicLine = getTelemetryLine(line);
                                    const isCurrent = i === currentLine;
                                    const isGeolocationLine = line.includes('FETCHING_GEOLOCATION_DETAILS');
                                    const isSecureLinkLine = line.includes('ESTABLISHING_SECURE_LINK');

                                    let textColor = 'text-white/20';
                                    if (isCurrent) {
                                        textColor = 'text-red-500';
                                    } else if ((isGeolocationLine || isSecureLinkLine) && fetchStatus === 'SUCCESS') {
                                        textColor = 'text-green-500 opacity-80';
                                    } else if (i < currentLine) {
                                        textColor = 'text-white/40';
                                    }

                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-2 ${textColor}`}
                                        >
                                            <span className="text-white/10 select-none">{`>`}</span>
                                            <span className="tracking-widest uppercase transition-colors">
                                                {dynamicLine}
                                                {isCurrent && progress < 100 && (
                                                    <span className="animate-pulse ml-0.5 text-red-500">█</span>
                                                )}
                                            </span>
                                            {i < currentLine && !(isGeolocationLine && fetchStatus === 'FETCHING') && (
                                                <span className={`ml-auto text-[8px] ${fetchStatus === 'ERROR' && isGeolocationLine ? 'text-yellow-600' : 'text-green-600/40'}`}>
                                                    [{fetchStatus === 'ERROR' && isGeolocationLine ? 'FALLBACK' : 'OK'}]
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
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
                                    className={`h-full relative transition-[width] duration-300 ${fetchStatus === 'FETCHING' && progress === 55 ? 'bg-yellow-500 animate-pulse' : 'bg-gradient-to-r from-red-700 via-red-600 to-red-500'}`}
                                    style={{ width: `${progress}%` }}
                                >
                                    {/* Glow at the leading edge */}
                                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-8 h-4 blur-md opacity-60 ${fetchStatus === 'FETCHING' && progress === 55 ? 'bg-yellow-500' : 'bg-red-500'}`} />
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
                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${phase === 'ready' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : fetchStatus === 'FETCHING' && progress === 55 ? 'bg-yellow-500 animate-pulse' : 'bg-red-600 animate-pulse'}`} />
                                <span className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">
                                    {progress === 55 && fetchStatus === 'FETCHING' && 'RESOLVING_TELEMETRY...'}
                                    {progress !== 55 && phase === 'boot' && 'INITIALIZING...'}
                                    {progress !== 55 && phase === 'ignition' && 'SYSTEM BOOT'}
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
