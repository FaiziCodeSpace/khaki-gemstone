import { useCallback, useEffect, useState, useRef } from "react";
import {
    Search, Package, Truck, Users, BanknoteArrowUp,
    Eye, ChevronLeft, ChevronRight, MapPin, ArrowUpRight, X, Save, ChevronDown, CheckCircle2, XCircle, AlertCircle, RefreshCw
} from "lucide-react";
import { fetchDashboardMetrics } from "../../services/adminServices/dashboardMatricsService";
import { fetchOrders, updateOrderStatus } from "../../services/adminServices/OrdersService";

const DELIVERY_FEE = 250;
const REFRESH_INTERVAL = 20000; // 20 Seconds

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // New Error State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [orderStats, setOrderStats] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefetching, setIsRefetching] = useState(false); // Visual cue for auto-refresh

    const itemsPerPage = 10;

    // Combined fetcher to keep stats and table in sync
    const loadData = useCallback(async (isAutoRefresh = false) => {
        if (!isAutoRefresh) setLoading(true);
        else setIsRefetching(true);

        setError(null);
        try {
            const [ordersData, metricsData] = await Promise.all([
                fetchOrders({ page: currentPage, limit: itemsPerPage }),
                fetchDashboardMetrics()
            ]);

            setOrders(ordersData.orders || []);
            setTotalPages(ordersData.totalPages || 1);
            setOrderStats(metricsData);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to sync data. Check your connection.");
        } finally {
            setLoading(false);
            setIsRefetching(false);
        }
    }, [currentPage]);

    // Initial Load + 20s Polling Logic
    useEffect(() => {
        loadData();

        const interval = setInterval(() => {
            loadData(true);
        }, REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, [loadData]);

    const handleStatusUpdate = async (orderId, payload) => {
        try {
            await updateOrderStatus(orderId, payload);
            setSelectedOrder(null);
            loadData(); // Manual refresh after update
        } catch (err) {
            alert("Update Failed: " + (err.message || err));
        }
    };

    const stats = [
        { label: "New", value: orderStats?.newOrders || 0, icon: <Package size={18} />, color: "bg-blue-50 text-blue-600" },
        { label: "On Way", value: orderStats?.dispatchedOrders ?? 0, icon: <Truck size={18} />, color: "bg-orange-50 text-orange-600" },
        { label: "Revenue", value: orderStats?.ordersRevenue || 0, icon: <BanknoteArrowUp size={18} />, color: "bg-[#CA0A7F]/10 text-[#CA0A7F]" },
        { label: "Customers", value: orderStats?.customers || 0, icon: <Users size={18} />, color: "bg-gray-100 text-gray-600" },
    ];

    return (
        <div className="mx-auto space-y-6 font-jakarta p-4 md:p-0">

            {/* Error Toast */}
            {error && (
                <div className="fixed top-4 right-4 z-[100] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={18} />
                    <span className="text-sm font-bold">{error}</span>
                    <button onClick={() => loadData()} className="ml-2 p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Order Management</h2>
                        {/* Live Indicator */}
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                            <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isRefetching ? 'animate-pulse' : ''}`} />
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Logistics & fulfillment dashboard. Auto-refreshes every 20s.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md text-sm">
                    <ArrowUpRight size={18} />
                    <span>Export Analytics</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
                        <div className={`p-2.5 md:p-3 rounded-xl ${stat.color} shrink-0`}>{stat.icon}</div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-base md:text-lg font-black text-gray-900">
                                {loading && !isRefetching ? "..." : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#CA0A7F]/20 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Order #</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Total Amount</th>
                                <th className="px-6 py-4 font-semibold">Payment</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && !isRefetching ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 text-sm italic tracking-widest uppercase font-bold">Initializing Logistics...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-400 text-sm">No orders found.</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/30 transition-colors text-sm">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{order.orderNumber}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">{order.customer.name}</td>
                                    <td className="px-6 py-4 font-black text-gray-900">Rs. {order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase tracking-tight">
                                                <CheckCircle2 size={12} /> Paid
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400 font-bold text-[10px] uppercase tracking-tight">
                                                <XCircle size={12} /> Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pb-10">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 transition-all hover:bg-gray-50"><ChevronLeft size={18} /></button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 transition-all hover:bg-gray-50"><ChevronRight size={18} /></button>
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        "PENDING": "bg-blue-50 text-blue-600 border-blue-100",
        "DISPATCHED": "bg-orange-50 text-orange-600 border-orange-100",
        "DELIVERED": "bg-emerald-50 text-emerald-600 border-emerald-100",
        "CANCELLED": "bg-red-50 text-red-400 border-red-100",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.PENDING}`}>
            {status}
        </span>
    );
}

function OrderDetailModal({ order, onClose, onUpdate }) {
    const [newStatus, setNewStatus] = useState(order.status);
    const [isPaid, setIsPaid] = useState(order.isPaid);
    const [updating, setUpdating] = useState(false);
    const statuses = ["PENDING", "DISPATCHED", "DELIVERED", "CANCELLED"];

    const handleSave = async () => {
        setUpdating(true);
        try {
            await onUpdate(order._id, { status: newStatus, isPaid });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-black text-gray-900">{order.orderNumber}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Details & Logistics</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                    {/* CUSTOMER & PAYMENT METHOD */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Customer</p>
                            <p className="text-sm font-bold text-gray-800">{order.customer.name}</p>
                            <p className="text-xs text-gray-500">{order.customer.phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Payment Method</p>
                            <span className="text-xs font-black text-gray-900">{order.paymentMethod}</span>
                        </div>
                    </div>

                    {/* SHIPPING ADDRESS */}
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-2 text-[#CA0A7F] mb-1 font-bold">
                            <MapPin size={14} /> <span className="text-[10px] uppercase">Shipping Address</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-tight">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    </div>

                    {/* ORDER ITEMS - RESTORED */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Order Items</p>
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between p-3 border border-gray-100 rounded-xl bg-white">
                                    <span className="text-xs font-bold text-gray-800">
                                        {item.product?.name || "Gemstone Item"}
                                    </span>
                                    <span className="text-xs font-black text-gray-900">
                                        Rs. {item.price?.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic">No items found in this order.</p>
                        )}
                    </div>

                    {/* PAYMENT TOGGLE */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Status</label>
                        <div
                            onClick={() => setIsPaid(!isPaid)}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all"
                        >
                            <span className="text-sm font-bold text-gray-700">{isPaid ? "Marked as Paid" : "Payment Pending"}</span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${isPaid ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isPaid ? 'left-6' : 'left-1'}`} />
                            </div>
                        </div>
                    </div>

                    {/* STATUS DROPDOWN */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Logistics Status</label>
                        <div className="relative">
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* FINANCIALS */}
                    <div className="space-y-1.5 border-t border-gray-100 pt-4 text-sm font-jakarta">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>Rs. {(order.totalAmount - DELIVERY_FEE).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Delivery Fee</span>
                            <span>Rs. {DELIVERY_FEE}</span>
                        </div>
                        <div className="flex justify-between font-black text-gray-900 pt-1 text-base">
                            <span>Grand Total</span>
                            <span>Rs. {order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={updating}
                        className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {updating ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}