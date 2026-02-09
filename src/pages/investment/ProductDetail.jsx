import { ProductImages } from "../../components/investment/ProductDetail/ProductImages";
import { ProductDetails } from "../../components/investment/ProductDetail/ProductDetails";


export function InvestorProductDetailPage() {

  const flexStyles = "flex flex-col lg:flex-row gap-8 lg:gap-12 lgx:gap-15";

  return (
    <div className="font-satoshi min-h-screen flex flex-col">
      <main className={`pt-8 ${flexStyles} flex-grow`}>
        <ProductImages />
        <ProductDetails />
      </main>
    </div>
  );
}