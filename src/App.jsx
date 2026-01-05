import './App.css'
import { Navbar } from './components/layout/navbar'
import { LandingPage } from './pages/public/landingPage'
import { ProductDetailPage } from './pages/public/ProductDetail'
import { ProductsPage } from './pages/public/ProductsPage'

function App() {

  return (
    <main className="font-[Poppins] bg-[#F5F5F5]">
     <Navbar/>
     {/* <LandingPage/> */}
     {/* <ProductsPage/> */}
     <ProductDetailPage/>
    </main>
  )
}

export default App
