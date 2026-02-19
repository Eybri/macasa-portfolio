'use client';

import { useState, useEffect } from 'react';
import Loader from './Loader';

interface PageWrapperProps {
    children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
    const [showLoader, setShowLoader] = useState(true);
    const [contentReady, setContentReady] = useState(false);

    useEffect(() => {
        // Small delay to ensure hydration is complete
        const timer = setTimeout(() => setContentReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {contentReady && (
                <Loader
                    isVisible={showLoader}
                    onComplete={() => setShowLoader(false)}
                />
            )}
            <div
                className={`transition-opacity duration-500 ${showLoader ? 'opacity-0' : 'opacity-100'}`}
            >
                {children}
            </div>
        </>
    );
}
