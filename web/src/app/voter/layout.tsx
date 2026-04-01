import Link from 'next/link';
import { UserCircle, Shield, ArrowRight } from 'lucide-react';

export default function VoterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            <header className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold text-sm">C</div>
                        CivicVote
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                            <Shield className="w-3.5 h-3.5" /> End-to-End Encrypted
                        </span>
                        <Link href="/public" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                            Results <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto p-6 sm:p-12 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-gray-100/50 to-transparent pointer-events-none -z-10 blur-3xl"></div>
                {children}
            </main>

            <footer className="py-12 mt-auto text-center border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400">© 2026 Civic Infrastructure. Powered by Immutable Ledger Technology.</p>
            </footer>
        </div>
    );
}
