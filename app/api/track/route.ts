import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST() {
    try {
        const headerList = await headers();

        // Extract geolocation data from Vercel headers
        let city = headerList.get('x-vercel-ip-city');
        let region = headerList.get('x-vercel-ip-country-region');
        let country = headerList.get('x-vercel-ip-country');
        const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown';
        const userAgent = headerList.get('user-agent') || 'Unknown';

        // Fallback to an external API if Vercel headers are missing (e.g. local dev with tunnel)
        // Note: This won't work for 127.0.0.1/localhost, but will for public IPs
        if (!city && ip !== 'Unknown' && ip !== '127.0.0.1' && ip !== '::1') {
            try {
                const response = await fetch(`http://ip-api.com/json/${ip}`);
                const data = await response.json();
                if (data.status === 'success') {
                    city = data.city;
                    region = data.regionName;
                    country = data.country;
                }
            } catch (e) {
                console.error('Geolocation fallback failed:', e);
            }
        }

        const visitData = {
            ip,
            city: city || 'Unknown',
            region: region || 'Unknown',
            country: country || 'Unknown',
            userAgent,
            timestamp: new Date().toISOString(),
        };

        // Push to a Redis list
        await kv.lpush('portfolio_visits', JSON.stringify(visitData));

        return NextResponse.json({ success: true, location: visitData });
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json({ success: false, error: 'Failed to record visit' }, { status: 500 });
    }
}
