'use client';
import { useState, useEffect } from 'react';
import { Blocks, Clock, ArrowUpRight, Copy, Activity } from 'lucide-react';
import { useReadContract, useBlockNumber, usePublicClient } from 'wagmi';
import { VOTING_CONTRACT_ADDRESS } from '@/lib/wagmi';
import VotingABI from '@/lib/VotingManagementABI.json';

type CandidateTally = { name: string; votes: number; percentage: number };

export default function PublicDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const [timeAgo, setTimeAgo] = useState(0);

    const publicClient = usePublicClient();
    const [recentBlocks, setRecentBlocks] = useState<any[]>([]);

    // Fetch initial block & Watch new blocks
    useEffect(() => {
        if (!publicClient) return;

        publicClient.getBlock({ blockTag: 'latest' }).then(block => {
            setRecentBlocks([block]);
        }).catch(console.error);

        const unwatch = publicClient.watchBlocks({
            onBlock: block => setRecentBlocks(prev => {
                // Prevent duplicates
                if (prev.some(b => b.hash === block.hash)) return prev;
                return [block, ...prev].slice(0, 8); // Keep last 8 blocks
            }),
        });
        return () => unwatch();
    }, [publicClient]);

    // Read Candidates from Contract
    const { data: candidatesRaw } = useReadContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VotingABI,
        functionName: 'getCandidates',
        query: { refetchInterval: 2000 },
    });

    // Read Whitelisted Voters
    const { data: whitelistedRaw } = useReadContract({
        address: VOTING_CONTRACT_ADDRESS,
        abi: VotingABI,
        functionName: 'getWhitelistedVoters',
        query: { refetchInterval: 2000 },
    });
    const whitelistedVoters = (whitelistedRaw as any[]) || [];

    // Calculate percentages
    let tally: CandidateTally[] = [];
    if (candidatesRaw) {
        const rawArray = candidatesRaw as any[];
        const totalElectorate = whitelistedVoters.length;

        tally = rawArray.map((c: any) => {
            const votes = Number(c.voteCount);
            return {
                name: c.name,
                votes: votes,
                percentage: totalElectorate > 0 ? Math.round((votes / totalElectorate) * 100) : 0
            };
        });
    }

    useEffect(() => {
        // Reset time ago every time a new block is detected
        setTimeAgo(0);
    }, [blockNumber]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 animate-in fade-in duration-700">
            {/* Live Tally Board */}
            <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Live Tally</h2>
                        <p className="text-gray-500 mt-1">Real-time vote aggregation verified by consensus nodes.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {tally.length === 0 && (
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center text-gray-500">
                            No candidates have been registered to the ledger yet.
                        </div>
                    )}

                    {tally.map((c, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 tracking-tight">{c.name}</h3>
                                    <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest mt-1 flex items-center gap-1">
                                        Verify on Block Explorer <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-medium tracking-tight text-3xl text-gray-900">
                                        {c.votes.toLocaleString()}
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1 block">/ {whitelistedVoters.length} Verified</span>
                                </div>
                            </div>

                            <div className="relative py-2">
                                {/* Track */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    {/* Fill */}
                                    <div
                                        className="bg-black h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${c.percentage}%` }}
                                    ></div>
                                </div>
                                {/* Marker */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-black rounded-full shadow-sm transition-all duration-1000 ease-out z-10"
                                    style={{ left: `calc(${c.percentage}% - 8px)` }}
                                ></div>
                                <div
                                    className="absolute top-full mt-2 text-xs font-bold text-gray-900 transition-all duration-1000 ease-out"
                                    style={{ left: `calc(${c.percentage}% - 12px)` }}
                                >
                                    {c.percentage}%
                                </div>
                            </div>
                            <div className="h-6"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar Metadata */}
            <div className="space-y-6">
                {/* Network State Card */}
                <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-black/5">
                    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-150 transform translate-x-12 translate-y-12">
                        <iframe src='https://my.spline.design/6Wq1Q7YGyM-iab9i/' frameBorder='0' width='100%' height='100%'></iframe>
                    </div>
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 p-8 opacity-5 pointer-events-none z-0">
                        <Blocks className="w-32 h-32" />
                    </div>

                    <h2 className="font-semibold tracking-tight text-gray-300 uppercase text-xs mb-8 flex items-center gap-2 relative z-10">
                        <Activity className="w-4 h-4 text-emerald-400" /> Network State
                    </h2>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Latest Confirmed Block</p>
                            <p className="text-3xl font-mono font-light tracking-tight">#{blockNumber ? blockNumber.toString() : 'Loading...'}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Clock className="w-4 h-4 text-gray-500" /> Synced {timeAgo} seconds ago
                        </div>
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xs">
                            <span className="text-gray-400">Gas Price Avg</span>
                            <span className="font-mono text-gray-200">Local RPC</span>
                        </div>
                    </div>
                </div>

                {/* Micro Ledger */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-semibold tracking-tight text-gray-900 uppercase text-xs mb-6 px-2 flex justify-between items-center">
                        Verified Ledger Wallets
                        <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{whitelistedVoters.length} Listed</span>
                    </h2>

                    {whitelistedVoters.length === 0 ? (
                        <p className="text-xs text-center text-gray-400 py-4 px-2">Awaiting registrations to sync from mempool...</p>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {whitelistedVoters.map((voter: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center group p-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="font-bold text-sm text-gray-900 truncate">{voter.name}</span>
                                            <span className="font-mono text-[10px] text-gray-500 truncate">{voter.walletAddress}</span>
                                        </div>
                                    </div>
                                    <Copy className="w-3 h-3 text-gray-300 group-hover:text-blue-500 cursor-pointer flex-shrink-0" onClick={() => navigator.clipboard.writeText(voter.walletAddress)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Realtime Block Explorer */}
            <div className="lg:col-span-3 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <Blocks className="w-6 h-6 text-gray-400" /> Live Block Explorer
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">Real-time feed of cryptographic blocks mined on the local network.</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold tracking-widest">Block</th>
                                    <th className="px-6 py-4 font-semibold tracking-widest">Hash</th>
                                    <th className="px-6 py-4 font-semibold tracking-widest">Transactions</th>
                                    <th className="px-6 py-4 font-semibold tracking-widest">Gas Used</th>
                                    <th className="px-6 py-4 font-semibold tracking-widest text-right">Age</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-mono">
                                {recentBlocks.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-sans">
                                            Awaiting network blocks...
                                        </td>
                                    </tr>
                                )}
                                {recentBlocks.map((block) => (
                                    <tr key={block.hash} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-black font-semibold">
                                            {Number(block.number).toString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]" title={block.hash}>
                                            {block.hash}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold">
                                                {block.transactions.length} txns
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs text-nowrap">
                                            {Number(block.gasUsed).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">
                                            {new Date(Number(block.timestamp) * 1000).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
