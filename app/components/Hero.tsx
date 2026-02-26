'use client';
import { useEffect, useState, useRef } from 'react';
import Lanyard from './Lanyard';
import ScrollReveal from './ScrollReveal';

/* ------------------------------------------------------------------
   Animated noise / grain overlay – pure CSS data-URI
   ------------------------------------------------------------------ */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

/* ------------------------------------------------------------------
   Tiny Spark particle (purely decorative, rendered via canvas)
   ------------------------------------------------------------------ */
interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; hue: number; size: number; }

function SparkCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    const sparks = useRef<Spark[]>([]);
    const raf = useRef<number>(0);

    useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext('2d')!;
        let W = 0, H = 0;

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const spawn = () => {
            const side = Math.random();
            let x: number, y: number, vx: number, vy: number;
            if (side < 0.5) { x = Math.random() * W; y = H + 4; vx = (Math.random() - 0.5) * 0.6; vy = -(Math.random() * 0.8 + 0.3); }
            else { x = Math.random() < 0.5 ? -4 : W + 4; y = Math.random() * H; vx = (x < 0 ? 1 : -1) * (Math.random() * 0.5 + 0.2); vy = -(Math.random() * 0.6); }
            const maxLife = 180 + Math.random() * 200;
            sparks.current.push({ x, y, vx, vy, life: 0, maxLife, hue: Math.random() < 0.7 ? 0 : 30, size: Math.random() * 1.5 + 0.5 });
        };

        let frame = 0;
        const loop = () => {
            ctx.clearRect(0, 0, W, H);
            frame++;
            if (frame % 8 === 0 && sparks.current.length < 60) spawn();

            sparks.current = sparks.current.filter(s => s.life < s.maxLife);
            for (const s of sparks.current) {
                s.life++;
                s.x += s.vx;
                s.y += s.vy;
                s.vy *= 0.999;
                const t = s.life / s.maxLife;
                const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${s.hue}, 90%, 60%, ${alpha * 0.55})`;
                ctx.fill();
            }
            raf.current = requestAnimationFrame(loop);
        };
        loop();

        return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ------------------------------------------------------------------
   Live clock / telemetry strip
   ------------------------------------------------------------------ */
function LiveTelemetry() {
    const [time, setTime] = useState('');
    const [lap, setLap] = useState('0.000');
    const [rpm, setRpm] = useState(11200);
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setLap(((Math.random() * 0.5) + 22.1).toFixed(3));
            setRpm(prev => Math.min(13500, Math.max(9800, prev + (Math.random() - 0.48) * 300)));
            setSpeed(prev => Math.min(340, Math.max(120, prev + (Math.random() - 0.48) * 18)));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <>
            {/* Top-left telemetry */}
            <div className="absolute top-10 left-10 text-[10px] font-mono text-neutral-500 space-y-1 hidden md:block uppercase tracking-widest z-20">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-green-500">SYSTEM NOMINAL</span>
                </div>
                <p>SECTOR_01 <span className="text-neutral-400">24.102s</span></p>
                <p>SECTOR_02 <span className="text-neutral-400">38.441s</span></p>
                <p>LAP_DELTA <span className="text-red-500">+{lap}s</span></p>
            </div>

            {/* Top-right telemetry */}
            <div className="absolute top-10 right-10 text-[10px] font-mono text-neutral-500 space-y-1 hidden md:block uppercase tracking-widest text-right z-20">
                <p className="text-red-500 font-bold">TIME {time}</p>
                <p>DRS <span className="text-green-400">ENABLED</span></p>
                <p>ERS_MODE <span className="text-yellow-400">OVERTAKE</span></p>
                <p>RPM <span className="text-neutral-300">{Math.round(rpm).toLocaleString()}</span></p>
                <p>SPEED <span className="text-neutral-300">{Math.round(speed)} km/h</span></p>
            </div>

            {/* Bottom-left coords */}
            <div className="absolute bottom-10 left-10 text-[10px] font-mono text-neutral-600 hidden md:block uppercase tracking-widest z-20">
                <p>COORD: 14.5995° N, 120.9842° E</p>
                <p className="text-neutral-700">BUILD: v2026.02.26-RACE</p>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------
   RPM / Rev-light bar strip  
   ------------------------------------------------------------------ */
function RevBar() {
    const [pct, setPct] = useState(0.68);
    useEffect(() => {
        const id = setInterval(() => {
            setPct(p => Math.max(0.35, Math.min(1, p + (Math.random() - 0.47) * 0.06)));
        }, 400);
        return () => clearInterval(id);
    }, []);
    const lights = 16;
    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-[3px] pt-3 z-30 hidden md:flex">
            {Array.from({ length: lights }).map((_, i) => {
                const ratio = i / (lights - 1);
                const lit = ratio <= pct;
                let color = 'bg-green-500';
                if (ratio > 0.55) color = 'bg-yellow-400';
                if (ratio > 0.82) color = 'bg-red-500';
                if (ratio > 0.94) color = pct > 0.95 ? 'bg-fuchsia-400 animate-pulse' : 'bg-neutral-800';
                return (
                    <div
                        key={i}
                        className={`w-2.5 h-2 rounded-sm transition-all duration-150 ${lit ? color + ' shadow-[0_0_6px_currentColor]' : 'bg-neutral-800/60'}`}
                    />
                );
            })}
        </div>
    );
}

/* ------------------------------------------------------------------
   Typing text hook
   ------------------------------------------------------------------ */
function useTypingEffect(roles: string[]) {
    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const role = roles[index];
        let char = 0, deleting = false;
        let t: NodeJS.Timeout;
        const tick = () => {
            if (!deleting && char <= role.length) { setText(role.substring(0, char++)); t = setTimeout(tick, 95); }
            else if (!deleting) { t = setTimeout(() => { deleting = true; tick(); }, 2200); }
            else if (deleting && char > 0) { char--; setText(role.substring(0, char)); t = setTimeout(tick, 45); }
            else { deleting = false; setIndex(p => (p + 1) % roles.length); }
        };
        tick();
        return () => clearTimeout(t);
    }, [index]);
    return text;
}

/* ------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------ */
export default function Hero() {
    const roles = ['Software Developer', 'Full Stack Engineer', 'UI/UX Designer'];
    const typedText = useTypingEffect(roles);

    return (
        <section
            id="hero-section"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808] pt-20"
        >
            {/* ── Background layers ─────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none">

                {/* Grain overlay */}
                <div
                    className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
                    style={{ backgroundImage: NOISE_SVG, backgroundSize: '256px 256px' }}
                />

                {/* Carbon-fibre weave */}
                <div className="absolute inset-0 carbon-pattern opacity-30" />

                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Deep radial glow — red core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-700/10 rounded-full blur-[140px]" />

                {/* Accent glow — amber warm */}
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/6 rounded-full blur-[100px]" />

                {/* Bottom-right cool accent */}
                <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-rose-900/10 rounded-full blur-[90px]" />

                {/* Horizontal speed line — left */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

                {/* Horizontal speed line — right */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-[1px] bg-gradient-to-l from-transparent via-red-600/40 to-transparent" />

                {/* Scanner sweep */}
                <div className="f1-scanner" />

                {/* Diagonal accent stripe */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 1px, transparent 1px, transparent 60px)',
                    }}
                />

                {/* Spark particles */}
                <SparkCanvas />
            </div>

            {/* ── Rev-light bar ─────────────────────────────────────────── */}
            <RevBar />

            {/* ── Live telemetry ────────────────────────────────────────── */}
            <LiveTelemetry />

            {/* ── Lanyard overlay ───────────────────────────────────────── */}
            <div className="absolute inset-0 z-50 pointer-events-none">
                <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
            </div>

            {/* ── Main content ──────────────────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">

                    {/* Column 1 — Left */}
                    <ScrollReveal direction="right" delay={0.2} duration={1}>
                        <div className="space-y-8 text-left flex flex-col justify-center">

                            <div className="space-y-5">
                                {/* Pill badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-600/30 bg-red-600/5 w-fit">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[11px] font-mono text-red-400 uppercase tracking-[0.18em]">Available for hire</span>
                                </div>

                                <p className="text-sm text-neutral-500 font-light tracking-widest uppercase">Hey, I am</p>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tighter">
                                    Avery<br />
                                    <span className="relative inline-block">
                                        Macasa
                                        {/* underline decoration */}
                                        <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 to-orange-500 rounded-full" />
                                    </span>
                                </h1>

                                <div className="text-xl md:text-2xl text-neutral-400 font-light flex items-center flex-wrap gap-x-2">
                                    <span className="whitespace-nowrap">and I&apos;m a</span>
                                    <span className="text-red-500 font-semibold whitespace-nowrap">
                                        {typedText}
                                        <span className="animate-pulse ml-0.5 text-red-400">|</span>
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <a
                                href="/Resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-transparent border border-red-600/70 text-white text-sm font-semibold rounded-lg
                           hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:scale-[1.03]
                           hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] w-fit relative overflow-hidden"
                            >
                                {/* shimmer */}
                                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <span className="relative">View CV</span>
                                <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </a>

                            {/* Socials */}
                            <div className="flex items-center gap-5 pt-2">
                                <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-widest">socials</p>
                                <div className="w-px h-4 bg-neutral-800" />
                                <div className="flex items-center gap-4">
                                    {[
                                        { href: 'https://www.facebook.com/averytut', label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                                        { href: 'https://www.linkedin.com/in/avery-macasa-902950343/', label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                                        { href: 'https://github.com/Eybri', label: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                                    ].map(({ href, label, path }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            aria-label={label}
                                            className="group relative text-neutral-500 hover:text-red-500 transition-all duration-300 hover:scale-110"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={path} />
                                            </svg>
                                            <span className="absolute -inset-2 rounded-full bg-red-600/0 group-hover:bg-red-600/10 transition-colors duration-300" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Column 2 — spacer for Lanyard */}
                    <div className="relative flex items-center justify-center h-[500px] md:h-[550px] lg:h-[600px] pointer-events-none" />

                    {/* Column 3 — Right */}
                    <ScrollReveal direction="left" delay={0.4} duration={1}>
                        <div className="space-y-7 text-left flex flex-col justify-center">

                            {/* Overline */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[2px] bg-red-600 rounded-full" />
                                <p className="text-red-500 text-[11px] font-bold uppercase tracking-[0.22em] font-mono">Aspiring</p>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tighter">
                                Software<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Developer</span>
                            </h2>

                            <p className="text-neutral-400 text-base leading-relaxed font-light border-l-2 border-red-600/40 pl-4">
                                An <span className="text-white font-semibold">IT student</span> who builds full stack applications and crafts clean, thoughtful designs on the side.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ── Scroll indicator ──────────────────────────────────────── */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.3em]">Scroll to pits</span>
                <div className="w-[1px] h-14 bg-neutral-900 relative overflow-hidden rounded-full">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-600 to-transparent animate-[bounce_2s_infinite] rounded-full" />
                </div>
            </div>
        </section>
    );
}