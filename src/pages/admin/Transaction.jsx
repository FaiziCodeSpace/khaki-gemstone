import { useState, useEffect } from "react";
import {
    Search, CreditCard, Gem, Download, X, Info, 
    Package, Layers, Fingerprint, Loader2
} from "lucide-react";
import { getTransactions, formatEnum } from "../../services/adminServices/transactions"; // Adjust path

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTrx, setSelectedTrx] = useState(null);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadData();
    }, [page, searchTerm]); // Reload when page or search changes

    const loadData = async () => {
        setLoading(true);
        try {
            // We pass the search as a param if your backend supports it, 
            // otherwise we'll filter client-side.
            const response = await getTransactions({ page, limit: 10 });
            setTransactions(response.data);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error("Failed to load ledger:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic (Client-side search)
    const filteredData = transactions.filter(trx => 
        trx.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 bg-[#FAFBFC] min-h-screen font-jakarta p-4 md:p-8 relative text-gray-900">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Ledger</h2>
                    <p className="text-sm font-medium text-gray-500">Deep tracking of internal wallet flow and external capital.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                    <Download size={16} />
                    <span>Export Ledger</span>
                </button>
            </div>

            {/* --- SEARCH BAR --- */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or Customer Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-sm focus:outline-none"
                    />
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-[#CA0A7F]" size={40} />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Ledger...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                                    <th className="px-8 py-5">Entity & ID</th>
                                    <th className="px-6 py-5">Source</th>
                                    <th className="px-6 py-5">Type</th>
                                    <th className="px-6 py-5">Value</th>
                                    <th className="px-6 py-5">DATE</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {filteredData.map((trx) => (
                                    <tr key={trx._id} className="hover:bg-gray-50/40 transition-colors group cursor-pointer" onClick={() => setSelectedTrx(trx)}>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-gray-900 mb-0.5">{trx.user?.name || "Guest Customer"}</p>
                                            <p className="text-[10px] font-mono text-gray-400 uppercase">{trx.transactionId}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <SourceTag source={trx.source} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                                                {formatEnum(trx.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-black text-gray-900">
                                            Rs. {trx.amount?.toLocaleString()}
                                        </td>
                                         <td className="px-6 py-5">
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                                                {new Date(trx.createdAt).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 hover:bg-[#CA0A7F] hover:text-white rounded-lg transition-all text-gray-400">
                                                <Info size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 mt-4">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50 font-bold text-xs"
                >
                    Previous
                </button>
                <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50 font-bold text-xs"
                >
                    Next
                </button>
            </div>

            {/* --- DEEP DETAIL DIALOGUE --- */}
            {selectedTrx && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTrx(null)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <div className={`p-6 flex justify-between items-center text-white ${selectedTrx.type.includes('INVESTMENT') ? 'bg-gray-900' : 'bg-[#CA0A7F]'}`}>
                            <div className="flex items-center gap-3">
                                {selectedTrx.type.includes('INVESTMENT') ? <Layers size={20}/> : <Gem size={20}/>}
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{formatEnum(selectedTrx.type)}</span>
                            </div>
                            <button onClick={() => setSelectedTrx(null)}><X size={20}/></button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Transaction Value</p>
                                    <p className="text-4xl font-black text-gray-900 tracking-tighter">Rs. {selectedTrx.amount?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <StatusBadge status={selectedTrx.status} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailBox icon={<Fingerprint size={14}/>} label="Ledger ID" value={selectedTrx.transactionId} />
                                <DetailBox icon={<CreditCard size={14}/>} label="Source" value={formatEnum(selectedTrx.source)} />
                                
                                {selectedTrx.investment && (
                                    <DetailBox icon={<Layers size={14}/>} label="Investment Ref" value={selectedTrx.investment?._id || selectedTrx.investment} highlight />
                                )}
                                
                                {selectedTrx.order && (
                                    <DetailBox icon={<Package size={14}/>} label="Order Ref" value={selectedTrx.order?.orderNumber || "N/A"} highlight />
                                )}
                            </div>

                            {/* Linked Products Mapping */}
                            {selectedTrx.products?.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Products ({selectedTrx.products.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTrx.products.map((prod, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-[10px] font-mono text-gray-600">
                                                <Gem size={10} className="text-[#CA0A7F]" />
                                                <span>{prod.name || prod} - {prod.productNumber}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-[24px] p-6 space-y-4">
                                <DetailRow label="Executed By" value={selectedTrx.user?.name || "Guest"} />
                                <DetailRow label="Balance Before" value={`Rs. ${selectedTrx.balanceBefore?.toLocaleString()}`} />
                                <DetailRow label="Balance After" value={`Rs. ${selectedTrx.balanceAfter?.toLocaleString()}`} />
                                <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider">Timeline</span>
                                    <span className="text-gray-900 font-bold">{new Date(selectedTrx.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Internal Helpers ---
function SourceTag({ source }) {
    const isSoft = source === "SOFT_WALLET";
    return (
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isSoft ? 'bg-indigo-500 animate-pulse' : 'bg-green-300'}`} />
            <span className={`text-xs font-bold ${isSoft ? 'text-indigo-600' : 'text-green-500'}`}>
                {formatEnum(source)}
            </span>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        SUCCESS: "text-emerald-500 bg-emerald-50",
        PENDING: "text-amber-500 bg-amber-50",
        FAILED: "text-red-500 bg-red-50"
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-current uppercase ${styles[status] || styles.PENDING}`}>
            {status || "PENDING"}
        </span>
    );
}

function DetailBox({ icon, label, value, highlight }) {
    return (
        <div className={`p-4 rounded-3xl border transition-all ${highlight ? 'bg-pink-50/30 border-pink-100' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className={`text-[11px] font-bold truncate ${highlight ? 'text-[#CA0A7F]' : 'text-gray-900'}`}>
                {value || "None"}
            </p>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-xs font-bold text-gray-900">{value}</span>
        </div>
    );
}