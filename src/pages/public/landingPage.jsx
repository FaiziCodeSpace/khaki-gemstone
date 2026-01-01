import { Footer } from "../../components/layout/Footer";
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