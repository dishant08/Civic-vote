'use client';
import { useState } from 'react';
import { Play, Pause, ShieldCheck, CheckCircle2, Loader2, Link } from 'lucide-react';
import { useWriteContract, useAccount, useConnect, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { localhost } from 'wagmi/chains';
import { VOTING_CONTRACT_ADDRESS } from '@/lib/wagmi';
import VotingABI from '@/lib/VotingManagementABI.json';

export default function AdminDashboard() {
    const { isConnected } = useAccount();
    const { connect } = useConnect();
    const { writeContract, isPending } = useWriteContract();

    // Read election state
    const { data: currentStateRaw } = useReadContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VotingABI,
        functionName: 'currentState',
        query: { refetchInterval: 2000 },
    });
    const stateLabel = currentStateRaw === 0 ? "Registration" : currentStateRaw === 1 ? "Voting Live" : "Ended";

    // Read Whitelisted Voters
    const { data: whitelistedRaw } = useReadContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VotingABI,
        functionName: 'getWhitelistedVoters',
        query: { refetchInterval: 2000 },
    });
    const whitelistedVoters = (whitelistedRaw as any[]) || [];

    const [voterAddress, setVoterAddress] = useState("");
    const [voterName, setVoterName] = useState("");

    const handleStartElection = () => {
        writeContract({
            address: VOTING_CONTRACT_ADDRESS,
            abi: VotingABI,
            functionName: 'startVoting',
            chainId: localhost.id
        });
    };

    const handleEndElection = () => {
        writeContract({
            address: VOTING_CONTRACT_ADDRESS,
            abi: VotingABI,
            functionName: 'endVoting',
            chainId: localhost.id
        });
    };

    const handleWhitelist = (e: React.FormEvent) => {
        e.preventDefault();
        if (!voterAddress || !voterName) return;
        writeContract({
            address: VOTING_CONTRACT_ADDRESS,
            abi: VotingABI,
            functionName: 'whitelistVoter',
            args: [voterAddress, voterName],
            chainId: localhost.id
        });
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Operations Control</h1>
                    <p className="text-gray-500 mt-2 text-sm">Manage the active state and whitelists of the immutable ledger.</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isConnected && (
                        <button onClick={() => connect({ connector: injected(), chainId: localhost.id })} className="text-sm font-medium px-4 py-2 bg-black text-white rounded-full flex gap-2 items-center shadow-lg shadow-black/10 hover:bg-gray-800 transition-colors">
                            <Link className="w-4 h-4" /> Connect Admin Wallet
                        </button>
                    )}
                    <div className="flex items-center gap-3 text-sm font-medium px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 uppercase tracking-widest">
                        State: {stateLabel}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Election State Control */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-6">
                        <Play className="w-5 h-5 text-gray-400" /> Election Phase
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Transition the smart contract from the Registration phase to Live Voting. This action enables `castVote` for verified voters.
                    </p>
                    <div className="flex gap-4">
                        <button
                            disabled={isPending || !isConnected}
                            onClick={handleStartElection}
                            className="flex-1 btn-primary py-3 gap-2 flex justify-center items-center"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4" />}
                            Start Election
                        </button>
                        <button
                            disabled={isPending || !isConnected}
                            onClick={handleEndElection}
                            className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                        >
                            <Pause className="w-4 h-4" /> End Election
                        </button>
                    </div>
                </div>

                {/* Whitelist Control */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-6">
                        <ShieldCheck className="w-5 h-5 text-gray-400" /> Whitelist Voter Address
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        Manually approve a specific cryptographic wallet address to cast a vote. This is required before voting.
                    </p>
                    <form onSubmit={handleWhitelist} className="space-y-4">
                        <input
                            required
                            value={voterName}
                            onChange={e => setVoterName(e.target.value)}
                            type="text"
                            className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-black transition-colors bg-gray-50 text-sm placeholder-gray-400 mb-2"
                            placeholder="Voter Legal Name"
                        />
                        <input
                            required
                            value={voterAddress}
                            onChange={e => setVoterAddress(e.target.value)}
                            type="text"
                            className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-black transition-colors bg-gray-50 text-sm font-mono placeholder-gray-400"
                            placeholder="0x..."
                        />
                        <button disabled={isPending || !isConnected} type="submit" className="w-full btn-primary py-3 gap-2 flex justify-center items-center">
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <CheckCircle2 className="w-4 h-4" />}
                            Whitelist Address
                        </button>
                    </form>
                </div>
            </div>

            {/* Whitelisted Users Display */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-gray-400" /> Authorized Voters Ledger
                </h2>
                {whitelistedVoters.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-gray-50 px-4 py-8 rounded-xl text-center border-dashed border-2 border-gray-100">
                        No cryptographic addresses have been whitelisted yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {whitelistedVoters.map((voter: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 px-4 py-3 rounded-xl font-mono text-xs text-gray-700 border border-gray-100 shadow-sm flex flex-col gap-1 hover:bg-white hover:border-gray-200 transition-colors pointer-events-none">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="font-bold font-sans text-sm truncate">{voter.name}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 truncate" title={voter.walletAddress}>{voter.walletAddress}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
