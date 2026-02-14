import { Plus, Wallet, ArrowUpRight, Banknote, BanknoteArrowUp } from "lucide-react";
import { Link } from 'react-router-dom';
import { investorService } from "../../services/investorServices/investmentService";
import { useEffect, useState } from "react";

export default function InvestorWallet() {
  // 1. Matched initial state keys to the ones used in your UI mapping
  const [walletMetrics, setWalletMetrics] = useState({
    totalBalance: 0,
    profitFromSold: 0,
    totalInvestment: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await investorService.getInvestorMetrics();
        setWalletMetrics({
          totalBalance: metrics.data?.totalBalance ?? 0,
          profitFromSold: metrics.data?.profitFromSold ?? 0,
          totalInvestment: metrics.data?.totalInvestment ?? 0
        });
      } catch (error) {
        console.error("Error fetching investor metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  // 3. Keep your exact UI mapping logic
  const walletDetail = [
    { label: 'Total Balance', value: walletMetrics.totalBalance.toLocaleString(), color: 'text-indigo-600' },
    { label: 'Earning', value: walletMetrics.profitFromSold.toLocaleString(), color: 'text-slate-900' },
    { label: 'Investment', value: walletMetrics.totalInvestment.toLocaleString(), color: 'text-emerald-600' }
  ];

  return (
    <section className="w-full">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Your Wallet</h2>
          <p className="text-sm text-slate-500 font-medium">Manage your funds and investment capital</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-green-600 px-5 py-3 text-sm text-white font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 w-full lg:w-auto">
            <BanknoteArrowUp size={18} strokeWidth={3} />
            <span>Checkout</span>
          </button>
          <Link to="/investor/wallet/addbalance" className="w-full lg:w-auto">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 py-3 text-sm text-white font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 w-full">
              <Plus size={18} strokeWidth={3} />
              <span>Add Balance</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {walletDetail.map((wallet, index) => (
          <div
            key={index}
            className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {wallet.label}
              </span>
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                {index === 0 ? <Wallet size={16} className="text-slate-400 group-hover:text-indigo-600" /> :
                  index === 1 ? <ArrowUpRight size={16} className="text-slate-400 group-hover:text-emerald-600" /> :
                    <Banknote size={16} className="text-slate-400 group-hover:text-slate-600" />}
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-400">Rs</span>
              <h2 className={`text-3xl lg:text-4xl font-black tracking-tight ${wallet.color}`}>
                {wallet.value}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}