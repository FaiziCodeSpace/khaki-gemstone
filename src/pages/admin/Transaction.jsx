import { useState } from "react";
import {
    Search, CreditCard, ArrowDownLeft, 
    Filter, ChevronLeft, ChevronRight, Gem,
    Download
} from "lucide-react";

const INITIAL_TRANSACTIONS = [
    { id: "TRX-99210", userName: "Arsalan Ahmed", type: "Investment", reference: "INV-2021", amount: "Rs. 250,000", date: "24 Jan 2026", time: "14:20" },
    { id: "TRX-88122", userName: "Sara Khan", type: "Purchase", reference: "GEM-5233", amount: "Rs. 85,000", date: "23 Jan 2026", time: "09:15" },
    { id: "TRX-77219", userName: "Zohaib Malik", type: "Investment", reference: "INV-1102", amount: "Rs. 1,200,000", date: "22 Jan 2026", time: "18:45" },
    { id: "TRX-55410", userName: "Ayesha Rayyub", type: "Purchase", reference: "GEM-1022", amount: "Rs. 120,000", date: "20 Jan 2026", time: "11:30" },
    { id: "TRX-44102", userName: "Bilal Shah", type: "Purchase", reference: "GEM-0092", amount: "Rs. 45,000", date: "19 Jan 2026", time: "16:20" },
    { id: "TRX-33019", userName: "Hamza Ali", type: "Investment", reference: "INV-5520", amount: "Rs. 500,000", date: "18 Jan 2026", time: "10:00" },
];

export default function TransactionHistory() {
    const [transactions] = useState(INITIAL_TRANSACTIONS);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    // --- LOGIC: Filter & Pagination ---
    const filteredData = transactions.filter(trx => 
        trx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="space-y-6 bg-[#FAFBFC] min-h-screen font-jakarta p-4 md:p-8">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Ledger</h2>
                    <p className="text-sm font-medium text-gray-500">Real-time tracking of asset acquisitions and capital inflows.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 w-full md:w-auto">
                    <Download size={16} />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* --- SEARCH & FILTERS --- */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, Customer or Ref..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-sm focus:outline-none placeholder:text-gray-400"
                    />
                </div>
                <div className="h-8 w-px bg-gray-100 hidden md:block"></div>
                <div className="flex items-center gap-2 w-full md:w-auto p-1">
                    <Filter size={14} className="text-gray-400 ml-2 hidden md:block" />
                    <select className="w-full md:w-auto bg-transparent border-none rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 outline-none cursor-pointer hover:bg-gray-50 transition-colors">
                        <option>All Types</option>
                        <option>Investments</option>
                        <option>Gemstone Sales</option>
                    </select>
                </div>
            </div>

            {/* --- TRANSACTIONS TABLE --- */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                                <th className="px-8 py-5">Transaction Entity</th>
                                <th className="px-6 py-5">Category & Purpose</th>
                                <th className="px-6 py-5">Value (PKR)</th>
                                <th className="px-6 py-5">Timeline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.length > 0 ? currentItems.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50/40 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-gray-200 shrink-0">
                                                <CreditCard size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{trx.userName}</p>
                                                <p className="text-[10px] font-mono text-gray-400 uppercase">{trx.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg shrink-0 ${trx.type === 'Investment' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-[#CA0A7F]'}`}>
                                                {trx.type === 'Investment' ? <ArrowDownLeft size={14} /> : <Gem size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{trx.type}</p>
                                                <p className="text-[10px] text-gray-400 font-medium tracking-tight">Ref: <span className="text-gray-600 font-mono">{trx.reference}</span></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-gray-900 tracking-tight">{trx.amount}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">{trx.date}</span>
                                            <span className="text-[10px] text-gray-400">{trx.time}</span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-sm text-gray-400 font-medium">No transactions found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER / PAGINATION --- */}
                <div className="bg-gray-50/30 border-t border-gray-100 px-4 md:px-8 py-5 flex flex-col sm:row sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest text-center sm:text-left">
                        Showing <span className="text-gray-900">{indexOfFirstItem + 1}—{Math.min(indexOfLastItem, filteredData.length)}</span> of {filteredData.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 border border-gray-200 rounded-xl bg-white transition-all shadow-sm ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 hover:border-gray-300 active:scale-90"}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <div className="flex items-center gap-1 mx-1 md:mx-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-8 h-8 text-[11px] font-black rounded-lg transition-all ${
                                        currentPage === i + 1 
                                        ? "bg-gray-900 text-white shadow-md shadow-gray-200 scale-110" 
                                        : "bg-transparent text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`p-2 border border-gray-200 rounded-xl bg-white transition-all shadow-sm ${currentPage === totalPages || totalPages === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 hover:border-gray-300 active:scale-90"}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}