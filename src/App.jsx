import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";

/* =======================
   🌍 PUBLIC (NO LAZY)
======================= */
import PublicLayout from "./Layout/PublicLayout";
import { LandingPage } from "./pages/public/landingPage";
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailPage } from "./pages/public/ProductDetail";
import { CartPage } from "./pages/public/CartPage";
import LoginUser from "./pages/public/Login";
import RegisterUser from "./pages/public/RegisterUser";

/* =======================
   🔐 ROUTE GUARDS
======================= */
import ProtectedRoute from "./routes/InvestorProtectedRoute";
import PublicRoute from "./routes/PublicProtectedRoute";

/* =======================
   🧩 OTHER
======================= */
import NotFound from "./pages/other/NotFound";
import SuccessNotification from "./pages/other/SuccessNotification";
import Dashboard from "./pages/admin/Dashboard";
import ProductsManagment from "./pages/admin/Products";
import FormBox from "./components/admin/Products/FormBox";
import Applications from "./pages/admin/Applications";
import CategoriesManagment from "./pages/admin/TaxonomyControl";
import OrderManagement from "./pages/admin/Orders";
import TransactionHistory from "./pages/admin/Transaction";
import InvestorManagement from "./pages/admin/Investors";
import AdminManagement from "./pages/admin/AdminManagment/AdminManage";
import { AdminLogin } from "./pages/admin/AdminManagment/AdminLogin";
import { AuthProvider } from "./context/AuthContext";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import { AboutUs } from "./components/public/Home/AboutUs";
import AboutUsPage from "./pages/public/AboutUs";
import TermsAndConditions from "./pages/public/TermsAndConditions";
import { InvestorProductDetailPage } from "./pages/investment/ProductDetail";
import { ScanProductDetailPage } from "./pages/public/Scan";
import InvestorTerms from "./pages/investment/InvestorTerms";
import CheckoutForm from "./pages/investment/CheckoutForm";
import PayoutRequests from "./pages/admin/PayoutRequests";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./utils/ScrollToTop";

/* =======================
   💼 INVESTOR (LAZY)
======================= */
const InvestorLayout = lazy(() => import("./Layout/InvestorLayout"));
const InvestorDashboard = lazy(() => import("./pages/investment/Dashboard"));
const AddProducts = lazy(() => import("./pages/investment/AddProducts"));
const InvestorWallet = lazy(() => import("./pages/investment/Wallet"));
const PricingTable = lazy(() => import("./pages/investment/PricingTable"));
const TermsAndPolicies = lazy(() => import("./pages/investment/TermsAndPolicies"));
const LoginInvestor = lazy(() => import("./pages/investment/LoginInvestor"));
const RegisterInvestor = lazy(() => import("./pages/investment/RegisterInvestor"));

/* =======================
   🛠️ ADMIN (ONLY LAYOUT FOR NOW)
======================= */
const AdminLayout = lazy(() => import("./Layout/AdminLayout"));

/* =======================
   ⏳ UTILS
======================= */
const Loader = () => (
  <div style={{ padding: "3rem", textAlign: "center" }}>
    Loading...
  </div>
);

function App() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  return (
    <HelmetProvider>
      <Router>
        {/* ScrollToTop MUST be inside Router but outside Routes */}
        <ScrollToTop />
        
        <main>
          <Routes>

            {/* =======================
                🌍 PUBLIC WEBSITE
            ======================= */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/aboutUs" element={<AboutUsPage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/scan/:id" element={<ScanProductDetailPage />} />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterUser />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginUser />
                  </PublicRoute>
                }
              />
            </Route>

            {/* =======================
                💼 INVESTOR PORTAL (LAZY)
            ======================= */}
            <Route
              element={
                <Suspense fallback={<Loader />}>
                  <InvestorLayout />
                </Suspense>
              }
            >
              <Route
                path="/investor/dashboard"
                element={
                  <ProtectedRoute>
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/investor-terms" element={<InvestorTerms setHasAcceptedTerms={setHasAcceptedTerms} />} />
              <Route
                path="/investor/products"
                element={
                  <ProtectedRoute>
                    <AddProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investor/wallet"
                element={
                  <ProtectedRoute>
                    <InvestorWallet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investor/wallet/addbalance"
                element={
                  <ProtectedRoute>
                    <PricingTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/investor/wallet/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/investor/policy"
                element={
                  <ProtectedRoute>
                    <TermsAndPolicies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investor/product/:id"
                element={
                  <ProtectedRoute>
                    <InvestorProductDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/investor-login"
                element={
                  <PublicRoute>
                    <LoginInvestor />
                  </PublicRoute>
                }
              />
              <Route
                path="/investor-register"
                element={
                  <PublicRoute>
                    <RegisterInvestor termsAccepted={hasAcceptedTerms} />
                  </PublicRoute>
                }
              />

              <Route
                path="/investor-application-submitted"
                element={<SuccessNotification />}
              />
            </Route>

            {/* =======================
                🛠️ ADMIN (LAYOUT ONLY)
            ======================= */}
            <Route element={<AuthProvider />}>
              <Route path="/admin-login" element={<AdminLogin />} />

              <Route
                element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<Loader />}>
                      <AdminLayout />
                    </Suspense>
                  </AdminProtectedRoute>
                }
              >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductsManagment />} />
                <Route path="/admin/products/formbox" element={<FormBox />} />
                <Route path="/admin/products/formbox/:productId" element={<FormBox />} />
                <Route path="/admin/TaxonomyControl" element={<CategoriesManagment />} />
                <Route path="/admin/applications" element={<Applications />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/investors" element={<InvestorManagement />} />
                <Route path="/admin/transactions" element={<TransactionHistory />} />
                <Route path="/admin/AdminManagement" element={<AdminManagement />} />
                <Route path="/admin/Payout" element={<PayoutRequests />} />
              </Route>
            </Route>

            {/* =======================
                🚫 404
            ======================= */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>
      </Router>
    </HelmetProvider>
  );
}

export default App;