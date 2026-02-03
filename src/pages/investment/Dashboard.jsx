import { useEffect, useState } from "react";
import InvestorProducts from "../../components/investment/Dashboard/Products";
import { InvestorStats } from "../../components/investment/Dashboard/Stats";
import { investorService } from "../../services/investorServices/investmentService";


export default function InvestorDashboard() {
    const [investments, setInvestments] = useState([]);
    useEffect(() => {
        const loadPortfolio = async () => {
            try {
                const data = await investorService.getMyInvestments();
                setInvestments(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadPortfolio();
    }, []);
    return (<>
        <main className="flex flex-col gap-9">
            <InvestorStats />
            <InvestorProducts investments={investments} />
        </main>
    </>)
}