import { useEffect, useState } from "react";
import InvestmentOptions from "../../components/investment/Products/InvestmentOptions";
import { fetchAllProducts } from "../../services/productsService";

export default function AddProducts() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalProducts: 0 });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 8,
        search: "",
        portal: "INVESTOR"
    });

    useEffect(() => {
        async function loadData() {
            // This now sends the specific page and search to your Node/Express backend
            const data = await fetchAllProducts(filters);
            if (data) {
                setProducts(data); // Assuming data is the array
                // If your API returns metadata, capture it:
                if (data.pagination) setPagination(data.pagination);
            }
        }
        loadData();
    }, [filters]); // Re-run when page or search changes

    return (
        <div className="min-h-screen">
            <InvestmentOptions 
                availableProducts={products} 
                filters={filters}
                setFilters={setFilters}
                pagination={pagination}
            />
        </div>
    );
}