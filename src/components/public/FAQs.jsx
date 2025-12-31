import { useState } from "react";

const faqData = [
  {
    question: "Are Your Gemstones Natural And Certified?",
    answer: "Yes, all gemstones at Khaki Gem Stone are 100% natural, ethically sourced, and come with a lab certification for authenticity and quality assurance.",
  },
  {
    question: "How Do I Know Which Gemstone Is Right For Me?",
    answer: "We recommend consulting with our specialists or using our guide to find a stone that matches your intention or astrological needs.",
  },
  {
    question: "Do You Offer Customized Gemstone Jewelry?",
    answer: "Absolutely! We work with expert jewelers to create bespoke pieces tailored to your specific design preferences.",
  },
  {
    question: "What Is Your Return Or Exchange Policy?",
    answer: "We offer a 14-day return policy on all non-customized items, provided they are in their original condition.",
  },
  {
    question: "How Are The Gemstones Delivered?",
    answer: "Our gemstones are shipped via insured, tracked couriers in secure, tamper-proof packaging to ensure they arrive safely.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="max-w-[1200px] mt-20 md:mt-40 mx-auto px-6 py-20 flex flex-col items-center">
      
      {/* Header Section */}
      <header className="text-center mb-12">
        <h2 className="text-[#003034] text-[clamp(32px,4vw,56px)] font-bold uppercase tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-[#003034] opacity-70 text-[clamp(13px,1.2vw,16px)] mt-2 max-w-[900px] mx-auto">
          Overcoming Distrust with Effective Communication Tools for Better Understanding and Stronger Relationships
        </p>
      </header>

      {/* Accordion List */}
      <div className="w-full flex flex-col gap-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="bg-[#FFCFE73B] rounded-[24px] overflow-hidden transition-all duration-300 border border-transparent hover:border-[#D81B60]/20"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className={`w-full flex items-center justify-between text-left group transition-all duration-300
                ${openIndex === index ? 'px-6 pt-6 md:px-8 md:pt-8 pb-4' : 'p-6 md:p-8'}
                `}
              aria-expanded={openIndex === index}
            >
              <span className="text-[#003034] text-[clamp(14px,1.8vw,32px)] font-semibold pr-4 leading-snug">
                {faq.question}
              </span>
              
              {/* Toggle Icon */}
              <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors
                ${openIndex === index ? 'bg-[#CA0A7F] text-white' : 'bg-[#F2E5EC] text-[#003034]'}`}>
                {openIndex === index ? (
                  <span className="text-2xl font-medium leading-none">−</span>
                ) : (
                  <span className="text-2xl font-medium leading-none">+</span>
                )}
              </div>
            </button>

            {/* Answer Panel */}
            <div
              className={`transition-all duration-300 ease-in-out px-6 md:px-8 overflow-hidden
                ${openIndex === index ? 'max-h-[200px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-[#003034] opacity-80 text-[clamp(13px,1.1vw,16px)] leading-relaxed max-w-[850px]">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}