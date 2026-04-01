'use client';
import Link from 'next/link';
import { Fingerprint, ShieldCheck, Activity, ArrowRight, Layers } from 'lucide-react';

export default function Home() {
    return (
        <div className="relative min-h-screen bg-gray-50 flex flex-col justify-center overflow-hidden">
            {/* Ambient Background Grid & Spline */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 from-20% via-transparent to-transparent z-10"></div>

                {/* 3D Spline Backdrop for Premium Feel */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-60 translate-x-1/4 -translate-y-1/4 z-0">
                    <iframe src='https://my.spline.design/iW-0u3L3cIxy6g8S/' frameBorder='0' width='100%' height='100%'></iframe>
                </div>
            </div>

            {/* Navigation Layer */}
            <nav className="absolute top-0 w-full p-8 z-30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xl shadow-black/10">
                        <Layers className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Decentralized Voting</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                    <Link href="/public" className="hover:text-black transition-colors">Public Ledger</Link>
                    <Link href="/admin" className="hover:text-black transition-colors">Admin Access</Link>
                </div>
            </nav>

            <main className="relative z-20 max-w-6xl mx-auto px-6 pt-20 pb-32 flex-1 flex items-center">
                <div>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6 max-w-2xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
                        The future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">democratic consensus.</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-150 fade-in leading-relaxed">
                        A fully immutable, transparent, and secure voting architecture powered by Ethereum Smart Contracts. Verify your identity, cast your ballot, and audit the results in real-time.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-12 duration-700 delay-300 fade-in">
                        {/* Voter Portal */}
                        <Link href="/voter" className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
                            <div>
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Fingerprint className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Voter Portal</h2>
                                <p className="text-sm text-gray-500 leading-relaxed mt-2">
                                    Connect your wallet, verify your cryptographic identity, and securely cast an immutable vote.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Link>

                        {/* Admin Panel */}
                        <Link href="/admin" className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-500 flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110 duration-500"></div>
                            <div>
                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admin Control</h2>
                                <p className="text-sm text-gray-500 leading-relaxed mt-2">
                                    Election authorities can whitelist identities, manage candidate registries, and control election phases.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                Enter Operations <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Link>

                        {/* Public Transparency */}
                        <Link href="/public" className="group relative bg-black rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between overflow-hidden text-white">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-gray-800 text-white border border-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <Activity className="w-7 h-7" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-white">Transparency Ledger</h2>
                                <p className="text-sm text-gray-400 leading-relaxed mt-2">
                                    Real-time synchronized public view of the smart contract state, verified directly from the blockchain.
                                </p>
                            </div>
                            <div className="relative z-10 mt-8 flex items-center font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                View Ledger <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
