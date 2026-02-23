'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    distance?: number;
    className?: string;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 50,
    className = "",
    once = true
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

    const getInitialProps = () => {
        if (direction === 'none') return { opacity: 0 };

        const x = direction === 'left' ? distance : direction === 'right' ? -distance : 0;
        const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0;

        return {
            opacity: 0,
            x,
            y
        };
    };

    return (
        <motion.div
            ref={ref}
            initial={getInitialProps()}
            animate={isInView ? {
                opacity: 1,
                x: 0,
                y: 0
            } : getInitialProps()}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
