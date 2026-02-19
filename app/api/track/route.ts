import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const headerList = await headers();
        let clientIpData = '';

        try {
            const body = await req.json();
            clientIpData = body.clientIp;
        } catch (e) {
            // No body or not JSON, fallback to headers
        }

        // Extract geolocation data from Vercel headers
        let city = headerList.get('x-vercel-ip-city');
        let region = headerList.get('x-vercel-ip-country-region');
        let country = headerList.get('x-vercel-ip-country');

        // Prioritize client-provided IP for detection, fallback to headers
        const ip = clientIpData || headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown';
        const userAgent = headerList.get('user-agent') || 'Unknown';

        // Fallback to an external API if Vercel headers are missing (important for local development)
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
