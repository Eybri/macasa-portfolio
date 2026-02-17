"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('SUCCESS');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTimeout(() => setStatus('IDLE'), 5000);
            } else {
                setStatus('ERROR');
                setTimeout(() => setStatus('IDLE'), 5000);
            }
        } catch (error) {
            console.error('Transmission error:', error);
            setStatus('ERROR');
            setTimeout(() => setStatus('IDLE'), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <section id="contact" className="relative py-16 md:py-24 bg-[#0a0a0a] overflow-hidden">
            <div className="absolute inset-0 carbon-pattern opacity-20 pointer-events-none"></div>

            {/* Technical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                    <div className="h-0.5 w-8 md:w-12 bg-red-600"></div>
                    <h2 className="text-[10px] md:text-sm font-mono text-red-600 uppercase tracking-[0.3em] md:tracking-[0.5em]">
                        Sector_05: Transmission_Interface
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
                    {/* Left Side: Technical Info */}
                    <div className="space-y-8 md:space-y-12">
                        <div>
                            <h3 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 md:mb-6">
                                ESTABLISH <span className="text-red-600">COMMS</span>
                            </h3>
                            <p className="text-neutral-400 text-sm md:text-lg font-light max-w-md leading-relaxed">
                                Open a direct line for technical collaborations, inquiries, or feedback.
                                Secure transmission protocol active.
                            </p>
                        </div>

                        <div className="space-y-4 md:space-y-6 font-mono text-[8px] md:text-[10px] tracking-widest uppercase">
                            <div className="p-3 md:p-4 border border-neutral-900 bg-neutral-950/50 backdrop-blur-sm space-y-1 md:space-y-2">
                                <p className="text-red-600 text-[10px] md:text-xs font-bold">// CONTACT_INFO</p>
                                <p className="text-white text-xs md:text-sm">EMAIL: averymikasa@gmail.com</p>
                                <p className="text-neutral-500 text-xs md:text-sm">LOCATION: MANILA, PH</p>
                            </div>

                            <div className="p-3 md:p-4 border border-neutral-900 bg-neutral-950/50 backdrop-blur-sm space-y-1 md:space-y-2">
                                <p className="text-red-600 text-[10px] md:text-xs font-bold">// SYSTEM_METADATA</p>
                                <p className="text-neutral-500 text-xs md:text-sm">ENCRYPTION: AES-256 (SIMULATED)</p>
                                <p className="text-neutral-500 text-xs md:text-sm">LATENCY: &lt;50MS_OPTIMIZED</p>
                                <p className="text-neutral-500 text-xs md:text-sm">HANDSHAKE: ACTIVE</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur-2xl opacity-50"></div>

                        <form onSubmit={handleSubmit} className="relative space-y-3 md:space-y-4 p-4 sm:p-6 md:p-8 bg-neutral-950 border border-neutral-900">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div className="space-y-1">
                                    <label className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest pl-1">
                                        Identifier [Name]
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="INPUT_NAME"
                                        className="w-full bg-black border border-neutral-800 p-2 md:p-3 text-xs md:text-sm focus:border-red-600 outline-none transition-all font-mono text-white placeholder:text-neutral-800"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest pl-1">
                                        Protocol [Email]
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="USER@DOMAIN.COM"
                                        className="w-full bg-black border border-neutral-800 p-2 md:p-3 text-xs md:text-sm focus:border-red-600 outline-none transition-all font-mono text-white placeholder:text-neutral-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest pl-1">
                                    Header [Subject]
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="TRANSMISSION_SUBJECT"
                                    className="w-full bg-black border border-neutral-800 p-2 md:p-3 text-xs md:text-sm focus:border-red-600 outline-none transition-all font-mono text-white placeholder:text-neutral-800"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest pl-1">
                                    Payload [Message]
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="ENTER_TRANSMISSION_DETAILS..."
                                    className="w-full bg-black border border-neutral-800 p-2 md:p-3 text-xs md:text-sm focus:border-red-600 outline-none transition-all font-mono text-white placeholder:text-neutral-800 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status !== 'IDLE'}
                                className="group w-full py-3 md:py-4 px-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-2 md:gap-3 min-h-[48px]"
                            >
                                {status === 'IDLE' && (
                                    <span className="flex items-center gap-2 whitespace-nowrap">
                                        INITIALIZE_TRANSMISSION
                                        <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                                {status === 'SENDING' && (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin flex-shrink-0"></div>
                                        <span className="whitespace-nowrap">UPLOADING_PAYLOAD...</span>
                                    </span>
                                )}
                                {status === 'SUCCESS' && (
                                    <span className="whitespace-nowrap">TRANSMISSION_RECEIVED</span>
                                )}
                                {status === 'ERROR' && (
                                    <span className="whitespace-nowrap">TRANSMISSION_FAILED</span>
                                )}
                            </button>

                            <AnimatePresence>
                                {status === 'SUCCESS' && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[8px] md:text-[10px] font-mono text-green-500 text-center uppercase tracking-widest"
                                    >
                                        [Confirmed] Payload successfully delivered to central hub.
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}