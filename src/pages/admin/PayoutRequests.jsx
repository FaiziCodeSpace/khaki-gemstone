import { useEffect, useState } from 'react';
import { payoutServices } from '../../services/adminServices/payoutService';
import { CheckCircle, XCircle, Clock, ChevronRight, X, AlertCircle, Loader2, User, Landmark, Phone } from 'lucide-react';

// --- Internal Toast Component ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-800",
        error: "bg-rose-50 border-rose-200 text-rose-800",
        info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={18} />,
        error: <AlertCircle className="text-rose-500" size={18} />,
        info: <Clock className="text-blue-500" size={18} />
    };

    return (
        <div className={`fixed top-6 right-6 left-6 md:left-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg z-[100] animate-in slide-in-from-bottom-5 duration-300 ${styles[type]}`}>
            {icons[type]}
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70">
                <X size={14} />
            </button>
        </div>
    );
};

const PayoutRequests = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadPayouts();
    }, [filterStatus]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const loadPayouts = async () => {
        setLoading(true);
        try {
            const response = await payoutServices.fetchPayoutRequests(filterStatus);
            setPayouts(response.data);
            setError(null);
        } catch (err) {
            setError(err?.message || "Failed to load payouts");
            showToast(err?.message || "Failed to load payouts", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdating(true);
        try {
            const res = await payoutServices.updatePayoutStatus(id, newStatus);
            showToast(res.message || `Payout marked as ${newStatus}`);
            setSelectedPayout(null); 
            loadPayouts(); 
        } catch (err) {
            showToast(err?.message || "Update failed", 'error');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'failed': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="p-4 md:p-6 bg-[#F8FAFC] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <span className="w-2 h-8 bg-[#CA0A7F] rounded-full hidden md:block"></span>
                            Payout Management
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Review and process investor withdrawal requests.</p>
                    </div>
                    
                    <div className="flex items-center">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full md:w-auto bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#CA0A7F]/20 transition-all cursor-pointer shadow-sm hover:border-[#CA0A7F]/30"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="animate-spin text-[#CA0A7F]" size={40} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Fetching Payouts</span>
                        </div>
                    ) : error ? (
                        <div className="p-20 text-center text-rose-500 font-medium">
                            <AlertCircle className="mx-auto mb-2 opacity-50" size={48} />
                            <p>{error}</p>
                            <button onClick={loadPayouts} className="mt-4 text-sm font-bold text-[#CA0A7F] underline">Try Again</button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Mobile Card View (320px+) */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {payouts.length > 0 ? payouts.map((payout) => (
                                    <div 
                                        key={payout._id} 
                                        onClick={() => setSelectedPayout(payout)}
                                        className="p-5 active:bg-slate-50 flex items-center justify-between group"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${payout.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                                <span className="font-bold text-slate-900 text-sm">
                                                    {payout.investorId?.firstName} {payout.investorId?.lastName}
                                                </span>
                                            </div>
                                            <div className="text-lg font-black text-[#CA0A7F]">
                                                Rs. {payout.amount.toLocaleString()}
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${getStatusStyle(payout.status)}`}>
                                                    {payout.status}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium py-0.5">
                                                    {new Date(payout.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-300 group-hover:text-[#CA0A7F] transition-colors" />
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-slate-400 text-sm italic">No payout requests found.</div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <table className="hidden md:table w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Investor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {payouts.length > 0 ? payouts.map((payout) => (
                                        <tr 
                                            key={payout._id} 
                                            onClick={() => setSelectedPayout(payout)}
                                            className="hover:bg-slate-50/80 cursor-pointer transition-colors group animate-in fade-in duration-500"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 uppercase text-sm group-hover:text-[#CA0A7F] transition-colors">
                                                        {payout.investorId?.firstName} {payout.investorId?.lastName}
                                                    </span>
                                                    <span className="text-xs text-slate-400">{payout.investorId?.email} | {payout.investorId?.investor.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                               <span className="flex items-center gap-2 text-sm text-slate-600 capitalize">
                                                    {payout.method === 'bank' ? <Landmark size={14}/> : <Phone size={14}/>}
                                                    {payout.method}
                                               </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900">Rs. {payout.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(payout.status)}`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {new Date(payout.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-300 group-hover:text-[#CA0A7F] transition-all transform group-hover:translate-x-1">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-slate-400 text-sm italic">No payout requests found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL SIDE DRAWER (MODAL) */}
            {selectedPayout && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => !updating && setSelectedPayout(null)} 
                    />
                    
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#CA0A7F]/10 flex items-center justify-center text-[#CA0A7F]">
                                    <Landmark size={18} />
                                </div>
                                <h2 className="font-bold text-lg text-slate-800">Payout Details</h2>
                            </div>
                            <button 
                                onClick={() => setSelectedPayout(null)} 
                                disabled={updating}
                                className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto space-y-8">
                            {/* Amount Card */}
                            <div className="bg-[#CA0A7F] rounded-2xl p-8 text-white text-center shadow-xl shadow-[#CA0A7F]/20 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Landmark size={80} />
                                </div>
                                <p className="text-[10px] text-white/70 uppercase font-black tracking-[0.2em] mb-2">Request Amount</p>
                                <h3 className="text-4xl font-black">Rs. {selectedPayout.amount.toLocaleString()}</h3>
                            </div>

                            {/* Investor Details */}
                            <section className="animate-in slide-in-from-bottom-2 duration-300">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User size={12}/> Investor Information
                                </h4>
                                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Full Name</span>
                                        <span className="font-bold text-slate-800 capitalize">{selectedPayout.investorId?.firstName} {selectedPayout.investorId?.lastName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Live Earnings</span>
                                        <span className="font-bold text-emerald-600">Rs. {selectedPayout.investorId?.investor?.totalEarnings?.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs">
                                        <span className="text-slate-400 italic">{selectedPayout.investorId?.email}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Payout Method */}
                            <section className="animate-in slide-in-from-bottom-4 duration-400">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Transfer Method: {selectedPayout.method}</h4>
                                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 font-mono text-sm">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-500 uppercase text-[9px] font-black tracking-tighter">Account Holder</span>
                                        <span className="text-slate-800 font-bold text-base">{selectedPayout.accountDetails?.accountHolderName || 'N/A'}</span>
                                    </div>
                                    {selectedPayout.method === 'bank' ? (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <span className="text-slate-500 uppercase text-[9px] font-black">IBAN / Account Number</span>
                                            <div className="text-[#CA0A7F] break-all bg-white p-4 rounded-xl border border-slate-200 font-bold tracking-tight text-base shadow-sm">
                                                {selectedPayout.accountDetails?.iban}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                            <span className="text-slate-500 uppercase text-[9px] font-black">Mobile Number</span>
                                            <span className="text-slate-800 font-black text-base">{selectedPayout.accountDetails?.phoneNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Actions */}
                            {selectedPayout.status !== 'completed' && (
                                <section className="pt-4 space-y-4 animate-in slide-in-from-bottom-6 duration-500">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Admin Controls</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            disabled={updating}
                                            onClick={() => handleUpdateStatus(selectedPayout._id, 'completed')}
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-300 gap-2 shadow-sm disabled:opacity-50"
                                        >
                                            <CheckCircle size={24} />
                                            <span className="text-[9px] font-black uppercase tracking-wider">Approve & Pay</span>
                                        </button>
                                        <button 
                                            disabled={updating}
                                            onClick={() => handleUpdateStatus(selectedPayout._id, 'failed')}
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all duration-300 gap-2 shadow-sm disabled:opacity-50"
                                        >
                                            <XCircle size={24} />
                                            <span className="text-[9px] font-black uppercase tracking-wider">Reject Request</span>
                                        </button>
                                    </div>
                                    <button 
                                        disabled={updating}
                                        onClick={() => handleUpdateStatus(selectedPayout._id, 'processing')}
                                        className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-50"
                                    >
                                        <Clock size={18} />
                                        Move to Processing
                                    </button>
                                </section>
                            )}
                        </div>

                        {/* Loading Overlay */}
                        {updating && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-10 animate-in fade-in duration-200">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 text-[#CA0A7F] animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#CA0A7F] rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase animate-pulse">Processing Transaction...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toast System */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
};

export default PayoutRequests;