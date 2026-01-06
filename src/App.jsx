import './App.css'
import { Navbar } from './components/layout/navbar'
import { CartPage } from './pages/public/CartPage'
import { LandingPage } from './pages/public/landingPage'
import LoginUser from './pages/public/Login'
import { ProductDetailPage } from './pages/public/ProductDetail'
import { ProductsPage } from './pages/public/ProductsPage'
import RegisterUser from './pages/public/RegisterUser'

function App() {

  return (
    <main className="font-[Poppins] bg-[#F5F5F5]">
     {/* <Navbar/> */}
     {/* <LandingPage/> */}
     {/* <ProductsPage/> */}
     {/* <ProductDetailPage/> */}
     {/* <CartPage/> */}
     {/* <RegisterUser/> */}
     <LoginUser/>
    </main>
  )
}

export default App
