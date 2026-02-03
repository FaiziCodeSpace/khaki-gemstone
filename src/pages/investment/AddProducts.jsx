import { useEffect, useState, useCallback } from "react";
import InvestmentOptions from "../../components/investment/Products/InvestmentOptions";
import { fetchAllProducts } from "../../services/productsService";
// Assuming you have a way to fetch user profile/balance
// import { getInvestorProfile } from "../../services/userService"; 

export default function AddProducts() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalProducts: 0 });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 8,
        search: "",
        portal: "INVESTOR"
    });

    const loadData = useCallback(async () => {
        try {
            const data = await fetchAllProducts(filters);
            if (data) {
                const productsList = data.products || data;
                setProducts(productsList);

                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }, [filters]);

    const handleRefresh = () => {
        loadData();
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <InvestmentOptions
                    availableProducts={products}
                    filters={filters}
                    setFilters={setFilters}
                    pagination={pagination}
                    refreshData={handleRefresh}
                />
            </div>
        </div>
    );
}