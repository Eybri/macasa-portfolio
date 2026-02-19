'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                // We use a simple session storage flag to avoid double tracking on navigation within the same session
                // if the layout re-renders (though it shouldn't in Next.js App Router root layout)
                if (!sessionStorage.getItem('visited')) {
                    await fetch('/api/track', {
                        method: 'POST',
                    });
                    sessionStorage.setItem('visited', 'true');
                }
            } catch (error) {
                console.error('Failed to track visit:', error);
            }
        };

        trackVisit();
    }, []);

    return null; // This component doesn't render anything
}
