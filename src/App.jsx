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
import TermsAndPolicies from "./pages/investment/TermsAndPolicies";
import InvestorWallet from "./pages/investment/Wallet";
import PricingTable from "./pages/investment/PricingTable";
import Settings from "./pages/investment/Settings";
import NotFound from "./pages/other/NotFound";
import SuccessNotification from "./pages/other/SuccessNotification";
import ProtectedRoute from "./routes/InvestorProtectedRoute";
import PublicRoute from "./routes/PublicProtectedRoute"; 

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
            
            {/* Prevent logged-in users from accessing standard login/register */}
            <Route 
              path="/register" 
              element={<PublicRoute><RegisterUser /></PublicRoute>} 
            />
            <Route 
              path="/login" 
              element={<PublicRoute><LoginUser /></PublicRoute>} 
            />
          </Route>

          {/* 💼 Investor Area */}
          <Route element={<InvestorLayout />}>
            {/* Secured Investor Routes */}
            <Route
              path="/investor/dashboard"
              element={<ProtectedRoute><InvestorDashboard /></ProtectedRoute>}
            />
            <Route
              path="/investor/products"
              element={<ProtectedRoute><AddProducts /></ProtectedRoute>}
            />
            <Route
              path="/investor/wallet"
              element={<ProtectedRoute><InvestorWallet /></ProtectedRoute>}
            />
            <Route
              path="/investor/wallet/addbalance"
              element={<ProtectedRoute><PricingTable /></ProtectedRoute>}
            />
            <Route
              path="/investor/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route
              path="/investor/policy"
              element={<ProtectedRoute><TermsAndPolicies /></ProtectedRoute>}
            />

            {/* Prevent logged-in investors from accessing investor login/register */}
            <Route 
              path="/investor-login" 
              element={<PublicRoute><LoginInvestor /></PublicRoute>} 
            />
            <Route 
              path="/investor-register" 
              element={<PublicRoute><RegisterInvestor /></PublicRoute>} 
            />
            
            <Route path="/investor-application-submitted" element={<SuccessNotification />} />
          </Route>

          {/* 🚫 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;