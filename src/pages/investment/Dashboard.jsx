import InvestorProducts from "../../components/investment/Dashboard/Products";
import { InvestorStats } from "../../components/investment/Dashboard/Stats";

const activeProducts = [
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Sold"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Active"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Pending"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Sold"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Active"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Pending"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Active"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Pending"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Sold"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Pending"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Sold"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Sold"},
    {name: "Gemstone",img: "/Images/Showcase1.png", outlet_location: "Dera Ismail Khan", product_id: "101223544", price: "75520", profit_margin: "27", status: "Active"},
]

export default function InvestorDashboard(){
    return(<>
        <main className="flex flex-col gap-9">
            <InvestorStats/>
            <InvestorProducts activeProducts={activeProducts}/>
        </main>
    </>)
}