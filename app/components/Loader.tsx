'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoaderProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export default function Loader({ isVisible, onComplete }: LoaderProps) {
    const [progress, setProgress] = useState(0);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (isVisible && !isLeaving) {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            setIsLeaving(true);
                            setTimeout(() => {
                                setIsLeaving(false);
                                if (onComplete) onComplete();
                            }, 600);
                        }, 200);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 15);

            return () => clearInterval(interval);
        }
    }, [isVisible, onComplete, isLeaving]);

    if (!isVisible && !isLeaving) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${isLeaving ? 'opacity-0 backdrop-blur-0' : 'opacity-100 backdrop-blur-xl'
                }`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }}
        >
            <div className="text-center space-y-8">
                {/* Logo with original colors */}
                <div className="relative">
                    {/* Subtle glow matching logo colors */}
                    <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl scale-150" />

                    {/* Logo container - no inversion, original colors preserved */}
                    <div className="relative w-28 h-28 mx-auto">
                        <Image
                            src="/images/logo.png"
                            alt="MACASA Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Name with subtle font */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-thin tracking-[0.25em] text-white/70">
                        AVERY MACASA
                    </h2>
                </div>

                {/* Subtle loading indicator */}
                <div className="w-48 mx-auto space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] font-mono text-red-600/60 animate-pulse tracking-widest uppercase">System Boot...</span>
                        <span className="text-[10px] font-mono text-white/30 tracking-widest">{progress}%</span>
                    </div>
                    {/* Minimal progress line */}
                    <div className="h-[2px] bg-white/5 overflow-hidden rounded-full relative">
                        <div
                            className="h-full bg-gradient-to-r from-red-600/20 via-red-600 to-red-600/80 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* RPM Grid Style Markers */}
                    <div className="flex justify-between px-1 opacity-20">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className={`w-[1px] h-1 ${progress > (i * 12.5) ? 'bg-red-600' : 'bg-white'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}