'use client';
import { useState, useEffect } from 'react';
import { Plus, User, Info, CheckCircle2, Loader2, Link } from 'lucide-react';
import { useWriteContract, useReadContract, useAccount, useConnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { localhost } from 'wagmi/chains';
import { VOTING_CONTRACT_ADDRESS } from '@/lib/wagmi';
import VotingABI from '@/lib/VotingManagementABI.json';

type Candidate = { name: string; party: string; symbolUrl: string };

export default function CandidateManagement() {
    const { address, isConnected, chainId } = useAccount();
    const { connect } = useConnect();
    const { switchChain } = useSwitchChain();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Read Candidates from Contract
    const { data: candidatesRaw, refetch } = useReadContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VotingABI,
        functionName: 'getCandidates',
    });

    const { writeContract, isPending } = useWriteContract();

    // Convert blockchain array to local representation
    const displayedCandidates: Candidate[] = candidatesRaw
        ? (candidatesRaw as any[]).map((c: any) => ({
            name: c.name,
            party: c.party,
            symbolUrl: c.symbolUrl
        }))
        : [];

    const [newCandidate, setNewCandidate] = useState({ name: '', party: '', symbol: '' });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) return;

        writeContract({
            address: VOTING_CONTRACT_ADDRESS,
            abi: VotingABI,
            functionName: 'addCandidate',
            args: [newCandidate.name, newCandidate.party, newCandidate.symbol],
            chainId: localhost.id
        }, {
            onSuccess(data) {
                setNewCandidate({ name: '', party: '', symbol: '' });
                refetch();
            },
            onError(error: any) {
                console.error("Write contract error:", error);
                alert(`Error registering candidate: ${error.shortMessage || error.message}`);
            }
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Candidates</h1>
                    <p className="text-gray-500 mt-2 text-sm">Manage the official election ballot registry.</p>
                </div>
                <div className="flex items-center gap-3">
                    {(!isMounted || !isConnected) && (
                        <button onClick={() => connect({ connector: injected(), chainId: localhost.id })} className="text-sm font-medium px-4 py-2 bg-black text-white rounded-full flex gap-2 items-center shadow-lg shadow-black/10 hover:bg-gray-800 transition-colors">
                            <Link className="w-4 h-4" /> Connect Admin Wallet
                        </button>
                    )}
                    <div className="flex items-center gap-3 text-sm font-medium px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                        <Info className="w-4 h-4" /> REGISTRATION OPEN
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 tracking-tight">
                        <Plus className="w-5 h-5 text-gray-400" /> New Candidate
                    </h2>
                    <form onSubmit={handleAdd} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Legal Name</label>
                            <input
                                required
                                value={newCandidate.name}
                                onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
                                type="text"
                                className="w-full border-b border-gray-200 py-2 pt-1 focus:outline-none focus:border-black transition-colors bg-transparent text-sm placeholder-gray-300"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Party / Affiliation</label>
                            <input
                                required
                                value={newCandidate.party}
                                onChange={e => setNewCandidate({ ...newCandidate, party: e.target.value })}
                                type="text"
                                className="w-full border-b border-gray-200 py-2 pt-1 focus:outline-none focus:border-black transition-colors bg-transparent text-sm placeholder-gray-300"
                                placeholder="Independent"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol (Emoji or URL)</label>
                            <input
                                required
                                value={newCandidate.symbol}
                                onChange={e => setNewCandidate({ ...newCandidate, symbol: e.target.value })}
                                type="text"
                                className="w-full border-b border-gray-200 py-2 pt-1 focus:outline-none focus:border-black transition-colors bg-transparent text-sm placeholder-gray-300"
                                placeholder="Emoji or Image URL"
                            />
                        </div>
                        <div className="pt-4">
                            {!isMounted ? (
                                <button disabled type="button" className="w-full btn-primary py-3 gap-2 flex justify-center items-center cursor-not-allowed">
                                    Loading...
                                </button>
                            ) : !isConnected ? (
                                <button disabled type="button" className="w-full btn-primary py-3 gap-2 flex justify-center items-center cursor-not-allowed">
                                    Connect Wallet First
                                </button>
                            ) : chainId !== localhost.id ? (
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); switchChain({ chainId: localhost.id }); }}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-2xl flex justify-center items-center shadow-lg transition-colors"
                                >
                                    Switch to Localhost Network
                                </button>
                            ) : (
                                <button disabled={isPending} type="submit" className="w-full btn-primary py-3 gap-2 flex justify-center items-center cursor-pointer">
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                                    {isPending ? 'Mining Tx...' : 'Register Candidate'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 tracking-tight px-2">
                        <User className="w-5 h-5 text-gray-400" /> Current Registry ({displayedCandidates.length})
                    </h2>
                    <div className="space-y-3">
                        {displayedCandidates.map((c, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shadow-inner">{c.symbolUrl}</div>
                                    <div>
                                        <p className="font-semibold text-gray-900 tracking-tight">{c.name}</p>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{c.party}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-mono font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">ID: 0x{i.toString(16).padStart(4, '0')}</span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                        {displayedCandidates.length === 0 && (
                            <div className="p-8 text-center text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                                No candidates registered on this chain yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
