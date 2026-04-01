import Link from 'next/link';
import { Network, Search, ExternalLink } from 'lucide-react';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
            <header className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">C</div>
                        CivicVote Explorer
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                            Mainnet Active
                        </div>
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" placeholder="Search Txn Hash / Address" className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-mono w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder-gray-400" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 sm:py-16">
                {children}
            </main>

            <footer className="bg-gray-50 py-12 text-center text-xs font-medium text-gray-400 border-t border-gray-100">
                <p className="flex items-center justify-center gap-2">
                    <Network className="w-3.5 h-3.5" /> Data rendered directly from on-chain smart contracts.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                    <Link href="#" className="hover:text-gray-900 transition-colors">Contract Source <ExternalLink className="w-3 h-3 inline pb-0.5" /></Link>
                    <Link href="#" className="hover:text-gray-900 transition-colors">Audit Report <ExternalLink className="w-3 h-3 inline pb-0.5" /></Link>
                </div>
            </footer>
        </div>
    );
}
