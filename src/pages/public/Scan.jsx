import { useEffect } from "react";
import { ProductImages } from "../../components/public/ProductDetail/ProductImages";
import { ScanProductDetail } from "../../components/public/ProductDetail/ScanProductDetail";

export function ScanProductDetailPage() {
  // Define layout constants to avoid long strings in the JSX
  const containerStyles = "px-2 md:px-8 lg:px-14 lgx:px-22 pt-6 md:pt-8";
  const flexStyles = "flex flex-col lg:flex-row gap-8 lg:gap-12 lgx:gap-15";
  useEffect(()=>{
    
  },[])
  return (
    <div className="font-satoshi min-h-screen flex flex-col">
      <main className={`${containerStyles} ${flexStyles} flex-grow`}>
        <ProductImages />
        <ScanProductDetail />
      </main>
    </div>
  );
}