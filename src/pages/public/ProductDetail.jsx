import { Footer } from "../../components/layout/Footer";
import { ProductDetails } from "../../components/public/ProductDetail/ProductDetails";
import { ProductImages } from "../../components/public/ProductDetail/ProductImages";

export function ProductDetail() {
    return (<>
        <main className="font-[Satoshi]">
            <div className="flex flex-col lg:flex-row px-6 md:px-25 pt-36 md:pt-42 gap-15">
                <ProductImages />
                <ProductDetails />
            </div>

            <Footer />
        </main>
    </>);
}