'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Fingerprint, Activity } from 'lucide-react';
import { useReadContract, useWriteContract, useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { localhost } from 'wagmi/chains';
import { VOTING_CONTRACT_ADDRESS } from '@/lib/wagmi';
import VotingABI from '@/lib/VotingManagementABI.json';

type Candidate = { id: number; name: string; party: string; symbol: string };

export default function VoterBallot() {
    const { isConnected } = useAccount();
    const { connect } = useConnect();

    // Read Candidates from Contract
    const { data: candidatesRaw } = useReadContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VotingABI,
        functionName: 'getCandidates',
    });

    const candidates: Candidate[] = candidatesRaw
        ? (candidatesRaw as any[]).map((c: any) => ({
            id: Number(c.id),
            name: c.name,
            party: c.party,
            symbol: c.symbolUrl
        }))
        : [];

    const { writeContract, isPending, isSuccess, data: hash } = useWriteContract();

    const [selected, setSelected] = useState<number | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleVote = () => {
        if (selected === null) return;
        writeContract({
            address: VOTING_CONTRACT_ADDRESS,
            abi: VotingABI,
            functionName: 'castVote',
            args: [BigInt(selected)],
            chainId: localhost.id
        }, {
            onError(error: any) {
                console.error("Write contract error:", error);
                alert(`Error casting vote: ${error.shortMessage || error.message}`);
                setIsConfirming(false); // Reset UI so they can try again or close
            }
        });
    };

    // Auto-connect if not connected for UX
    useEffect(() => {
        if (!isConnected) {
            connect({ connector: injected(), chainId: localhost.id });
        }
    }, [isConnected, connect]);

    if (isSuccess && hash) {
        return (
            <div className="max-w-xl mx-auto mt-20 text-center animate-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-emerald-100/50">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Ballot Secured</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your cryptographic signature has been recorded. This action is irreversible.</p>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm font-mono text-gray-400 mb-10 break-all select-all flex flex-col gap-2">
                    <span className="text-xs font-sans font-semibold text-gray-300 uppercase tracking-widest">Transaction Hash</span>
                    {hash}
                </div>
                <a href="/public" className="btn-primary px-8 py-3.5 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm block">
                    Access Public Transparency Portal
                </a>
            </div>
        );
    }

    if (isConfirming || isPending) {
        const c = candidates.find(c => c.id === selected);
        return (
            <div className="max-w-xl mx-auto mt-12 animate-in slide-in-from-bottom-8 duration-500">
                <div className="text-center mb-10">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Final Step</h2>
                    <p className="text-3xl font-bold tracking-tight text-gray-900 mt-2">Sign Selection</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
                    {isPending && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in">
                            <Activity className="w-16 h-16 mx-auto mb-8 text-black animate-pulse" />
                            <h3 className="text-2xl font-bold tracking-tight mb-3">Signing Payload</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium px-12 text-center">Please confirm the signature request in your wallet extension. The network is awaiting your cryptographic proof.</p>
                            <div className="w-1/2 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-black h-full w-1/3 animate-[pulse_2s_ease-in-out_infinite] rounded-full mx-auto"></div>
                            </div>
                        </div>
                    )}

                    <div className="p-12 text-center bg-gray-50/50 border-b border-gray-100">
                        <div className="text-6xl mb-6 filter drop-shadow-sm">{c?.symbol}</div>
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900">{c?.name}</h3>
                        <p className="text-gray-500 mt-2 font-medium tracking-tight uppercase text-xs">{c?.party}</p>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/80 flex gap-4 items-start">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-amber-900 tracking-tight">Irreversible Action</h4>
                                <p className="text-amber-700/80 text-sm mt-1 leading-relaxed">By signing this payload, your vote is permanently recorded on the immutable ledger. It cannot be altered by anyone.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button disabled={isPending} onClick={() => setIsConfirming(false)} className="px-6 py-4 rounded-full font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">Cancel</button>
                            <button disabled={isPending} onClick={handleVote} className="flex-1 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                                <Fingerprint className="w-5 h-5 text-white/70" /> {isPending ? 'Check Wallet...' : 'Sign Payload'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-700">
            <div className="text-center mb-16 pt-8">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">2026 General Election</p>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900">Official Ballot</h2>
            </div>

            {candidates.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">No candidates available on the ledger. Admin must register them first.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {candidates.map(c => (
                        <div
                            key={c.id}
                            onClick={() => setSelected(c.id)}
                            className={`text-left w-full bg-white rounded-3xl p-6 lg:p-8 cursor-pointer transition-all duration-300 flex items-center gap-6 relative overflow-hidden group border-2 outline-none
                                ${selected === c.id
                                    ? 'border-black shadow-xl ring-4 ring-black/5 scale-[1.02]'
                                    : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-200'}
                            `}
                        >
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-colors duration-300 shrink-0
                                 ${selected === c.id ? 'bg-gray-50 border border-gray-100' : 'bg-gray-50 group-hover:bg-gray-100'}
                            `}>{c.symbol}</div>
                            <div className="flex-1 pr-6 cursor-pointer">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-2">{c.name}</h3>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{c.party}</p>
                            </div>
                            <div className={`absolute right-6 transition-all duration-300 pointer-events-none
                                ${selected === c.id ? 'opacity-100 scale-100 text-black' : 'opacity-0 scale-75 text-transparent'}
                            `}>
                                <CheckCircle2 className="w-8 h-8 fill-black text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sticky Action Footer */}
            <div
                className={`fixed bottom-0 left-0 right-0 p-6 z-20 transition-all duration-500 transform
                    ${selected !== null ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
                `}
            >
                <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl p-4 rounded-[2rem] flex justify-between items-center pr-4 pl-8">
                    <p className="text-sm text-gray-500 font-medium hidden sm:block">1 Selection Made</p>
                    <button
                        disabled={selected === null}
                        onClick={() => setIsConfirming(true)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-black text-white rounded-full font-semibold tracking-wide hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                    >
                        Review Selection <span className="opacity-50 text-xl font-light leading-none">→</span>
                    </button>
                </div>
                {/* Gradient fade behind the dock */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent bottom-0 h-[300px] pointer-events-none transform translate-y-[-100px]"></div>
            </div>
        </div>
    );
}
