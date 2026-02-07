import { useEffect, useState, useCallback } from "react";
import InvestorProducts from "../../components/investment/Dashboard/Products";
import { InvestorStats } from "../../components/investment/Dashboard/Stats";
import { investorService } from "../../services/investorServices/investmentService";

export default function InvestorDashboard() {
    const [investments, setInvestments] = useState([]);
    const [stats, setStats] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    // Memoize fetcher to avoid unnecessary re-renders
    const loadDashboardData = useCallback(async (isSilent = false) => {
        try {
            // Fetch both endpoints in parallel for better performance
            const [invData, statsData] = await Promise.all([
                investorService.getMyInvestments(),
                investorService.getInvestorMetrics()
            ]);

            setInvestments(invData);
            setStats(statsData.data);
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
        } finally {
            if (!isSilent) setIsInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        // First load
        loadDashboardData();

        // Background polling every 10 seconds
        const interval = setInterval(() => {
            loadDashboardData(true); // Pass true to keep it 'silent'
        }, 10000);

        return () => clearInterval(interval);
    }, [loadDashboardData]);

    const handleRefund = async (id) => {
        if (!window.confirm("Are you sure you want to request a refund? This action cannot be undone.")) return;

        setProcessingId(id);
        try {
            await investorService.refundInvestment(id);
            // Immediate silent refresh to show updated data
            await loadDashboardData(true);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred during refund.";

            alert(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#CA0A7F]"></div>
                    <p className="mt-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Synchronizing...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex flex-col gap-9">
           <InvestorStats externalData={stats} />

            <InvestorProducts
                investments={investments}
                onRefund={handleRefund}
                processingId={processingId}
            />
        </main>
    );
}