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

                <meta
                    name="description"
                    content="Shop premium natural gemstones including agate, sapphire, and rare stones. Khaki Gemstone offers certified natural stones with worldwide shipping."
                />

                <meta name="robots" content="index, follow" />

                <link rel="canonical" href="https://khakigemstone.com/" />

                {/* Open Graph */}
                <meta property="og:title" content="Khaki Gemstone | Authentic Natural Gemstones" />
                <meta property="og:description" content="Premium natural gemstones sourced directly from nature." />
                <meta property="og:url" content="https://khakigemstone.com/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://khakigemstone.com/Logos/logo.png" />
            </Helmet>

            <main>
                <HeroPortion />
                <ContentBlock />
                <Categories />
                <Showcase />
                <AboutUs />
                <Events />
                <LimitedEdition />
                <FAQ />
                <Footer />
            </main>
        </>
    );
}