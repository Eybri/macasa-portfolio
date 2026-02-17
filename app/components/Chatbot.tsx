"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are the AI Assistant for Avery Macasa's Portfolio.

Avery Macasa is an IT Professional & Full-Stack Developer with expertise in:
- Languages: Python, JavaScript, TypeScript, C#, PHP, Java, SQL
- Frameworks/Technologies: React, Next.js, FastAPI, Flask, Django, Laravel, Nest.js, Three.js, Tailwind CSS
- Databases: PostgreSQL, MongoDB, MS Access, SQL Server
- Portfolio highlights: Lanyard effect, F1-inspired technical design, automated project galleries

Your role:
- Answer questions about Avery's technical skills, professional experience, and projects.
- Be technical yet conversational, reflecting Avery's focus on "Engineering with Precision" (inspired by F1).
- Encourage users to check out the "Projects" section or use the "Contact" form to get in touch.
- If asked about projects, mention features like the 3D Lanyard or the technical language bars.

Rules:
- Professional, technical, and helpful tone.
- Keep responses concise but informative.
- Focus on Avery's expertise and professional value.
`;

interface Message {
    role: "user" | "bot";
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I'm Avery's Technical Assistant. How can I help you explore this portfolio today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [telemetryId, setTelemetryId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setTelemetryId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const buildPrompt = (chatHistory: Message[]) => {
        let prompt = SYSTEM_PROMPT.trim() + "\n\n";

        // We don't have user_summary in this simplified context yet, 
        // but the structure is ready to prepend it if needed.

        chatHistory.forEach((msg) => {
            const role = msg.role === "user" ? "User" : "Assistant";
            prompt += `${role}: ${msg.content}\n`;
        });

        prompt += "Assistant:";
        return prompt;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];

        setInput("");
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Configuration based on reference: gemini-3-flash-preview, temp 0.7, max_tokens 700
            const model = genAI.getGenerativeModel({
                model: "gemini-3-flash-preview",
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 700,
                }
            });

            const fullPrompt = buildPrompt(updatedMessages);
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text().trim();

            setMessages((prev) => [...prev, { role: "bot", content: text }]);
        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "I encountered an error. Please try again so I can help you." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-mono">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="mb-4 w-[320px] sm:w-[380px] h-[500px] bg-black border border-white/20 rounded-none shadow-2xl flex flex-col relative overflow-hidden"
                    >
                        {/* Technical Background Detail */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600 opacity-50" />
                        <div className="absolute bottom-0 right-0 w-[40px] h-[40px] border-r border-b border-red-600/30 pointer-events-none" />

                        {/* Header */}
                        <div className="relative h-12 flex items-center justify-between px-4 bg-zinc-950 overflow-hidden">
                            <div className="absolute inset-0 bg-red-600/10 skew-x-[-15deg] translate-x-[-10px] w-[60%]" />
                            <div className="flex items-center gap-2 relative z-10">
                                <div className="w-1.5 h-1.5 bg-red-600" />
                                <h3 className="text-[10px] font-bold text-white tracking-[0.2em] uppercase italic">
                                    Avery.Telemetry_v3.0
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="relative z-10 p-1 hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Status Bar */}
                        <div className="px-4 py-1.5 border-y border-white/5 bg-zinc-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] text-emerald-500/80 font-medium uppercase tracking-widest">
                                    {API_KEY ? "System Online" : "System Offline"}
                                </span>
                            </div>
                            <span className="text-[8px] text-zinc-600 uppercase tabular-nums">ID: {telemetryId || "LOADING..."}</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scroll-smooth bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:24px_24px]">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className="relative group">
                                        <div
                                            className={`max-w-[100%] py-2 px-3 text-[12px] leading-relaxed relative ${msg.role === "user"
                                                ? "bg-red-600 text-white"
                                                : "bg-zinc-900 text-zinc-300 border border-white/10"
                                                }`}
                                        >
                                            {/* Minimalist Message Accents */}
                                            {msg.role !== "user" && (
                                                <div className="absolute -left-[1px] top-0 w-[2px] h-full bg-red-600/50" />
                                            )}
                                            {msg.content}
                                        </div>
                                        <div className={`text-[8px] mt-1 uppercase text-zinc-600 tabular-nums ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                            {msg.role === "user" ? "USER.TX" : "BOT.RX"} // 0{i + 1}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((d) => (
                                            <motion.div
                                                key={d}
                                                animate={{ opacity: [0.2, 1, 0.2] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }}
                                                className="w-1 h-3 bg-red-600"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-zinc-950 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        placeholder="INPUT COMMAND..."
                                        className="w-full bg-zinc-900 border border-white/5 py-2 px-3 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-600/50 transition-colors uppercase tracking-wider"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-600/20" />
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="h-9 px-4 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2"
                                    style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
                                >
                                    EXECUTE
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center justify-center"
            >
                <div
                    className={`w-14 h-14 transition-all duration-300 flex items-center justify-center ${isOpen ? "bg-zinc-100 text-black rotate-90" : "bg-red-600 text-white"
                        }`}
                    style={{ clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)" }}
                >
                    {isOpen ? <X size={24} /> : <Bot size={24} />}
                </div>
                {!isOpen && (
                    <span className="absolute -left-28 bg-red-600 text-[10px] font-bold px-2 py-1 italic skew-x-[-12deg] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none">
                        System_Proxy
                    </span>
                )}
            </motion.button>
        </div>
    );
}
