import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/public/landingPage";
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailPage } from "./pages/public/ProductDetail";
import { CartPage } from "./pages/public/CartPage";
import LoginUser from "./pages/public/Login";
import RegisterUser from "./pages/public/RegisterUser";
import PublicLayout from "./Layout/PublicLayout";
import InvestorLayout from "./Layout/InvestorLayout";
import LoginInvestor from "./pages/investment/LoginInvestor";
import RegisterInvestor from "./pages/investment/RegisterInvestor";
import InvestorDashboard from "./pages/investment/Dashboard";
import AddProducts from "./pages/investment/AddProducts";

function App() {
  return (
    <Router>
      <main>
        <Routes>

          {/* 🌍 Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/login" element={<LoginUser />} />
          </Route>

          {/* 💼 Investor Area */}
          <Route element={<InvestorLayout />}>
            <Route path="/investor/dashboard" element={<InvestorDashboard/>}/>
            <Route path="/investor/products" element={<AddProducts/>}/>
            <Route path="/investor/login" element={<LoginInvestor />} />
            <Route path="/investor/register" element={<RegisterInvestor />} />
          </Route>

        </Routes>
      </main>
    </Router>
  );
}

export default App;
