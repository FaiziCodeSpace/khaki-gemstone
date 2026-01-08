import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { CartPage } from './pages/public/CartPage';
import { LandingPage } from './pages/public/landingPage';
import LoginUser from './pages/public/Login';
import { ProductDetailPage } from './pages/public/ProductDetail';
import { ProductsPage } from './pages/public/ProductsPage';
import RegisterUser from './pages/public/RegisterUser';
import { Navbar } from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <main className="font-[Poppins] bg-[#F5F5F5] min-h-screen">
        <Navbar />
        
        {/* The Routes determine which component to show based on the URL */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;