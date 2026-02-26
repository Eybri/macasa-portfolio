'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BootProps {
    progress: number;
    currentLine: number;
    telemetryLines: string[];
}

export default function Boot({ progress, currentLine, telemetryLines }: BootProps) {
    return (
        <motion.div
            key="boot-phase"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
        >
            <div className="w-16 h-16 mb-8 relative opacity-20 grayscale">
                <Image
                    src="/images/logo.png"
                    alt="MACASA"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="w-full max-w-md border border-white/10 bg-black/40 p-4 font-mono">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 text-[9px] text-white/30 tracking-tighter">
                    <span>DIAGNOSTIC_MODE_0.1</span>
                    <span>{progress.toString().padStart(3, '0')}</span>
                </div>

                <div className="h-[80px] overflow-hidden text-[10px] space-y-1 text-red-500/60 lowercase">
                    {telemetryLines.slice(0, currentLine + 1).map((line, i) => (
                        <div key={i} className="flex gap-2">
                            <span>{`>>`}</span>
                            <span className="truncate">{line.toLowerCase()}</span>
                        </div>
                    ))}
                    {/* Blinking cursor at the end of diagnostic */}
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-1.5 h-3 bg-red-500/40 ml-1"
                    />
                </div>

                <div className="mt-4 h-[1px] bg-white/5 w-full relative">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-red-600/40"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
            </div>

            <p className="mt-6 text-[8px] font-mono tracking-[0.5em] text-white/10 uppercase italic">
                Initializing Core Systems
            </p>
        </motion.div>
    );
}
