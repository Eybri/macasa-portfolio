"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface VisitorData {
    ip: string;
    city: string;
    country: string;
}

type FetchStatus = 'IDLE' | 'FETCHING' | 'SUCCESS' | 'ERROR';

interface TelemetryContextType {
    visitorData: VisitorData | null;
    fetchStatus: FetchStatus;
    trackVisit: () => Promise<void>;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
    const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
    const [fetchStatus, setFetchStatus] = useState<FetchStatus>('IDLE');
    const hasTracked = useRef(false);

    useEffect(() => {
        // Run on mount
        const loadTelemetry = async () => {
            if (hasTracked.current) return;
            hasTracked.current = true;

            // 1. Check Session Storage first
            const cached = sessionStorage.getItem('visitor_telemetry');
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    setVisitorData(data);
                    setFetchStatus('SUCCESS');
                    return;
                } catch (e) {
                    console.error('Failed to parse cached telemetry:', e);
                }
            }

            // 2. Fetch fresh data if no cache
            setFetchStatus('FETCHING');
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const { ip } = await ipRes.json();

                const trackRes = await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ clientIp: ip }),
                });
                const data = await trackRes.json();

                if (data.success && data.location) {
                    const telemetry = {
                        ip: data.location.ip,
                        city: data.location.city,
                        country: data.location.country
                    };
                    setVisitorData(telemetry);
                    setFetchStatus('SUCCESS');
                    sessionStorage.setItem('visitor_telemetry', JSON.stringify(telemetry));
                } else {
                    setFetchStatus('ERROR');
                }
            } catch (err) {
                console.error('Tracking system error:', err);
                setFetchStatus('ERROR');
                // Fallback tracking attempt (no body)
                try {
                    await fetch('/api/track', { method: 'POST' });
                } catch (e) { }
            }
        };

        loadTelemetry();
    }, []);

    const trackVisit = async () => {
        // Redundant trigger if needed, but normally handled by useEffect mount
    };

    return (
        <TelemetryContext.Provider value={{ visitorData, fetchStatus, trackVisit }}>
            {children}
        </TelemetryContext.Provider>
    );
}

export function useTelemetry() {
    const context = useContext(TelemetryContext);
    if (context === undefined) {
        throw new Error('useTelemetry must be used within a TelemetryProvider');
    }
    return context;
}
