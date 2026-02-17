import { Helmet } from "react-helmet-async"; 
import { Footer } from "../../components/common/Footer";
import { AboutUs } from "../../components/public/Home/AboutUs";
import { Categories } from "../../components/public/Home/Categories";
import { ContentBlock } from "../../components/public/Home/ContentBlock";
import { Events } from "../../components/public/Home/Events";
import { FAQ } from "../../components/public/Home/FAQs";
import { HeroPortion } from "../../components/public/Home/HeroPortion";
import { LimitedEdition } from "../../components/public/Home/LimitedEdition";
import { Showcase } from "../../components/public/Home/Showcase";

export function LandingPage() {
    return (
        <>
            <Helmet>
                <title>Khaki Gemstone | Authentic Natural Gemstones & Investment Portal</title>
                <meta name="description" content="Shop premium natural gemstones and explore trade investment opportunities with Khaki Gemstone. Quality, transparency, and beauty in every stone." />
                <link rel="canonical" href="https://khakigemstone.com/" />
            </Helmet>

            <main>
                <HeroPortion />
                <ContentBlock/>
                <Categories/>
                <Showcase/>
                <AboutUs/>
                <Events/>
                <LimitedEdition/>
                <FAQ/>
                <Footer/>
            </main>
        </>
    );
}