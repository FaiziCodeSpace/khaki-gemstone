import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/public/landingPage";
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailPage } from "./pages/public/ProductDetail";
import { CartPage } from "./pages/public/CartPage";
import RegisterUser from "./pages/public/RegisterUser";
import LoginUser from "./pages/public/Login";
import InvestorLayout from "./components/Layout/InvestorLayout"
import LoginInvestor from "./pages/investment/LoginInvestor";
import PublicLayout from "./components/layout/PublicLayout";

function App() {
  return (
    <Router>
      <main className="font-[Poppins] bg-[#F5F5F5] min-h-screen">
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
            <Route path="/investor/login" element={<LoginInvestor />} />
            <Route path="/investor/register" element={<LoginInvestor />} />
          </Route>

        </Routes>
      </main>
    </Router>
  );
}

export default App;
