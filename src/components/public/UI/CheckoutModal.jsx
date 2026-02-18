import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, Wallet, MapPin, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { bookOrder } from '../../../services/adminServices/OrdersService';
import { clearGuestCart, clearGuestItem } from '../../../utils/guestCart';
import { clearCart, deleteFromCart } from '../../../services/cartService';

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function CheckoutModal({ isOpen, onClose, items, totalAmount, source }) {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'COD'
    });

    useEffect(() => {
        if (isOpen) {
            window.history.pushState({ modalOpen: true }, "");

            const handlePopState = (e) => {
                onClose();
            };

            window.addEventListener('popstate', handlePopState);
            return () => window.removeEventListener('popstate', handlePopState);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderPayload = {
                customer: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone
                },
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode
                },
                items: items.map(item => ({ product: item._id })),
                paymentMethod: formData.paymentMethod
            };

            const result = await bookOrder(orderPayload);

            if (result.type === 'SUCCESS' || result._id) {
                setLoading(false);
                setIsSuccess(true);

                const token = localStorage.getItem("token");
                if (source === "cart") {
                    token ? await clearCart() : clearGuestCart();
                } else {
                    for (const item of items) {
                        token ? await deleteFromCart(item._id) : clearGuestItem(item._id);
                    }
                }
                window.dispatchEvent(new Event("cartUpdated"));

                setTimeout(() => {
                    if (formData.paymentMethod === 'COD') {
                        window.location.reload();
                    } else {
                        onClose();
                        setIsSuccess(false);
                    }
                }, 4000);

            } else {
                throw new Error("Order processed but confirmation failed.");
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || err.message || "Server Error (500)");
            console.error("Checkout Error:", err);
        }
    };
    useEffect(() => {
        if (isOpen) {
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';

            window.history.pushState({ modalOpen: true }, "");
            const handlePopState = () => onClose();
            window.addEventListener('popstate', handlePopState);

            return () => {
                // Re-enable scrolling when closed
                document.body.style.overflow = 'unset';
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [isOpen, onClose]);

    return (
        // Update this line at the top of the return
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white md:bg-black/40 md:backdrop-blur-sm animate-in fade-in duration-300">            {/* Main Container */}
            <div className="bg-white w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-[24px] shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

                {/* --- HEADER (Mobile Only) --- */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="font-bold text-[#CA0A7F]">Checkout</h2>
                    <button onClick={onClose} className="p-2"><X size={24} /></button>
                </div>

                {/* --- LEFT: FORM SECTION --- */}
                <div className="flex-1 bg-white p-6 md:p-12 lg:p-16 md:overflow-y-auto relative">
                    {/* Close Button (Desktop Only) */}
                    <button onClick={onClose} className="hidden md:block absolute right-8 top-8 text-gray-400 hover:text-gray-900">
                        <X size={24} />
                    </button>

                    {isSuccess ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in zoom-in">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
                            <p className="text-gray-500 max-w-sm">
                                Thank you for your purchase. We have received your order and will contact you shortly.
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                REDIRECTING TO SHOP
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                            <h1 className="text-3xl font-bold mb-8 tracking-tight hidden md:block">Checkout</h1>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-10">
                                {/* Shipping Info */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                        <MapPin size={14} /> 01. Shipping Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                        <FloatingInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                        <FloatingInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                        <div className="col-span-2">
                                            <FloatingInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-span-2">
                                            <FloatingInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-span-2">
                                            <FloatingInput label="Full Address" name="address" value={formData.address} onChange={handleInputChange} />
                                        </div>
                                        <FloatingInput label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                        <FloatingInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                        <CreditCard size={14} /> 02. Payment Method
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        <PaymentTab
                                            active={formData.paymentMethod === 'COD'}
                                            onClick={() => setFormData(f => ({ ...f, paymentMethod: 'COD' }))}
                                            icon={<Wallet size={18} />}
                                            label="Cash on Delivery"
                                        />
                                        <PaymentTab
                                            disabled={true}
                                            active={formData.paymentMethod === 'PAYFAST'}
                                            onClick={() => setFormData(f => ({ ...f, paymentMethod: 'PAYFAST' }))}
                                            icon={<CreditCard size={18} />}
                                            label="Online Payment (PayFast)"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className={`w-full py-5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#111] hover:bg-[#CA0A7F] text-white shadow-black/10'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            SECURELY PROCESSING...
                                        </div>
                                    ) : (
                                        <>PLACE ORDER <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* --- RIGHT: ORDER SUMMARY --- */}
                <div className="w-full md:w-[40%] bg-[#FAFAFA] p-6 md:p-12 border-t md:border-t-0 md:border-l border-gray-100 md:overflow-y-auto">
                    <h2 className="text-lg font-bold tracking-tight mb-8 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-[#CA0A7F]" />
                        Order Summary
                    </h2>

                    <div className="space-y-6">
                        {items.map((item) => (
                            <div key={item._id} className="flex gap-4 group">
                                <div className="w-20 h-20 bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                                    <img
                                        src={item.imgs_src?.[0] ? `${API_URL}${item.imgs_src[0]}` : '/placeholder.jpg'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">Ref: {item.productNumber || 'N/A'}</p>
                                    <p className="text-sm font-bold mt-1 text-[#CA0A7F]">{(item.publicPrice || item.price).toLocaleString()} PKR</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-200 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">{totalAmount.toLocaleString()} PKR</span>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-2xl font-black text-[#CA0A7F] tracking-tight">{totalAmount.toLocaleString()} PKR</span>
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                        <ShieldCheck className="text-green-500" size={32} />
                        <p className="text-[11px] font-bold text-gray-400 leading-tight uppercase tracking-wider">
                            Guaranteed <span className="text-gray-900 block">Secure Checkout</span>
                        </p>
                    </div>

                    <div className="h-10 md:hidden" />
                </div>
            </div>
        </div>
    );
}

function FloatingInput({ label, ...props }) {
    return (
        <div className="relative border-b border-gray-200 focus-within:border-[#CA0A7F] transition-all duration-300 pb-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
            <input
                required
                className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-200"
                placeholder="---"
                {...props}
            />
        </div>
    );
}

function PaymentTab({ active, onClick, icon, label, disabled }) {
    return (
        <div
            onClick={disabled ? null : onClick}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${disabled
                ? 'border-gray-50 bg-gray-50/50 cursor-not-allowed opacity-60'
                : active
                    ? 'border-[#CA0A7F] bg-[#CA0A7F]/5 text-[#CA0A7F] cursor-pointer'
                    : 'border-gray-50 bg-white hover:border-gray-200 text-gray-500 cursor-pointer'
                }`}
        >
            <div className={`${active ? 'text-[#CA0A7F]' : 'text-gray-400'}`}>{icon}</div>
            <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
                {disabled && (
                    <span className="text-[10px] font-black text-[#CA0A7F] uppercase tracking-tighter">
                        Coming Soon
                    </span>
                )}
            </div>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-[#CA0A7F]' : 'border-gray-200'}`}>
                {active && <div className="w-2.5 h-2.5 rounded-full bg-[#CA0A7F]" />}
            </div>
        </div>
    );
}