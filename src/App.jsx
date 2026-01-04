import './App.css'
import { Navbar } from './components/layout/navbar'
import { LandingPage } from './pages/public/landingPage'
import { ProductDetail } from './pages/public/ProductDetail'
import { ProductsPage } from './pages/public/ProductsPage'

function App() {

  return (
    <main className="font-[Poppins] bg-[#F5F5F5]">
     <Navbar/>
     {/* <LandingPage/> */}
     {/* <ProductsPage/> */}
     <ProductDetail/>
    </main>
  )
}

export default App
