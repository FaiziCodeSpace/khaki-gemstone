import { useEffect } from "react";
import { Footer } from "../../components/layout/Footer";
import { ProductDetails } from "../../components/public/ProductDetail/ProductDetails";
import { ProductImages } from "../../components/public/ProductDetail/ProductImages";

export function ProductDetailPage() {
  // Define layout constants to avoid long strings in the JSX
  const containerStyles = "px-6 md:px-8 lg:px-14 lgx:px-22 pt-36 md:pt-42";
  const flexStyles = "flex flex-col lg:flex-row gap-8 lg:gap-12 lgx:gap-15";
  useEffect(()=>{
    
  },[])
  return (
    <div className="font-satoshi min-h-screen flex flex-col">
      <main className={`${containerStyles} ${flexStyles} flex-grow`}>
        <ProductImages />
        <ProductDetails />
      </main>

      <Footer />
    </div>
  );
}