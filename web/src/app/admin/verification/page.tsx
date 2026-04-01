'use client';
import { useState, useEffect } from 'react';
import { Check, X, Clock, ShieldAlert } from 'lucide-react';

type PendingVoter = {
    id: number;
    name: string;
    documentId: string;
    walletAddress: string;
    status: string;
    createdAt: string;
};

export default function VoterVerification() {
    const [queue, setQueue] = useState<PendingVoter[]>([]);
    const [selected, setSelected] = useState<PendingVoter | null>(null);

    useEffect(() => {
        setQueue([
            { id: 1, name: "Maria Chen", documentId: "ID-839201", walletAddress: "0x123...abc", status: "PENDING", createdAt: "10/26/2023" },
            { id: 2, name: "Li Nan Etan", documentId: "ID-839202", walletAddress: "0x456...def", status: "PENDING", createdAt: "10/26/2023" },
            { id: 3, name: "Beren Caman", documentId: "ID-839203", walletAddress: "0x789...ghi", status: "PENDING", createdAt: "10/26/2023" },
        ]);
    }, []);

    const processRequest = (id: number, action: 'Approve' | 'Reject') => {
        setQueue(queue.filter(q => q.id !== id));
        setSelected(null);
    };

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Verification Queue</h1>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-hidden">
                {/* Queue Pane */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden xl:col-span-1">
                    <div className="bg-gray-50/50 p-4 font-semibold text-gray-900 flex items-center justify-between border-b border-gray-100">
                        <span>Pending ({queue.length})</span>
                        <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-gray-50">
                            {queue.map(q => (
                                <div
                                    key={q.id}
                                    onClick={() => setSelected(q)}
                                    className={`p-4 cursor-pointer transition-colors ${selected?.id === q.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold">{q.name}</p>
                                        <p className={`text-xs ${selected?.id === q.id ? 'text-gray-400' : 'text-gray-400'}`}>{q.createdAt}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm font-mono ${selected?.id === q.id ? 'text-gray-300' : 'text-gray-500'}`}>{q.documentId}</p>
                                    </div>
                                </div>
                            ))}
                            {queue.length === 0 && (
                                <div className="p-12 text-center text-gray-400 text-sm">No applications pending.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Review Pane */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
                    {selected ? (
                        <>
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">{selected.name}</h2>
                                    <p className="text-sm font-mono text-gray-400 mt-1">{selected.documentId}</p>
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Pending Review
                                </span>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                                    <div className="space-y-6">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative group">
                                            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-400 uppercase tracking-widest text-center px-4">
                                                Simulated Document Scan
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Target Address</h3>
                                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm font-mono text-sm break-all text-gray-900">
                                                {selected.walletAddress}
                                            </div>
                                        </div>
                                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100/50">
                                            <div className="flex items-start gap-3">
                                                <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-800 leading-relaxed">Ensure physical details match. Approval executes an irrevocable wallet whitelisting transaction on the public ledger.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
                                <button onClick={() => processRequest(selected.id, 'Reject')} className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
                                    <X className="w-4 h-4" /> Reject
                                </button>
                                <button onClick={() => processRequest(selected.id, 'Approve')} className="px-6 py-2.5 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Approve & Sign
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-6">
                                <ShieldAlert className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium">Select an application from the queue to review.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
