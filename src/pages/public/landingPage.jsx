import { AboutUs } from "../../components/public/aboutUs";
import { Categories } from "../../components/public/Categories";
import { ContentBlock } from "../../components/public/ContentBlock";
import { Events } from "../../components/public/events";
import { HeroPortion } from "../../components/public/heroPortion";
import { LimitedEdition } from "../../components/public/limitedEdition";
import { Showcase } from "../../components/public/Showcase";

export function LandingPage() {
    return (
        <>
        <main className="font-[Poppins] bg-[#F5F5F5]">
            <HeroPortion />
            <ContentBlock/>
            <Categories/>
            <Showcase/>
            <AboutUs/>
            <Events/>
            <LimitedEdition/>
        </main>
        </>
    );
}