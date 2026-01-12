import { useEffect, useState } from 'react';
import { fetchEvent } from '../../../services/eventService';

export function Events() {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        async function getEvent() {
            try {
                const data = await fetchEvent();
                setEvent(data);
            }catch(err){
                console.error("Fetch Event Error:", err);
            }
        }
        getEvent();
    }, []);

    return (
        <section
            className="
                flex flex-col md:flex-row items-stretch
                mt-40 lg:mt-60 mx-6
                rounded-3xl overflow-hidden
                border-[5px] border-white
                h-[clamp(413px,45.73vw+241.5px,860px)]
            "
        >
            {/* ===================== Content Section ===================== */}
            <div
                className="
                    flex flex-col justify-center items-center
                    bg-[#FFCFE7]
                    py-6 px-6
                    flex-1
                    h-1/2 md:h-auto
                "
            >
                {/* Brand Logo */}
                <div
                    className="
                        bg-white flex-shrink-0
                        flex justify-center items-center
                        rounded-md md:rounded-2xl lgx:rounded-3xl
                        shadow-sm
                        w-[clamp(40px,7.89vw+10.42px,124px)]
                        h-[clamp(40px,7.89vw+10.42px,124px)]
                    "
                >
                    <img
                        src="./Logos/pink-logo.png"
                        alt="Gemstone Company Logo"
                        className="
                            object-contain
                            w-[clamp(28px,5.45vw+7.58px,86px)]
                            h-[clamp(28px,5.45vw+7.58px,86px)]
                        "
                    />
                </div>

                {/* Heading */}
                <h2
                    className="
                        text-[clamp(18px,5vw,72px)]
                        font-semibold
                        text-[#003034]
                        mt-3
                        text-center
                        leading-tight
                    "
                >
                    {event?.subject}
                </h2>

                {/* Description */}
                <p
                    className="
                        text-[clamp(12px,2vw,18px)]
                        font-medium
                        max-w-[530px]
                        text-[#003034]
                        text-center
                        mt-2
                        opacity-90
                    "
                >
                    {event?.description}
                </p>

                {/* Call to Action */}
                <button
                    aria-label="Shop the Summer Sale"
                    className="
                        flex justify-center items-center
                        bg-white md:bg-[#222222]
                        rounded-full
                        transition-transform hover:scale-105
                        leading-none
                        font-semibold
                        text-[#0A0909]
                        text-[clamp(10px,0.75vw+7px,18px)]
                        px-[clamp(26px,1.88vw+18.96px,48px)]
                        py-[clamp(14px,1.88vw+6.96px,24px)]
                        mt-[clamp(8px,3vw-3.27px,40px)]
                        gap-1.5 md:gap-2.5
                    "
                >
                    <span className="inline-block md:invert">
                        SHOP NOW
                    </span>

                    <img
                        src="./Icons/cart.svg"
                        alt=""
                        aria-hidden="true"
                        className="block w-3 h-3 md:w-5 md:h-5 md:invert"
                    />
                </button>
            </div>

            {/* ===================== Visual Section ===================== */}
            <div className="flex-1 h-1/2 md:h-auto">
                <img
                    src="./Images/Showcase2.png"
                    alt="Featured Summer Gemstone Collection"
                    className="w-full h-full object-cover"
                />
            </div>
        </section>
    );
}
