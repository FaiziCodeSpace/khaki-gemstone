import { useEffect, useState } from 'react';
import { investorService } from "../../services/investorServices/investmentService";

const InvestorCheckout = () => {
  // UI & Logic States
  const [method, setMethod] = useState('');
  const [showAllWallets, setShowAllWallets] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profitFromSold, setProfitFromSold] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uiError, setUiError] = useState('');

  // Form Input States
  const [fullName, setFullName] = useState('');
  const [iban, setIban] = useState('');
  const [phone, setPhone] = useState('');

  // Fetch Investor Metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await investorService.getInvestorMetrics();
        setProfitFromSold(response.data.profitFromSold || 0);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };
    fetchMetrics();
  }, []);

  // Validation Logic
  const validateForm = () => {
    if (!fullName.trim()) return "Please enter the Account Holder Name.";
    if (method === 'bank') {
      if (!iban || iban.length < 14) return "Please enter a valid IBAN/Account Number.";
    } else {
      if (!phone || phone.length < 10) return "Please enter a valid mobile number.";
    }
    if (profitFromSold <= 0) return "You have no earnings available for payout.";
    return null;
  };

  // Submit Payout
  const handleConfirmPayout = async () => {
    const localError = validateForm();
    if (localError) {
      setUiError(localError);
      return;
    }

    setUiError('');
    setLoading(true);

    const payload = {
      method,
      accountDetails: {
        accountHolderName: fullName,
        iban: method === 'bank' ? iban : undefined,
        phoneNumber: method !== 'bank' ? phone : undefined,
      }
    };

    try {
      const response = await investorService.submitPayout(payload);
      if (response.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      // 'err' here is the string thrown by your investorService catch block
      setUiError(err); 
    } finally {
      setLoading(false);
    }
  };

  const mainMethods = [
    { id: 'bank', label: 'Commercial Bank', icon: '🏦' },
    { id: 'sadapay', label: 'SadaPay', icon: '/Images/wallets-logo/sadapay.png' },
    { id: 'nayapay', label: 'NayaPay', icon: '/Images/wallets-logo/nayapay.png' },
  ];

  const otherWallets = [
    { id: 'easypaisa', label: 'Easypaisa', icon: '/Images/wallets-logo/easypaisa.png' },
    { id: 'jazzcash', label: 'JazzCash', icon: '/Images/wallets-logo/jazzcash.png' },
    { id: 'upaisa', label: 'UPaisa', icon: '/Images/wallets-logo/upaisa.png' },
    { id: 'keenu', label: 'Keenu Wallet', icon: '/Images/wallets-logo/keenu.png' },
    { id: 'finja', label: 'Finja', icon: '/Images/wallets-logo/finja.png' },
  ];

  const allMethods = [...mainMethods, ...otherWallets];
  const filteredWallets = allMethods.filter(m => 
    m.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* SUCCESS MODAL OVERLAY */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-500">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Request Confirmed</h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">Your payout is being processed. Funds typically arrive in your account within 24 hours.</p>
            <button 
              onClick={() => window.location.href = '/investor/dashboard'} 
              className="w-full mt-8 py-4 bg-[#CA0A7F] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#CA0A7F]/30 transition-all active:scale-95"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payout Settings</h1>
          <p className="text-slate-500 mt-2">Manage your withdrawal methods and settlement details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: SELECTION & DETAILS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Method Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="font-bold text-slate-800">Select Payout Route</h2>
                  <p className="text-xs text-slate-400 mt-1">Preferred financial institution</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Search methods..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#CA0A7F]/20 outline-none transition-all"
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if(e.target.value) setShowAllWallets(true);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(showAllWallets ? filteredWallets : mainMethods).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {setMethod(item.id); setUiError('');}}
                    className={`relative flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-200 group ${
                      method === item.id 
                      ? 'border-[#CA0A7F] bg-[#CA0A7F]/5 ring-1 ring-[#CA0A7F]' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-3">
                      {item.id === 'bank' ? (
                        <span className="text-3xl">{item.icon}</span>
                      ) : (
                        <img src={item.icon} alt={item.label} className="w-full h-full object-contain grayscale-[0.5] group-hover:grayscale-0" />
                      )}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${method === item.id ? 'text-[#CA0A7F]' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
                {!showAllWallets && (
                  <button onClick={() => setShowAllWallets(true)} className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-slate-200 text-slate-400 hover:text-[#CA0A7F] hover:border-[#CA0A7F] transition-all">
                    <span className="text-xl font-bold">+</span>
                    <span className="text-[10px] font-bold uppercase">More</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. Form Inputs */}
            <div className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-300 ${method ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <h2 className="font-bold text-slate-800 mb-6">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Holder Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus:border-[#CA0A7F] outline-none transition-all" 
                    placeholder="Enter full name" 
                  />
                </div>

                {method === 'bank' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">IBAN / Account Number</label>
                    <input 
                      type="text" 
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus:border-[#CA0A7F] outline-none font-mono" 
                      placeholder="PK00 XXXX XXXX XXXX" 
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                    <div className="flex">
                      <div className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-xl px-4 flex items-center font-bold text-slate-500 text-sm">+92</div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 rounded-r-xl px-4 py-3 border border-slate-200 focus:border-[#CA0A7F] outline-none" 
                        placeholder="3001234567" 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* BACKEND & UI ERROR MESSAGE */}
              {uiError && (
                <div className="mt-6 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold uppercase leading-tight">{uiError}</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SUMMARY */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CA0A7F] opacity-10 blur-[50px]"></div>
              
              <h3 className="text-lg font-bold mb-8 border-b border-white/10 pb-4">Transaction Summary</h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Payout Route</span>
                  <span className="font-semibold text-[#CA0A7F] capitalize">{method || 'Not Selected'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Processing Fee</span>
                  <span className="text-emerald-400 font-medium tracking-wide">FREE</span>
                </div>
                
                <div className="pt-8 mt-4 border-t border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-2">Total Payout Amount</span>
                  <span className="text-4xl font-bold">Rs. {profitFromSold.toLocaleString()}</span>
                </div>

                <button 
                  disabled={!method || loading}
                  onClick={handleConfirmPayout}
                  className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.1em] transition-all duration-300 mt-6 flex items-center justify-center gap-3 ${
                    method && !loading 
                    ? 'bg-[#CA0A7F] hover:bg-[#b0096e] hover:shadow-xl hover:shadow-[#CA0A7F]/20 active:scale-95' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>PROCESSING...</span>
                    </div>
                  ) : 'CONFIRM PAYOUT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorCheckout;