import Link from 'next/link';
import { Home, Users, CheckSquare, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#FAFAFA] font-sans">
            {/* Sleek Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col relative z-10">
                <div className="p-8 pb-10">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">C</div>
                        CivicVote Admin
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Home className="w-4 h-4 text-gray-500" /> Dashboard
                    </Link>
                    <Link href="/admin/candidates" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <Users className="w-4 h-4 text-gray-400" /> Candidates
                    </Link>
                    <Link href="/admin/verification" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <CheckSquare className="w-4 h-4 text-gray-400" /> Verification
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-center text-xs text-gray-400 gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                        v2.4.0 • Mainnet
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full overflow-y-auto relative">
                <header className="absolute top-0 right-0 p-8 hidden sm:flex items-center justify-end z-20 pointer-events-none">
                    <span className="text-xs font-semibold tracking-wide bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full flex gap-2 items-center border border-emerald-100/50 backdrop-blur-md pointer-events-auto">
                        <ShieldCheck className="w-4 h-4" /> Secure Connection
                    </span>
                </header>
                <div className="p-10 max-w-6xl mx-auto pt-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
