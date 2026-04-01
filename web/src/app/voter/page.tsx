'use client';
import { useState } from 'react';
import { Wallet, Loader2, Fingerprint } from 'lucide-react';

export default function VoterOnboarding() {
    const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'READY'>('IDLE');

    const handleConnect = () => {
        setStatus('CONNECTING');
        setTimeout(() => {
            setStatus('READY');
            window.location.href = '/voter/ballot';
        }, 1500);
    };

    return (
        <div className="max-w-md mx-auto mt-20 text-center animate-in slide-in-from-bottom-8 fade-in duration-700">
            <div className="w-20 h-20 mx-auto bg-white border border-gray-100 shadow-xl rounded-2xl flex items-center justify-center text-gray-900 mb-8 transform rotate-3">
                <Fingerprint className="w-10 h-10" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Identity Portal</h1>
            <p className="text-gray-500 mb-12">Connect your verified wallet to access the decentralized voting booth.</p>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50">
                {status === 'IDLE' && (
                    <button onClick={handleConnect} className="w-full bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 transition-all py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-black/10">
                        <Wallet className="w-5 h-5" /> Connect Keystore
                    </button>
                )}
                {status === 'CONNECTING' && (
                    <div className="py-4 text-gray-500 flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                        <p className="text-sm font-medium">Authenticating Identity...</p>
                    </div>
                )}
            </div>

            <div className="mt-12 text-xs text-gray-400 max-w-xs mx-auto space-y-2">
                <p>Votes are anonymous, irreversible, and publicly verifiable.</p>
            </div>
        </div>
    );
}
