import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative bg-[#0a0a0a] text-white py-16 border-t-2 border-red-600/30 overflow-hidden">
            {/* Carbon Pattern Overlay */}
            <div className="absolute inset-0 carbon-pattern opacity-30 pointer-events-none"></div>

            {/* Racing Line Accent */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-black tracking-tighter italic">
                            MACASA<span className="text-red-600">.</span>
                        </Link>
                        <p className="text-sm text-neutral-500 max-w-xs font-light uppercase tracking-widest">
                            DRIVEN BY CODE. FUELED BY DESIGN.
                        </p>
                    </div>

                    <div className="flex justify-center space-x-8">
                        <a href="https://github.com/Eybri" className="group relative text-neutral-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest">
                            GitHub
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="https://www.linkedin.com/in/avery-macasa-902950343/" className="group relative text-neutral-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest">
                            LinkedIn
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="https://www.facebook.com/averytut" className="group relative text-neutral-400 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest">
                            Facebook
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                        </a>
                    </div>

                    <div className="text-sm text-neutral-500 font-mono text-right hidden md:block">
                        <p className="">[© {new Date().getFullYear()}]</p>
                        <p className="mt-1">MACASA_OS_v1.0</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
